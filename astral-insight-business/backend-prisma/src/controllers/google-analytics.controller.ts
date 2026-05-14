import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { googleAnalyticsService } from '../integrations/google-analytics.service';
import { logger } from '../utils/logger';

/**
 * Get traffic analytics
 */
export const getTraffic = asyncHandler(async (req: Request, res: Response) => {
  const traffic = await googleAnalyticsService.getTraffic();

  res.json({
    status: 'success',
    data: traffic,
  });
});

/**
 * Get conversion analytics
 */
export const getConversions = asyncHandler(async (req: Request, res: Response) => {
  const conversions = await googleAnalyticsService.getConversions();

  res.json({
    status: 'success',
    data: conversions,
  });
});

/**
 * Get device analytics
 */
export const getDeviceAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const devices = await googleAnalyticsService.getDeviceAnalytics();

  res.json({
    status: 'success',
    data: devices,
  });
});

/**
 * Get regional analytics
 */
export const getRegionalAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const regions = await googleAnalyticsService.getRegionalAnalytics();

    res.json({
      status: 'success',
      data: regions,
    });
  }
);

/**
 * Get user retention
 */
export const getUserRetention = asyncHandler(async (req: Request, res: Response) => {
  const retention = await googleAnalyticsService.getUserRetention();

  res.json({
    status: 'success',
    data: retention,
  });
});

/**
 * Health check
 */
export const health = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'Google Analytics Integration API is healthy',
    timestamp: new Date().toISOString(),
  });
});
