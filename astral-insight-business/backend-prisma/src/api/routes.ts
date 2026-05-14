import { Router, Request, Response } from 'express';
import { prisma } from '../config/prisma';
import AnalyticsService from '../services/analytics.service';

const router = Router();

// ============================================================================
// KPI ENDPOINTS
// ============================================================================

router.get('/kpis', async (req: Request, res: Response) => {
  try {
    const days = req.query.days ? parseInt(req.query.days as string) : 30;

    const metrics = await AnalyticsService.getDashboardMetrics(days);

    res.json({
      status: 'success',
      data: metrics
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: (error as Error).message
    });
  }
});

// ============================================================================
// REVENUE TREND
// ============================================================================

router.get('/revenue-trend', async (req: Request, res: Response) => {
  try {
    const days = req.query.days ? parseInt(req.query.days as string) : 30;
    const trend = await AnalyticsService.getRevenueTrend(days);

    res.json({
      status: 'success',
      data: trend
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: (error as Error).message
    });
  }
});

// ============================================================================
// TOP PRODUCTS
// ============================================================================

router.get('/top-products', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const products = await AnalyticsService.getTopProducts(limit);

    res.json({
      status: 'success',
      data: products
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: (error as Error).message
    });
  }
});

// ============================================================================
// CUSTOMERS
// ============================================================================

router.get('/customers', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const customers = await prisma.customer.findMany({
      take: limit,
      orderBy: { customerLifetimeValue: 'desc' }
    });

    res.json({
      status: 'success',
      data: customers
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: (error as Error).message
    });
  }
});

// ============================================================================
// ORDERS
// ============================================================================

router.get('/orders', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    const orders = await prisma.order.findMany({
      take: limit,
      include: {
        customer: true,
        product: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      status: 'success',
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: (error as Error).message
    });
  }
});

// ============================================================================
// FORECAST
// ============================================================================

router.get('/forecast', async (req: Request, res: Response) => {
  try {
    const days = req.query.days ? parseInt(req.query.days as string) : 30;
    const forecasts = await AnalyticsService.getForecastData(days);

    res.json({
      status: 'success',
      data: forecasts
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: (error as Error).message
    });
  }
});

// ============================================================================
// REGIONS
// ============================================================================

router.get('/regions', async (req: Request, res: Response) => {
  try {
    const regions = await AnalyticsService.getRegionalBreakdown();

    res.json({
      status: 'success',
      data: regions
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: (error as Error).message
    });
  }
});

// ============================================================================
// RISK ALERTS
// ============================================================================

router.get('/risk-alerts', async (req: Request, res: Response) => {
  try {
    const alerts = await AnalyticsService.getActiveRiskAlerts();

    res.json({
      status: 'success',
      data: alerts
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: (error as Error).message
    });
  }
});

// ============================================================================
// AI INSIGHTS
// ============================================================================

router.get('/ai-insights', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const insights = await AnalyticsService.getRecentInsights(limit);

    res.json({
      status: 'success',
      data: insights
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: (error as Error).message
    });
  }
});

// ============================================================================
// SALES CHANNELS
// ============================================================================

router.get('/channels', async (req: Request, res: Response) => {
  try {
    const channels = await AnalyticsService.getChannelBreakdown();

    res.json({
      status: 'success',
      data: channels
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: (error as Error).message
    });
  }
});

// ============================================================================
// CUSTOMER ANALYTICS
// ============================================================================

router.get('/customer-segmentation', async (req: Request, res: Response) => {
  try {
    const segmentation = await AnalyticsService.getCustomerSegmentation();
    const ltv = await AnalyticsService.getCustomerLifetimeValue();
    const newCustomers = await AnalyticsService.getNewCustomers();

    res.json({
      status: 'success',
      data: {
        segmentation,
        lifetimeValue: ltv,
        newCustomersThisMonth: newCustomers
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: (error as Error).message
    });
  }
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'Analytics API is operational'
  });
});

export default router;
