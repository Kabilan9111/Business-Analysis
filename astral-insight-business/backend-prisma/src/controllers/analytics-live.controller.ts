import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { AnalyticsLiveService } from '../services/analytics-live.service';
import { logger } from '../utils/logger';

/**
 * GET /api/analytics/kpis
 * Get real KPI metrics
 */
export const getKPIs = asyncHandler(async (req: Request, res: Response) => {
  const kpis = await AnalyticsLiveService.getKPIMetrics();
  res.json({
    status: 'success',
    data: kpis
  });
});

/**
 * GET /api/analytics/live-visitors
 * Get live visitor data
 */
export const getLiveVisitors = asyncHandler(async (req: Request, res: Response) => {
  const [liveData, liveCount] = await Promise.all([
    AnalyticsLiveService.getLiveVisitorData(),
    AnalyticsLiveService.getLiveUsersCount()
  ]);

  res.json({
    status: 'success',
    data: {
      chartData: liveData,
      ...liveCount
    }
  });
});

/**
 * GET /api/analytics/funnel
 * Get conversion funnel data
 */
export const getConversionFunnel = asyncHandler(async (req: Request, res: Response) => {
  const funnel = await AnalyticsLiveService.getConversionFunnel();
  res.json({
    status: 'success',
    data: funnel
  });
});

/**
 * GET /api/analytics/insights
 * Get AI insights
 */
export const getInsights = asyncHandler(async (req: Request, res: Response) => {
  const insights = await AnalyticsLiveService.getAIInsights();
  res.json({
    status: 'success',
    data: insights
  });
});

/**
 * GET /api/analytics/friction
 * Get UX friction points
 */
export const getUXFriction = asyncHandler(async (req: Request, res: Response) => {
  const friction = await AnalyticsLiveService.getUXFrictionPoints();
  res.json({
    status: 'success',
    data: friction
  });
});

/**
 * GET /api/analytics/cohorts
 * Get cohort retention data
 */
export const getCohorts = asyncHandler(async (req: Request, res: Response) => {
  const cohorts = await AnalyticsLiveService.getCohortRetention();
  res.json({
    status: 'success',
    data: cohorts
  });
});

/**
 * GET /api/analytics/traffic-prediction
 * Get traffic prediction data
 */
export const getTrafficPrediction = asyncHandler(async (req: Request, res: Response) => {
  const prediction = await AnalyticsLiveService.getTrafficPrediction();
  res.json({
    status: 'success',
    data: prediction
  });
});

/**
 * GET /api/analytics/revenue
 * Get Stripe revenue data
 */
export const getRevenue = asyncHandler(async (req: Request, res: Response) => {
  const revenue = await AnalyticsLiveService.getStripeRevenue();
  res.json({
    status: 'success',
    data: revenue
  });
});

/**
 * GET /api/analytics/orders
 * Get Shopify orders
 */
export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await AnalyticsLiveService.getShopifyOrders();
  res.json({
    status: 'success',
    data: orders
  });
});
