import NodeCache from 'node-cache';
import { logger } from '../utils/logger';
import { EventEmitter } from 'events';

// In-memory cache fallback to avoid ECONNREFUSED if Redis is down
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });
const pubSub = new EventEmitter();

// Mock Redis client for compatibility
export async function initRedisClient(): Promise<any> {
  logger.info('Initialized in-memory cache fallback (Redis disabled)');
  return {};
}

export async function initRedis(): Promise<any> {
  return initRedisClient();
}

export function getRedisClient(): any {
  return {};
}

export function getPubSubClient(): any {
  return {};
}

export async function closeRedis(): Promise<void> {
  cache.flushAll();
}

// For Socket.io compatibility
export const redis = {
  subscribe: (channel: string, callback?: (err: Error | null, count?: number) => void) => {
    // Basic mock
  },
  on: (event: string, handler: (...args: any[]) => void) => {
    pubSub.on(event, handler);
  },
  publish: async (channel: string, message: string) => {
    pubSub.emit('message', channel, message);
  },
};

// Cache utility functions using node-cache
export async function cacheGet<T>(key: string): Promise<T | null> {
  const data = cache.get<string>(key);
  return data ? JSON.parse(data) as T : null;
}

export async function cacheSet<T>(key: string, value: T, expiresIn: number = 3600): Promise<void> {
  cache.set(key, JSON.stringify(value), expiresIn);
}

export async function cacheDel(key: string): Promise<void> {
  cache.del(key);
}

export async function cacheInvalidatePattern(pattern: string): Promise<void> {
  // node-cache doesn't support glob patterns easily, but we can iterate keys
  const keys = cache.keys();
  // Very simplistic regex conversion for pattern matching if needed
  const regex = new RegExp(pattern.replace('*', '.*'));
  const matchingKeys = keys.filter(k => regex.test(k));
  if (matchingKeys.length > 0) {
    cache.del(matchingKeys);
  }
}

