import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { shopifyService } from '../integrations/shopify.service';
import { logger } from '../utils/logger';

/**
 * Get Shopify orders
 */
export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const params = {
    limit: req.query.limit || 50,
    status: req.query.status || 'any',
  };

  const orders = await shopifyService.getOrders(params);

  res.json({
    status: 'success',
    data: orders,
    count: orders.length,
  });
});

/**
 * Get Shopify products
 */
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const params = {
    limit: req.query.limit || 50,
  };

  const products = await shopifyService.getProducts(params);

  res.json({
    status: 'success',
    data: products,
    count: products.length,
  });
});

/**
 * Get Shopify customers
 */
export const getCustomers = asyncHandler(async (req: Request, res: Response) => {
  const params = {
    limit: req.query.limit || 50,
  };

  const customers = await shopifyService.getCustomers(params);

  res.json({
    status: 'success',
    data: customers,
    count: customers.length,
  });
});

/**
 * Get Shopify inventory
 */
export const getInventory = asyncHandler(async (req: Request, res: Response) => {
  const inventory = await shopifyService.getInventory();

  res.json({
    status: 'success',
    data: inventory,
  });
});

/**
 * Calculate Shopify revenue
 */
export const calculateRevenue = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;

  const revenue = await shopifyService.calculateRevenue(
    startDate as string,
    endDate as string
  );

  res.json({
    status: 'success',
    data: revenue,
  });
});

/**
 * Get abandoned carts
 */
export const getAbandonedCarts = asyncHandler(async (req: Request, res: Response) => {
  const carts = await shopifyService.getAbandonedCarts();

  res.json({
    status: 'success',
    data: carts,
    count: carts.length,
  });
});

/**
 * Health check
 */
export const health = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'Shopify Integration API is healthy',
    timestamp: new Date().toISOString(),
  });
});
