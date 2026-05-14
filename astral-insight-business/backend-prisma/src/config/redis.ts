import { createClient, RedisClientType } from 'redis';
import { logger } from '../utils/logger';

let redisClient: RedisClientType | null = null;
let pubSubClient: RedisClientType | null = null;

export async function initRedisClient(): Promise<RedisClientType> {
  if (redisClient) return redisClient;

  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    redisClient.on('error', (err) => logger.error({ err }, 'Redis Client Error'));
    redisClient.on('connect', () => logger.info('Redis Client Connected'));

    await redisClient.connect();

    // Create separate client for Pub/Sub
    pubSubClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    await pubSubClient.connect();

    return redisClient;
  } catch (error) {
    logger.error({ error }, 'Failed to initialize Redis');
    throw error;
  }
}

export async function initRedis(): Promise<RedisClientType> {
  return initRedisClient();
}

export function getRedisClient(): RedisClientType {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call initRedisClient() first.');
  }
  return redisClient;
}

export function getPubSubClient(): RedisClientType {
  if (!pubSubClient) {
    throw new Error('Redis Pub/Sub client not initialized. Call initRedisClient() first.');
  }
  return pubSubClient;
}

export async function closeRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
  if (pubSubClient) {
    await pubSubClient.quit();
    pubSubClient = null;
  }
}

// For Socket.io compatibility
export const redis = {
  subscribe: (channel: string, callback?: (err: Error | null, count?: number) => void) => {
    if (pubSubClient) {
      pubSubClient.subscribe(channel, callback as any);
    }
  },
  on: (event: string, handler: (...args: any[]) => void) => {
    if (pubSubClient) {
      pubSubClient.on(event as any, handler as any);
    }
  },
  publish: async (channel: string, message: string) => {
    if (redisClient) {
      await redisClient.publish(channel, message);
    }
  },
};

// Cache utility functions
export async function cacheGet<T>(key: string): Promise<T | null> {
  const client = getRedisClient();
  const data = await client.get(key);
  return data ? JSON.parse(data) : null;
}

export async function cacheSet<T>(key: string, value: T, expiresIn: number = 3600): Promise<void> {
  const client = getRedisClient();
  await client.setEx(key, expiresIn, JSON.stringify(value));
}

export async function cacheDel(key: string): Promise<void> {
  const client = getRedisClient();
  await client.del(key);
}

export async function cacheInvalidatePattern(pattern: string): Promise<void> {
  const client = getRedisClient();
  const keys = await client.keys(pattern);
  if (keys.length > 0) {
    await client.del(keys);
  }
}
