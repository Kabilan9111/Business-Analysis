import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { CustomerService } from '../services/customer.service';
import { logger } from '../utils/logger';

/**
 * GET /api/customers
 * Get customers with pagination and search
 */
export const getCustomers = asyncHandler(async (req: Request, res: Response) => {
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const search = req.query.search as string | undefined;

  const result = await CustomerService.getCustomers(page, limit, search);

  res.json({
    status: 'success',
    data: result
  });
});

/**
 * GET /api/customers/metrics
 * Get customer segment metrics
 */
export const getMetrics = asyncHandler(async (req: Request, res: Response) => {
  const metrics = await CustomerService.getSegmentMetrics();

  res.json({
    status: 'success',
    data: metrics
  });
});

/**
 * GET /api/customers/global-health
 * Get global health metrics
 */
export const getGlobalHealth = asyncHandler(async (req: Request, res: Response) => {
  const health = await CustomerService.getGlobalHealth();

  res.json({
    status: 'success',
    data: health
  });
});

/**
 * GET /api/customers/ltv-trend
 * Get LTV forecasting trend
 */
export const getLTVTrend = asyncHandler(async (req: Request, res: Response) => {
  const months = req.query.months ? parseInt(req.query.months as string) : 6;
  const trend = await CustomerService.getLTVTrend(months);

  res.json({
    status: 'success',
    data: trend
  });
});

/**
 * GET /api/customers/recommendations
 * Get AI recommendations
 */
export const getRecommendations = asyncHandler(async (req: Request, res: Response) => {
  const recommendations = await CustomerService.getRecommendations();

  res.json({
    status: 'success',
    data: recommendations
  });
});

/**
 * Health check
 */
export const health = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'Customers API is healthy',
    timestamp: new Date().toISOString()
  });
});
