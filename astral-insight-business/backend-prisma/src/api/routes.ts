import { Router, Request, Response } from 'express';
import { body, query } from 'express-validator';

// Controllers
import * as salesController from '../controllers/sales.controller';
import * as forecastController from '../controllers/forecast.controller';
import * as alertsController from '../controllers/alerts.controller';
import * as shopifyController from '../controllers/shopify.controller';
import * as stripeController from '../controllers/stripe.controller';
import * as gaController from '../controllers/google-analytics.controller';

// Middleware
import { authMiddleware, roleBasedAuth } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = Router();

// ============================================================================
// HEALTH CHECKS
// ============================================================================

router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'AstralInsight BA API is running',
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// SALES DASHBOARD ENDPOINTS
// ============================================================================

router.get('/sales/dashboard', authMiddleware, salesController.getDashboard);

router.get(
  '/sales/customers',
  authMiddleware,
  salesController.getCustomerIntelligence
);

router.get('/sales/health', salesController.health);

// ============================================================================
// FORECASTING ENDPOINTS
// ============================================================================

router.post(
  '/forecast/revenue',
  authMiddleware,
  body('days').optional().isInt({ min: 1, max: 365 }),
  body('model').optional().isIn(['prophet', 'lstm', 'xgboost', 'arima']),
  body('confidenceLevel').optional().isInt({ min: 50, max: 99 }),
  validateRequest,
  forecastController.generateRevenueForcast
);

router.post(
  '/forecast/scenario',
  authMiddleware,
  body('adSpendChange').isNumeric(),
  body('conversionBoost').isNumeric(),
  body('trafficSpike').isNumeric(),
  validateRequest,
  forecastController.generateScenarioForcast
);

router.post(
  '/forecast/anomalies',
  authMiddleware,
  body('timeSeries').isArray(),
  validateRequest,
  forecastController.detectAnomalies
);

router.post(
  '/forecast/compare-models',
  authMiddleware,
  body('timeSeries').isArray(),
  validateRequest,
  forecastController.compareModels
);

router.post(
  '/forecast/accuracy',
  authMiddleware,
  body('predicted').isArray(),
  body('actual').isArray(),
  validateRequest,
  forecastController.calculateAccuracy
);

router.post(
  '/copilot/chat',
  authMiddleware,
  body('question').isString(),
  validateRequest,
  forecastController.copilotChat
);

router.post(
  '/forecast/explain',
  authMiddleware,
  body('forecastData').notEmpty(),
  body('businessContext').isString(),
  validateRequest,
  forecastController.explainForcast
);

router.post(
  '/forecast/recommendations',
  authMiddleware,
  forecastController.generateRecommendations
);

router.get('/forecast/health', forecastController.health);

// ============================================================================
// ALERTS ENDPOINTS
// ============================================================================

router.get('/alerts/all', authMiddleware, alertsController.getAllAlerts);

router.get('/alerts/active', authMiddleware, alertsController.getActiveAlerts);

router.get(
  '/alerts/revenue-drops',
  authMiddleware,
  query('threshold').optional().isInt({ min: 1, max: 100 }),
  validateRequest,
  alertsController.detectRevenueDrops
);

router.get(
  '/alerts/inventory',
  authMiddleware,
  alertsController.detectInventoryShortages
);

router.get(
  '/alerts/conversion-decline',
  authMiddleware,
  query('threshold').optional().isInt({ min: 1, max: 100 }),
  validateRequest,
  alertsController.detectConversionDecline
);

router.get(
  '/alerts/traffic-anomalies',
  authMiddleware,
  alertsController.detectTrafficAnomalies
);

router.get(
  '/alerts/fraud',
  authMiddleware,
  alertsController.detectFraudPatterns
);

router.get(
  '/alerts/churn-risk',
  authMiddleware,
  query('threshold').optional().isInt({ min: 1, max: 100 }),
  validateRequest,
  alertsController.detectChurnRisk
);

router.get('/alerts/health', alertsController.health);

// ============================================================================
// SHOPIFY INTEGRATION ENDPOINTS
// ============================================================================

router.get(
  '/shopify/orders',
  authMiddleware,
  roleBasedAuth('admin', 'analyst'),
  query('limit').optional().isInt(),
  validateRequest,
  shopifyController.getOrders
);

router.get(
  '/shopify/products',
  authMiddleware,
  roleBasedAuth('admin', 'analyst'),
  query('limit').optional().isInt(),
  validateRequest,
  shopifyController.getProducts
);

router.get(
  '/shopify/customers',
  authMiddleware,
  roleBasedAuth('admin', 'analyst'),
  query('limit').optional().isInt(),
  validateRequest,
  shopifyController.getCustomers
);

router.get(
  '/shopify/inventory',
  authMiddleware,
  roleBasedAuth('admin', 'analyst'),
  shopifyController.getInventory
);

router.get(
  '/shopify/revenue',
  authMiddleware,
  roleBasedAuth('admin', 'analyst'),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  validateRequest,
  shopifyController.calculateRevenue
);

router.get(
  '/shopify/abandoned-carts',
  authMiddleware,
  roleBasedAuth('admin', 'analyst'),
  shopifyController.getAbandonedCarts
);

router.get('/shopify/health', shopifyController.health);

// ============================================================================
// STRIPE INTEGRATION ENDPOINTS
// ============================================================================

router.get(
  '/stripe/charges',
  authMiddleware,
  roleBasedAuth('admin', 'analyst'),
  query('limit').optional().isInt(),
  validateRequest,
  stripeController.getCharges
);

router.get(
  '/stripe/subscriptions',
  authMiddleware,
  roleBasedAuth('admin', 'analyst'),
  query('limit').optional().isInt(),
  query('status').optional().isIn(['active', 'canceled', 'past_due']),
  validateRequest,
  stripeController.getSubscriptions
);

router.get(
  '/stripe/mrr',
  authMiddleware,
  roleBasedAuth('admin', 'analyst'),
  stripeController.calculateMRR
);

router.get(
  '/stripe/revenue',
  authMiddleware,
  roleBasedAuth('admin', 'analyst'),
  stripeController.calculateRevenue
);

router.get(
  '/stripe/failed-payments',
  authMiddleware,
  roleBasedAuth('admin', 'analyst'),
  stripeController.getFailedPayments
);

router.get(
  '/stripe/churn',
  authMiddleware,
  roleBasedAuth('admin', 'analyst'),
  query('days').optional().isInt({ min: 1, max: 365 }),
  validateRequest,
  stripeController.calculateChurn
);

router.get('/stripe/health', stripeController.health);

// ============================================================================
// GOOGLE ANALYTICS INTEGRATION ENDPOINTS
// ============================================================================

router.get(
  '/ga/traffic',
  authMiddleware,
  roleBasedAuth('admin', 'analyst', 'viewer'),
  gaController.getTraffic
);

router.get(
  '/ga/conversions',
  authMiddleware,
  roleBasedAuth('admin', 'analyst', 'viewer'),
  gaController.getConversions
);

router.get(
  '/ga/devices',
  authMiddleware,
  roleBasedAuth('admin', 'analyst', 'viewer'),
  gaController.getDeviceAnalytics
);

router.get(
  '/ga/regions',
  authMiddleware,
  roleBasedAuth('admin', 'analyst', 'viewer'),
  gaController.getRegionalAnalytics
);

router.get(
  '/ga/retention',
  authMiddleware,
  roleBasedAuth('admin', 'analyst', 'viewer'),
  gaController.getUserRetention
);

router.get('/ga/health', gaController.health);

export default router;
