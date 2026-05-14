import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { stripeService } from '../integrations/stripe.service';
import { logger } from '../utils/logger';

/**
 * Get Stripe charges
 */
export const getCharges = asyncHandler(async (req: Request, res: Response) => {
  const params = {
    limit: req.query.limit || 100,
  };

  const charges = await stripeService.getCharges(params);

  res.json({
    status: 'success',
    data: charges,
    count: charges.length,
  });
});

/**
 * Get Stripe subscriptions
 */
export const getSubscriptions = asyncHandler(async (req: Request, res: Response) => {
  const params = {
    limit: req.query.limit || 100,
    status: (req.query.status as string) || 'active',
  };

  const subscriptions = await stripeService.getSubscriptions(params);

  res.json({
    status: 'success',
    data: subscriptions,
    count: subscriptions.length,
  });
});

/**
 * Calculate monthly recurring revenue
 */
export const calculateMRR = asyncHandler(async (req: Request, res: Response) => {
  const mrr = await stripeService.calculateMRR();

  res.json({
    status: 'success',
    data: {
      mrr: Number(mrr).toFixed(2),
      arr: (Number(mrr) * 12).toFixed(2),
    },
  });
});

/**
 * Calculate revenue
 */
export const calculateRevenue = asyncHandler(async (req: Request, res: Response) => {
  const params = {
    limit: req.query.limit || 100,
  };

  const revenue = await stripeService.calculateRevenue(params);

  res.json({
    status: 'success',
    data: revenue,
  });
});

/**
 * Get failed payments
 */
export const getFailedPayments = asyncHandler(async (req: Request, res: Response) => {
  const failed = await stripeService.getFailedPayments();

  res.json({
    status: 'success',
    data: failed,
    count: failed.length,
  });
});

/**
 * Calculate churn
 */
export const calculateChurn = asyncHandler(async (req: Request, res: Response) => {
  const days = req.query.days ? parseInt(req.query.days as string) : 30;
  const churn = await stripeService.calculateChurn(days);

  res.json({
    status: 'success',
    data: churn,
  });
});

/**
 * Health check
 */
export const health = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'Stripe Integration API is healthy',
    timestamp: new Date().toISOString(),
  });
});
