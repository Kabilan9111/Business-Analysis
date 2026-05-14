import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyticsRoutes from './api/routes';
import { prisma } from './config/prisma';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// ============================================================================
// MIDDLEWARE
// ============================================================================

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================================
// LOGGING MIDDLEWARE
// ============================================================================

app.use((req: Request, res: Response, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// ============================================================================
// ROUTES
// ============================================================================

app.use('/api', analyticsRoutes);

// ============================================================================
// ROOT ENDPOINT
// ============================================================================

app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'AstralInsight BA - Enterprise Analytics Platform API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      kpis: '/api/kpis',
      revenue_trend: '/api/revenue-trend',
      top_products: '/api/top-products',
      customers: '/api/customers',
      orders: '/api/orders',
      forecast: '/api/forecast',
      regions: '/api/regions',
      risk_alerts: '/api/risk-alerts',
      ai_insights: '/api/ai-insights',
      channels: '/api/channels',
      customer_segmentation: '/api/customer-segmentation'
    }
  });
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

// ============================================================================
// 404 HANDLER
// ============================================================================

app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found'
  });
});

// ============================================================================
// SERVER START
// ============================================================================

async function startServer() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connected successfully');

    app.listen(port, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║         AstralInsight BA - Analytics API Server           ║
╚════════════════════════════════════════════════════════════╝

🚀 Server running on http://localhost:${port}

📊 Available Endpoints:
   • GET /api/kpis
   • GET /api/revenue-trend
   • GET /api/top-products
   • GET /api/customers
   • GET /api/orders
   • GET /api/forecast
   • GET /api/regions
   • GET /api/risk-alerts
   • GET /api/ai-insights
   • GET /api/channels
   • GET /api/customer-segmentation

🔗 Root: http://localhost:${port}/

`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();

export default app;
