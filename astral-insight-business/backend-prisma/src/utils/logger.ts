import pino from 'pino';

const isDev = process.env.NODE_ENV === 'development';

const pinoLogger = pino({
  level: process.env.LOG_LEVEL || 'debug',
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
});

export const logger = pinoLogger;
