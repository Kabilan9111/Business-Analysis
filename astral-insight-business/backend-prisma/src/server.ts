import 'dotenv/config';
import http from 'http';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Config & Services
import { initRedisClient, closeRedis } from './config/redis';
import { logger } from './utils/logger';
import { prisma } from './config/prisma';
import { initRealtimeGateway } from './sockets/realtime.gateway';

// Middleware
import { errorHandler, asyncHandler } from './middleware/errorHandler';
import { validateRequest } from './middleware/validation';

// Routes
import apiRoutes from './api/routes';

// ============================================================================
// APP SETUP
// ============================================================================

const app: Express = express();
const port = process.env.PORT || 3001;

// Create HTTP server for Socket.io
const httpServer = http.createServer(app);

// ============================================================================
// SECURITY MIDDLEWARE
// ============================================================================

app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests, please try again later.',
});

app.use('/api/', limiter);

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5174',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ============================================================================
// BODY PARSER MIDDLEWARE
// ============================================================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================================================
// REQUEST LOGGING MIDDLEWARE
// ============================================================================

app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    };

    if (res.statusCode >= 400) {
      logger.warn(logData);
    } else {
      logger.debug(logData);
    }
  });

  next();
});

// ============================================================================
// ROUTES
// ============================================================================

app.use('/api', apiRoutes);

// ============================================================================
// ROOT ENDPOINT
// ============================================================================

app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'AstralInsight BA - Premium Enterprise Analytics Platform',
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// ERROR HANDLING MIDDLEWARE
// ============================================================================

app.use(errorHandler);

// ============================================================================
// 404 HANDLER
// ============================================================================

app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    code: 'NOT_FOUND',
    message: 'Endpoint not found',
  });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

async function startServer() {
  try {
    logger.info('Starting AstralInsight BA Server...');

    // Initialize Redis
    await initRedisClient();
    logger.info('✅ Redis connected');

    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    logger.info('✅ Database connected');

    // Initialize real-time gateway (Socket.io)
    const realtimeGateway = initRealtimeGateway(httpServer);
    logger.info('✅ Real-time gateway initialized');

    // Start HTTP server
    httpServer.listen(port, () => {
      logger.info(`✅ Server running on port ${port}`);

      console.log(`
╔════════════════════════════════════════════════════════════════╗
║     AstralInsight BA - Enterprise Analytics Platform         ║
║                 Premium Intelligence Engine                   ║
╚════════════════════════════════════════════════════════════════╝

🚀 Server Status: RUNNING
📊 API Port: ${port}
🔗 API URL: http://localhost:${port}/api
💬 WebSocket: ws://localhost:${port}

📋 Major Feature Modules:
   ✓ Sales Dashboard Analytics
   ✓ AI-Powered Forecasting
   ✓ Real-Time Alerting System
   ✓ Shopify Integration
   ✓ Stripe Payment Analytics
   ✓ Google Analytics Integration
   ✓ AI Copilot Intelligence
   ✓ Advanced Anomaly Detection
   ✓ Churn Prediction Engine
   ✓ Inventory Forecasting

🔐 Security Features:
   ✓ JWT Authentication
   ✓ Role-Based Access Control
   ✓ Rate Limiting
   ✓ Helmet Security Headers
   ✓ CORS Protection

💾 Data Layer:
   ✓ PostgreSQL (27 models)
   ✓ Redis Caching
   ✓ Prisma ORM
   ✓ Decimal.js Financial Precision

🎯 API Documentation:
   GET  /api/health                    - Health check
   GET  /api/sales/dashboard           - Sales metrics
   POST /api/forecast/revenue          - Revenue forecasting
   GET  /api/alerts/active             - Active alerts
   GET  /api/shopify/orders            - Shopify orders
   GET  /api/stripe/revenue            - Stripe revenue
   GET  /api/ga/traffic                - Google Analytics
   POST /api/copilot/chat              - AI Copilot

`);
    });

    // Handle graceful shutdown
    const shutdown = async () => {
      logger.info('🛑 Initiating graceful shutdown...');

      // Stop alert polling
      realtimeGateway.stopAlertPolling();

      // Close Socket.io connections
      realtimeGateway.getIO().close();

      // Close HTTP server
      httpServer.close(async () => {
        await closeRedis();
        await prisma.$disconnect();
        logger.info('✅ Server shutdown complete');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('⚠️  Forcing shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    logger.error({ error }, '❌ Failed to start server');
    process.exit(1);
  }
}

// ============================================================================
// START SERVER
// ============================================================================

startServer();

export { app, httpServer };
