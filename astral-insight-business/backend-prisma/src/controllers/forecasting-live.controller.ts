import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { ForecastingLiveService } from '../services/forecasting-live.service';

/**
 * GET /api/forecasting/revenue-forecast
 * Generate revenue forecast for specified days
 */
export const getRevenueForecast = asyncHandler(async (req: Request, res: Response) => {
  const { days } = req.query;
  const forecastDays = Math.min(Number(days) || 30, 365);
  
  const forecast = await ForecastingLiveService.generateRevenueForecast(forecastDays);
  res.json({
    status: 'success',
    data: forecast
  });
});

/**
 * GET /api/forecasting/kpis
 * Get forecasting KPI metrics
 */
export const getKPIs = asyncHandler(async (req: Request, res: Response) => {
  const kpis = await ForecastingLiveService.getKPIMetrics();
  res.json({
    status: 'success',
    data: kpis
  });
});

/**
 * GET /api/forecasting/drivers
 * Get forecast drivers (waterfall data)
 */
export const getForecastDrivers = asyncHandler(async (req: Request, res: Response) => {
  const drivers = await ForecastingLiveService.getForecastDrivers();
  res.json({
    status: 'success',
    data: drivers
  });
});

/**
 * GET /api/forecasting/funnel-leakage
 * Get predicted funnel leakage data
 */
export const getFunnelLeakage = asyncHandler(async (req: Request, res: Response) => {
  const funnel = await ForecastingLiveService.getFunnelLeakage();
  res.json({
    status: 'success',
    data: funnel
  });
});

/**
 * GET /api/forecasting/alerts
 * Get critical intelligence alerts
 */
export const getAlerts = asyncHandler(async (req: Request, res: Response) => {
  const alerts = await ForecastingLiveService.getCriticalAlerts();
  res.json({
    status: 'success',
    data: alerts
  });
});

/**
 * GET /api/forecasting/recommendations
 * Get AI recommendations
 */
export const getRecommendations = asyncHandler(async (req: Request, res: Response) => {
  const recommendations = await ForecastingLiveService.getRecommendations();
  res.json({
    status: 'success',
    data: recommendations
  });
});

/**
 * GET /api/forecasting/payment-trends
 * Get payment trends from Stripe
 */
export const getPaymentTrends = asyncHandler(async (req: Request, res: Response) => {
  const trends = await ForecastingLiveService.getPaymentTrends();
  res.json({
    status: 'success',
    data: trends
  });
});

/**
 * GET /api/forecasting/order-trend
 * Get order trends from Shopify
 */
export const getOrderTrend = asyncHandler(async (req: Request, res: Response) => {
  const trend = await ForecastingLiveService.getOrderTrend();
  res.json({
    status: 'success',
    data: trend
  });
});

/**
 * GET /api/forecasting/scenario-impact
 * Calculate scenario impact
 */
export const getScenarioImpact = asyncHandler(async (req: Request, res: Response) => {
  const { adSpend = 0, conversionBoost = 0, trafficSpike = 0 } = req.query;
  
  const profitImpact = ForecastingLiveService.calculateScenarioImpact(
    Number(adSpend),
    Number(conversionBoost),
    Number(trafficSpike)
  );

  res.json({
    status: 'success',
    data: { profitImpact }
  });
});
