import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { ReportsLiveService } from '../services/reports-live.service';

/**
 * GET /api/reports/list
 * Get all reports with optional filtering
 */
export const getReportsList = asyncHandler(async (req: Request, res: Response) => {
  const { type } = req.query;
  const reports = await ReportsLiveService.getAllReports(type as string);
  res.json({
    status: 'success',
    data: reports
  });
});

/**
 * GET /api/reports/revenue
 * Generate revenue report
 */
export const getRevenueReport = asyncHandler(async (req: Request, res: Response) => {
  const { reportType = 'daily', days = 30 } = req.query;
  const report = await ReportsLiveService.generateRevenueReport(reportType as 'daily' | 'weekly' | 'monthly', Number(days));
  res.json({
    status: 'success',
    data: report
  });
});

/**
 * GET /api/reports/customers
 * Generate customer segmentation report
 */
export const getCustomerReport = asyncHandler(async (req: Request, res: Response) => {
  const report = await ReportsLiveService.generateCustomerReport();
  res.json({
    status: 'success',
    data: report
  });
});

/**
 * GET /api/reports/subscriptions
 * Generate subscription and MRR report
 */
export const getSubscriptionReport = asyncHandler(async (req: Request, res: Response) => {
  const report = await ReportsLiveService.generateSubscriptionReport();
  res.json({
    status: 'success',
    data: report
  });
});

/**
 * GET /api/reports/traffic
 * Generate traffic and session report
 */
export const getTrafficReport = asyncHandler(async (req: Request, res: Response) => {
  const { days = 30 } = req.query;
  const report = await ReportsLiveService.generateTrafficReport(Number(days));
  res.json({
    status: 'success',
    data: report
  });
});

/**
 * GET /api/reports/conversion
 * Generate conversion funnel report
 */
export const getConversionReport = asyncHandler(async (req: Request, res: Response) => {
  const report = await ReportsLiveService.generateConversionReport();
  res.json({
    status: 'success',
    data: report
  });
});

/**
 * GET /api/reports/refunds
 * Generate refund and chargeback report
 */
export const getRefundReport = asyncHandler(async (req: Request, res: Response) => {
  const { days = 30 } = req.query;
  const report = await ReportsLiveService.generateRefundReport(Number(days));
  res.json({
    status: 'success',
    data: report
  });
});

/**
 * GET /api/reports/executive-summary
 * Generate executive summary report
 */
export const getExecutiveSummary = asyncHandler(async (req: Request, res: Response) => {
  const report = await ReportsLiveService.generateExecutiveSummary();
  res.json({
    status: 'success',
    data: report
  });
});
