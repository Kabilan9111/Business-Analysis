import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { salesAnalyticsService } from '../analytics/sales.analytics';
import { logger } from '../utils/logger';
import { prisma } from '../config/prisma';

/**
 * GET /api/sales/dashboard
 * Full dashboard metrics with KPIs, charts, insights
 */
export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
  const days = req.query.days ? parseInt(req.query.days as string) : 30;
  const metrics = await salesAnalyticsService.getDashboardMetrics(days);
  res.json({ status: 'success', data: metrics });
});

/**
 * GET /api/sales/revenue
 * Daily / monthly revenue trend
 */
export const getRevenue = asyncHandler(async (req: Request, res: Response) => {
  const period = (req.query.period as string) || 'daily';
  const days = req.query.days ? parseInt(req.query.days as string) : 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  let data;
  if (period === 'monthly') {
    const months = req.query.months ? parseInt(req.query.months as string) : 12;
    data = await salesAnalyticsService.getMonthlyTrend(months);
  } else {
    data = await salesAnalyticsService.getRevenueTrend(startDate);
  }
  res.json({ status: 'success', data });
});

/**
 * GET /api/sales/transactions
 * Paginated, filterable transaction ledger
 */
export const getTransactions = asyncHandler(async (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const filters = {
    status: req.query.status as string,
    region: req.query.region as string,
    search: req.query.search as string,
    startDate: req.query.startDate as string,
    endDate: req.query.endDate as string,
  };
  const result = await salesAnalyticsService.getRecentOrders(limit, page, filters);
  res.json({ status: 'success', data: result });
});

/**
 * GET /api/sales/customers
 * Customer intelligence summary
 */
export const getCustomerIntelligence = asyncHandler(async (req: Request, res: Response) => {
  const intelligence = await salesAnalyticsService.getCustomerIntelligence();
  res.json({ status: 'success', data: intelligence });
});

/**
 * GET /api/sales/products
 * Top-performing products
 */
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const products = await salesAnalyticsService.getTopProducts(limit);
  res.json({ status: 'success', data: products });
});

/**
 * GET /api/sales/categories
 * Category revenue breakdown
 */
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await salesAnalyticsService.getCategoryBreakdown();
  res.json({ status: 'success', data: categories });
});

/**
 * GET /api/sales/regions
 * Regional revenue breakdown
 */
export const getRegions = asyncHandler(async (req: Request, res: Response) => {
  const regions = await salesAnalyticsService.getRegionalBreakdown();
  res.json({ status: 'success', data: regions });
});

/**
 * GET /api/sales/insights
 * AI-generated insights from real DB analytics
 */
export const getInsights = asyncHandler(async (req: Request, res: Response) => {
  const days = req.query.days ? parseInt(req.query.days as string) : 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const [dynamicInsights, storedInsights] = await Promise.all([
    salesAnalyticsService.getDynamicInsights(startDate),
    prisma.revenueInsight.findMany({
      orderBy: { generatedAt: 'desc' },
      take: 5,
    }),
  ]);

  const combined = [
    ...dynamicInsights,
    ...storedInsights.map(i => ({
      id: i.id,
      severity: i.insightType,
      category: i.category,
      confidence: i.confidenceScore,
      text: i.description,
      generatedAt: i.generatedAt.toISOString(),
    })),
  ];
  res.json({ status: 'success', data: combined });
});

/**
 * GET /api/sales/channels
 * Sales channel breakdown
 */
export const getChannels = asyncHandler(async (req: Request, res: Response) => {
  const channels = await salesAnalyticsService.getChannelBreakdown();
  res.json({ status: 'success', data: channels });
});

/**
 * GET /api/sales/alerts
 * Active risk alerts from DB
 */
export const getAlerts = asyncHandler(async (req: Request, res: Response) => {
  const [riskAlerts, alertHistory] = await Promise.all([
    prisma.riskAlert.findMany({
      where: { isResolved: false },
      include: { customer: { select: { companyName: true, fullName: true, subscriptionTier: true } } },
      orderBy: { detectedAt: 'desc' },
      take: 20,
    }),
    prisma.alertHistory.findMany({
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);

  const alerts = [
    ...riskAlerts.map(a => ({
      id: a.id,
      title: a.alertTitle,
      text: a.alertMessage,
      severity: a.severity,
      category: a.riskCategory,
      customer: a.customer.companyName || a.customer.fullName,
      tier: a.customer.subscriptionTier,
      detectedAt: a.detectedAt.toISOString(),
    })),
    ...alertHistory.map(a => ({
      id: a.id,
      title: a.alertTitle,
      text: a.alertMessage,
      severity: a.severity,
      category: a.category,
      detectedAt: a.createdAt.toISOString(),
    })),
  ];

  res.json({ status: 'success', data: alerts, count: alerts.length });
});

/**
 * GET /api/sales/export
 * Export real sales data as JSON (CSV serialization on frontend)
 */
export const exportData = asyncHandler(async (req: Request, res: Response) => {
  const format = (req.query.format as string) || 'json';
  const filters = {
    startDate: req.query.startDate as string,
    endDate: req.query.endDate as string,
  };

  const orders = await salesAnalyticsService.getExportData(filters);

  const exportData = orders.map(o => ({
    orderId: o.orderId,
    customerName: o.customer.companyName || o.customer.fullName,
    customerEmail: o.customer.email,
    city: o.customer.city,
    state: o.customer.state,
    product: o.product.name,
    category: o.product.category,
    amount: Number(o.amount),
    quantity: o.quantity,
    region: o.region,
    salesChannel: o.salesChannel,
    paymentStatus: o.paymentStatus,
    refundStatus: o.refundStatus,
    date: o.createdAt.toISOString().split('T')[0],
  }));

  if (format === 'csv') {
    const headers = Object.keys(exportData[0] || {}).join(',');
    const rows = exportData.map(r => Object.values(r).join(','));
    const csv = [headers, ...rows].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=sales_export.csv');
    return res.send(csv);
  }

  res.json({ status: 'success', data: exportData, count: exportData.length });
});

/**
 * Health check
 */
export const health = asyncHandler(async (req: Request, res: Response) => {
  res.json({ status: 'success', message: 'Sales API is healthy', timestamp: new Date().toISOString() });
});
