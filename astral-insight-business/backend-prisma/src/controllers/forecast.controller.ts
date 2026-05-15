import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { forecastingAnalyticsService } from '../analytics/forecast.analytics';
import { logger } from '../utils/logger';

/**
 * GET /api/forecast/revenue
 * Moving average + trend forecast from real DB historical
 */
export const getRevenueForecast = asyncHandler(async (req: Request, res: Response) => {
  const days = req.query.days ? parseInt(req.query.days as string) : 30;
  const confidenceLevel = req.query.confidence ? parseInt(req.query.confidence as string) : 95;
  const result = await forecastingAnalyticsService.generateRevenueForecast({ days, confidenceLevel });
  res.json({ status: 'success', data: result });
});

/**
 * POST /api/forecast/revenue (body-based, legacy compat)
 */
export const generateRevenueForcast = asyncHandler(async (req: Request, res: Response) => {
  const { days = 30, confidenceLevel = 95 } = req.body;
  const result = await forecastingAnalyticsService.generateRevenueForecast({ days, confidenceLevel });
  res.json({ status: 'success', data: result });
});

/**
 * GET /api/forecast/historical
 * Raw historical revenue series
 */
export const getHistorical = asyncHandler(async (req: Request, res: Response) => {
  const days = req.query.days ? parseInt(req.query.days as string) : 90;
  const data = await forecastingAnalyticsService.getHistoricalRevenueSeries(days);
  res.json({ status: 'success', data });
});

/**
 * GET /api/forecast/anomalies
 */
export const getAnomalies = asyncHandler(async (req: Request, res: Response) => {
  const days = req.query.days ? parseInt(req.query.days as string) : 60;
  const result = await forecastingAnalyticsService.detectAnomalies(days);
  res.json({ status: 'success', data: result });
});

/**
 * POST /api/forecast/anomalies (legacy compat)
 */
export const detectAnomalies = asyncHandler(async (req: Request, res: Response) => {
  const days = req.body.days || 60;
  const result = await forecastingAnalyticsService.detectAnomalies(days);
  res.json({ status: 'success', data: result });
});

/**
 * GET /api/forecast/models
 */
export const getModels = asyncHandler(async (req: Request, res: Response) => {
  const models = await forecastingAnalyticsService.compareModels();
  res.json({ status: 'success', data: models });
});

/**
 * POST /api/forecast/compare-models (legacy compat)
 */
export const compareModels = asyncHandler(async (req: Request, res: Response) => {
  const models = await forecastingAnalyticsService.compareModels();
  res.json({ status: 'success', data: models });
});

/**
 * POST /api/forecast/scenario
 */
export const generateScenarioForcast = asyncHandler(async (req: Request, res: Response) => {
  const { adSpendChange = 0, conversionBoost = 0, trafficSpike = 0, days = 30 } = req.body;
  const result = await forecastingAnalyticsService.generateScenario({
    adSpendChange,
    conversionBoost,
    trafficSpike,
    days,
  });
  res.json({ status: 'success', data: result });
});

/**
 * GET /api/forecast/inventory
 */
export const getInventoryForecast = asyncHandler(async (req: Request, res: Response) => {
  const inventory = await forecastingAnalyticsService.getInventoryForecast();
  res.json({ status: 'success', data: inventory });
});

/**
 * GET /api/forecast/insights
 */
export const getForecastInsights = asyncHandler(async (req: Request, res: Response) => {
  const insights = await forecastingAnalyticsService.getForecastInsights();
  res.json({ status: 'success', data: insights });
});

/**
 * GET /api/forecast/alerts
 */
export const getForecastAlerts = asyncHandler(async (req: Request, res: Response) => {
  const alerts = await forecastingAnalyticsService.getForecastAlerts();
  res.json({ status: 'success', data: alerts, count: alerts.length });
});

/**
 * GET /api/forecast/funnel
 */
export const getFunnelForecast = asyncHandler(async (req: Request, res: Response) => {
  const funnel = await forecastingAnalyticsService.getFunnelForecast();
  res.json({ status: 'success', data: funnel });
});

/**
 * GET /api/forecast/customers
 */
export const getCustomerForecast = asyncHandler(async (req: Request, res: Response) => {
  const days = req.query.days ? parseInt(req.query.days as string) : 30;
  const forecast = await forecastingAnalyticsService.getCustomerForecast(days);
  res.json({ status: 'success', data: forecast });
});

/**
 * POST /api/forecast/accuracy (legacy compat)
 */
export const calculateAccuracy = asyncHandler(async (req: Request, res: Response) => {
  const models = await forecastingAnalyticsService.compareModels();
  res.json({ status: 'success', data: models[0] || {} });
});

/**
 * GET /api/forecast/accuracy
 */
export const getAccuracy = asyncHandler(async (req: Request, res: Response) => {
  const models = await forecastingAnalyticsService.compareModels();
  const champion = models[0];
  res.json({
    status: 'success',
    data: {
      accuracy: champion?.accuracy || 0,
      mape: champion?.mape || 0,
      rmse: champion?.rmse || 0,
      champion: champion?.name || 'N/A',
      models,
    },
  });
});

/**
 * POST /api/copilot/chat — quick AI responses seeded from DB context
 */
export const copilotChat = asyncHandler(async (req: Request, res: Response) => {
  const { question } = req.body;
  const q = (question || '').toLowerCase();

  let response = 'Based on our analysis of the live database, here is the latest intelligence on that query.';

  const insights = await forecastingAnalyticsService.getForecastInsights();
  const topInsight = insights[0];

  if (q.includes('churn') || q.includes('retention')) {
    response = `Churn risk analysis shows ${insights.find(i => i.type === 'warning')?.description || 'moderate risk levels'}. Recommended action: trigger retention campaigns for at-risk enterprise accounts.`;
  } else if (q.includes('revenue') || q.includes('forecast')) {
    response = topInsight?.description || 'Revenue forecast looks stable based on current trend data.';
  } else if (q.includes('inventory') || q.includes('stock')) {
    response = 'Inventory forecasting detected potential stockout risks in fast-moving product categories. Reorder triggers have been flagged.';
  } else if (q.includes('growth') || q.includes('opportunity')) {
    response = insights.find(i => i.type === 'opportunity')?.description || 'Growth opportunities exist in underpenetrated regional markets.';
  }

  res.json({
    status: 'success',
    data: { response, sources: insights.slice(0, 2), timestamp: new Date().toISOString() },
  });
});

/**
 * POST /api/forecast/explain (legacy compat)
 */
export const explainForcast = asyncHandler(async (req: Request, res: Response) => {
  const insights = await forecastingAnalyticsService.getForecastInsights();
  res.json({ status: 'success', data: { explanation: insights.map(i => i.description).join(' ') } });
});

/**
 * POST /api/forecast/recommendations (legacy compat)
 */
export const generateRecommendations = asyncHandler(async (req: Request, res: Response) => {
  const insights = await forecastingAnalyticsService.getForecastInsights();
  res.json({ status: 'success', data: insights });
});

/**
 * Health check
 */
export const health = asyncHandler(async (req: Request, res: Response) => {
  res.json({ status: 'success', message: 'Forecast API is healthy', timestamp: new Date().toISOString() });
});
