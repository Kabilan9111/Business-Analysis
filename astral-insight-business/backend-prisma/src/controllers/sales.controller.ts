import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { salesAnalyticsService } from '../analytics/sales.analytics';
import { logger } from '../utils/logger';

/**
 * Get complete sales dashboard
 */
export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
  const days = req.query.days ? parseInt(req.query.days as string) : 30;
  const metrics = await salesAnalyticsService.getDashboardMetrics(days);

  res.json({
    status: 'success',
    data: metrics,
  });
});

/**
 * Get customer intelligence
 */
export const getCustomerIntelligence = asyncHandler(
  async (req: Request, res: Response) => {
    const intelligence = await salesAnalyticsService.getCustomerIntelligence();

    res.json({
      status: 'success',
      data: intelligence,
    });
  }
);

/**
 * Health check
 */
export const health = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'Sales API is healthy',
    timestamp: new Date().toISOString(),
  });
});
