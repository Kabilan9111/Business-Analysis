import { Router, Request, Response } from 'express';
import { query, body } from 'express-validator';

// Controllers
import * as salesController from '../controllers/sales.controller';
import * as forecastController from '../controllers/forecast.controller';
import * as alertsController from '../controllers/alerts.controller';
import * as shopifyController from '../controllers/shopify.controller';
import * as stripeController from '../controllers/stripe.controller';
import * as gaController from '../controllers/google-analytics.controller';
import * as customersController from '../controllers/customers.controller';
import * as analyticsLiveController from '../controllers/analytics-live.controller';
import * as forecastingLiveController from '../controllers/forecasting-live.controller';
import * as reportsLiveController from '../controllers/reports-live.controller';
import * as aiAssistantController from '../controllers/ai-assistant.controller';
import * as recommendationsController from '../controllers/recommendations.controller';

// Middleware
import { authMiddleware, roleBasedAuth } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = Router();

// ============================================================================
// HEALTH CHECKS
// ============================================================================

router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'success', message: 'AstralInsight BA API is running', timestamp: new Date().toISOString() });
});

// ============================================================================
// SALES ENDPOINTS — Full Suite
// ============================================================================

// Dashboard — full metrics bundle
router.get('/sales/dashboard',
  query('days').optional().isInt({ min: 1, max: 365 }),
  validateRequest,
  salesController.getDashboard
);

// Revenue trend
router.get('/sales/revenue',
  query('period').optional().isIn(['daily', 'monthly']),
  query('days').optional().isInt({ min: 1, max: 365 }),
  validateRequest,
  salesController.getRevenue
);

// Transactions ledger
router.get('/sales/transactions',
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 200 }),
  query('status').optional().isString(),
  query('region').optional().isString(),
  validateRequest,
  salesController.getTransactions
);

// Customer intelligence
router.get('/sales/customers', salesController.getCustomerIntelligence);

// Products
router.get('/sales/products',
  query('limit').optional().isInt({ min: 1, max: 50 }),
  validateRequest,
  salesController.getProducts
);

// Categories
router.get('/sales/categories', salesController.getCategories);

// Regions
router.get('/sales/regions', salesController.getRegions);

// AI Insights
router.get('/sales/insights',
  query('days').optional().isInt({ min: 1, max: 365 }),
  validateRequest,
  salesController.getInsights
);

// Sales channels
router.get('/sales/channels', salesController.getChannels);

// Risk alerts
router.get('/sales/alerts', salesController.getAlerts);

// Export (no auth guard for demo)
router.get('/sales/export',
  query('format').optional().isIn(['json', 'csv']),
  validateRequest,
  salesController.exportData
);

router.get('/sales/health', salesController.health);

// ============================================================================
// FORECASTING ENDPOINTS — Full Suite (all DB-driven)
// ============================================================================

// Revenue forecast (GET — preferred)
router.get('/forecast/revenue',
  query('days').optional().isInt({ min: 1, max: 365 }),
  query('confidence').optional().isInt({ min: 50, max: 99 }),
  validateRequest,
  forecastController.getRevenueForecast
);

// Revenue forecast (POST — legacy compat)
router.post('/forecast/revenue',
  body('days').optional().isInt({ min: 1, max: 365 }),
  body('model').optional().isString(),
  body('confidenceLevel').optional().isInt({ min: 50, max: 99 }),
  validateRequest,
  forecastController.generateRevenueForcast
);

// Historical data
router.get('/forecast/historical',
  query('days').optional().isInt({ min: 7, max: 730 }),
  validateRequest,
  forecastController.getHistorical
);

// Anomaly detection (GET)
router.get('/forecast/anomalies',
  query('days').optional().isInt({ min: 7, max: 365 }),
  validateRequest,
  forecastController.getAnomalies
);

// Anomaly detection (POST legacy)
router.post('/forecast/anomalies',
  body('timeSeries').optional().isArray(),
  forecastController.detectAnomalies
);

// Model list
router.get('/forecast/models', forecastController.getModels);

// Model comparison (POST legacy)
router.post('/forecast/compare-models',
  body('timeSeries').optional().isArray(),
  forecastController.compareModels
);

// Scenario simulator
router.post('/forecast/scenario',
  body('adSpendChange').optional().isNumeric(),
  body('conversionBoost').optional().isNumeric(),
  body('trafficSpike').optional().isNumeric(),
  body('days').optional().isInt({ min: 1, max: 365 }),
  validateRequest,
  forecastController.generateScenarioForcast
);

// Inventory forecasting
router.get('/forecast/inventory', forecastController.getInventoryForecast);

// AI insights
router.get('/forecast/insights', forecastController.getForecastInsights);

// Alerts
router.get('/forecast/alerts', forecastController.getForecastAlerts);

// Funnel forecast
router.get('/forecast/funnel', forecastController.getFunnelForecast);

// Customer forecast
router.get('/forecast/customers',
  query('days').optional().isInt({ min: 1, max: 365 }),
  validateRequest,
  forecastController.getCustomerForecast
);

// Accuracy
router.post('/forecast/accuracy', forecastController.calculateAccuracy);
router.get('/forecast/accuracy', forecastController.getAccuracy);

// AI Copilot chat
router.post('/copilot/chat',
  body('question').isString().notEmpty(),
  validateRequest,
  forecastController.copilotChat
);

// Legacy endpoints
router.post('/forecast/explain',
  body('forecastData').optional(),
  body('businessContext').optional().isString(),
  forecastController.explainForcast
);

router.post('/forecast/recommendations', forecastController.generateRecommendations);
router.get('/forecast/health', forecastController.health);

// ============================================================================
// ALERTS ENDPOINTS
// ============================================================================

router.get('/alerts/all', authMiddleware, alertsController.getAllAlerts);
router.get('/alerts/active', authMiddleware, alertsController.getActiveAlerts);
router.get('/alerts/revenue-drops',
  authMiddleware,
  query('threshold').optional().isInt({ min: 1, max: 100 }),
  validateRequest,
  alertsController.detectRevenueDrops
);
router.get('/alerts/inventory', authMiddleware, alertsController.detectInventoryShortages);
router.get('/alerts/conversion-decline',
  authMiddleware,
  query('threshold').optional().isInt({ min: 1, max: 100 }),
  validateRequest,
  alertsController.detectConversionDecline
);
router.get('/alerts/traffic-anomalies', authMiddleware, alertsController.detectTrafficAnomalies);
router.get('/alerts/fraud', authMiddleware, alertsController.detectFraudPatterns);
router.get('/alerts/churn-risk',
  authMiddleware,
  query('threshold').optional().isInt({ min: 1, max: 100 }),
  validateRequest,
  alertsController.detectChurnRisk
);
router.get('/alerts/health', alertsController.health);

// ============================================================================
// SHOPIFY INTEGRATION
// ============================================================================

router.get('/shopify/orders', authMiddleware, roleBasedAuth('admin', 'analyst'), query('limit').optional().isInt(), validateRequest, shopifyController.getOrders);
router.get('/shopify/products', authMiddleware, roleBasedAuth('admin', 'analyst'), query('limit').optional().isInt(), validateRequest, shopifyController.getProducts);
router.get('/shopify/customers', authMiddleware, roleBasedAuth('admin', 'analyst'), query('limit').optional().isInt(), validateRequest, shopifyController.getCustomers);
router.get('/shopify/inventory', authMiddleware, roleBasedAuth('admin', 'analyst'), shopifyController.getInventory);
router.get('/shopify/revenue', authMiddleware, roleBasedAuth('admin', 'analyst'), query('startDate').optional().isISO8601(), query('endDate').optional().isISO8601(), validateRequest, shopifyController.calculateRevenue);
router.get('/shopify/abandoned-carts', authMiddleware, roleBasedAuth('admin', 'analyst'), shopifyController.getAbandonedCarts);
router.get('/shopify/health', shopifyController.health);

// ============================================================================
// STRIPE INTEGRATION
// ============================================================================

router.get('/stripe/charges', authMiddleware, roleBasedAuth('admin', 'analyst'), query('limit').optional().isInt(), validateRequest, stripeController.getCharges);
router.get('/stripe/subscriptions', authMiddleware, roleBasedAuth('admin', 'analyst'), query('limit').optional().isInt(), query('status').optional().isIn(['active', 'canceled', 'past_due']), validateRequest, stripeController.getSubscriptions);
router.get('/stripe/mrr', authMiddleware, roleBasedAuth('admin', 'analyst'), stripeController.calculateMRR);
router.get('/stripe/revenue', authMiddleware, roleBasedAuth('admin', 'analyst'), stripeController.calculateRevenue);
router.get('/stripe/failed-payments', authMiddleware, roleBasedAuth('admin', 'analyst'), stripeController.getFailedPayments);
router.get('/stripe/churn', authMiddleware, roleBasedAuth('admin', 'analyst'), query('days').optional().isInt({ min: 1, max: 365 }), validateRequest, stripeController.calculateChurn);
router.get('/stripe/health', stripeController.health);

// ============================================================================
// GOOGLE ANALYTICS
// ============================================================================

router.get('/ga/traffic', authMiddleware, roleBasedAuth('admin', 'analyst', 'viewer'), gaController.getTraffic);
router.get('/ga/conversions', authMiddleware, roleBasedAuth('admin', 'analyst', 'viewer'), gaController.getConversions);
router.get('/ga/devices', authMiddleware, roleBasedAuth('admin', 'analyst', 'viewer'), gaController.getDeviceAnalytics);
router.get('/ga/regions', authMiddleware, roleBasedAuth('admin', 'analyst', 'viewer'), gaController.getRegionalAnalytics);
router.get('/ga/retention', authMiddleware, roleBasedAuth('admin', 'analyst', 'viewer'), gaController.getUserRetention);
router.get('/ga/health', gaController.health);

// ============================================================================
// CUSTOMERS ENDPOINTS
// ============================================================================

router.get('/customers',
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString(),
  validateRequest,
  customersController.getCustomers
);

router.get('/customers/metrics', customersController.getMetrics);

router.get('/customers/global-health', customersController.getGlobalHealth);

router.get('/customers/ltv-trend',
  query('months').optional().isInt({ min: 1, max: 12 }),
  validateRequest,
  customersController.getLTVTrend
);

router.get('/customers/recommendations', customersController.getRecommendations);

router.get('/customers/health', customersController.health);

// ============================================================================
// ANALYTICS LIVE ENDPOINTS (Real-time connected to PostgreSQL + APIs)
// ============================================================================

router.get('/analytics/kpis', analyticsLiveController.getKPIs);

router.get('/analytics/live-visitors', analyticsLiveController.getLiveVisitors);

router.get('/analytics/funnel', analyticsLiveController.getConversionFunnel);

router.get('/analytics/insights', analyticsLiveController.getInsights);

router.get('/analytics/friction', analyticsLiveController.getUXFriction);

router.get('/analytics/retention-cohorts', analyticsLiveController.getCohorts);

router.get('/analytics/traffic-prediction', analyticsLiveController.getTrafficPrediction);

router.get('/analytics/revenue', analyticsLiveController.getRevenue);

router.get('/analytics/orders', analyticsLiveController.getOrders);

// ============================================================================
// FORECASTING LIVE ENDPOINTS (Real-time connected to PostgreSQL + APIs)
// ============================================================================

router.get('/forecasting/revenue-forecast', forecastingLiveController.getRevenueForecast);

router.get('/forecasting/kpis', forecastingLiveController.getKPIs);

router.get('/forecasting/drivers', forecastingLiveController.getForecastDrivers);

router.get('/forecasting/funnel-leakage', forecastingLiveController.getFunnelLeakage);

router.get('/forecasting/alerts', forecastingLiveController.getAlerts);

router.get('/forecasting/recommendations', forecastingLiveController.getRecommendations);

router.get('/forecasting/payment-trends', forecastingLiveController.getPaymentTrends);

router.get('/forecasting/order-trend', forecastingLiveController.getOrderTrend);

router.get('/forecasting/scenario-impact', forecastingLiveController.getScenarioImpact);

// ============================================================================
// REPORTS LIVE ENDPOINTS (Real-time connected to PostgreSQL + APIs)
// ============================================================================

router.get('/reports/list', reportsLiveController.getReportsList);

router.get('/reports/revenue', reportsLiveController.getRevenueReport);

router.get('/reports/customers', reportsLiveController.getCustomerReport);

router.get('/reports/subscriptions', reportsLiveController.getSubscriptionReport);

router.get('/reports/traffic', reportsLiveController.getTrafficReport);

router.get('/reports/conversion', reportsLiveController.getConversionReport);

router.get('/reports/refunds', reportsLiveController.getRefundReport);

router.get('/reports/executive-summary', reportsLiveController.getExecutiveSummary);

// ============================================================================
// AI ASSISTANT ENDPOINTS (Intelligent analysis using PostgreSQL + APIs)
// ============================================================================

router.post('/ai/query',
  body('query').notEmpty().trim(),
  validateRequest,
  aiAssistantController.generateAIResponse
);

router.get('/ai/revenue-analysis',
  query('days').optional().isInt({ min: 1, max: 365 }),
  validateRequest,
  aiAssistantController.getRevenueAnalysis
);

router.get('/ai/churn-analysis', aiAssistantController.getChurnAnalysis);

router.get('/ai/mrr-forecast', aiAssistantController.getMRRForecast);

router.get('/ai/traffic-analysis',
  query('days').optional().isInt({ min: 1, max: 365 }),
  validateRequest,
  aiAssistantController.getTrafficAnalysis
);

router.get('/ai/conversion-analysis', aiAssistantController.getConversionAnalysis);

router.get('/ai/subscription-metrics', aiAssistantController.getSubscriptionMetrics);

router.get('/ai/business-insights', aiAssistantController.getBusinessInsights);

// ============================================================================
// RECOMMENDATIONS ENDPOINTS (AI-driven, data-driven recommendations)
// ============================================================================

router.get('/recommendations', recommendationsController.getRecommendations);

router.get('/recommendations/stats', recommendationsController.getStats);

router.get('/recommendations/health', recommendationsController.health);

export default router;
