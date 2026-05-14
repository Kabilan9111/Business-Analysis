import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { alertService } from '../analytics/alert.service';
import { prisma } from '../config/prisma';
import { logger } from '../utils/logger';

/**
 * Get all alerts
 */
export const getAllAlerts = asyncHandler(async (req: Request, res: Response) => {
  const alerts = await prisma.alertHistory.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  res.json({
    status: 'success',
    data: alerts,
  });
});

/**
 * Get active alerts
 */
export const getActiveAlerts = asyncHandler(async (req: Request, res: Response) => {
  const alerts = await alertService.runAllAlerts();

  // Filter for active/critical
  const activeAlerts = alerts.filter(
    (a) => a.severity === 'critical' || a.severity === 'high'
  );

  res.json({
    status: 'success',
    data: activeAlerts,
    count: activeAlerts.length,
  });
});

/**
 * Detect revenue drops
 */
export const detectRevenueDrops = asyncHandler(
  async (req: Request, res: Response) => {
    const threshold = req.query.threshold ? parseInt(req.query.threshold as string) : 15;
    const alerts = await alertService.detectRevenueDrops(threshold);

    res.json({
      status: 'success',
      data: alerts,
    });
  }
);

/**
 * Detect inventory shortages
 */
export const detectInventoryShortages = asyncHandler(
  async (req: Request, res: Response) => {
    const alerts = await alertService.detectInventoryShortages();

    res.json({
      status: 'success',
      data: alerts,
    });
  }
);

/**
 * Detect conversion decline
 */
export const detectConversionDecline = asyncHandler(
  async (req: Request, res: Response) => {
    const threshold = req.query.threshold ? parseInt(req.query.threshold as string) : 10;
    const alerts = await alertService.detectConversionDecline(threshold);

    res.json({
      status: 'success',
      data: alerts,
    });
  }
);

/**
 * Detect traffic anomalies
 */
export const detectTrafficAnomalies = asyncHandler(
  async (req: Request, res: Response) => {
    const alerts = await alertService.detectTrafficAnomalies();

    res.json({
      status: 'success',
      data: alerts,
    });
  }
);

/**
 * Detect fraud patterns
 */
export const detectFraudPatterns = asyncHandler(
  async (req: Request, res: Response) => {
    const alerts = await alertService.detectFraudPatterns();

    res.json({
      status: 'success',
      data: alerts,
    });
  }
);

/**
 * Detect churn risk
 */
export const detectChurnRisk = asyncHandler(async (req: Request, res: Response) => {
  const threshold = req.query.threshold ? parseInt(req.query.threshold as string) : 70;
  const alerts = await alertService.detectChurnRisk(threshold);

  res.json({
    status: 'success',
    data: alerts,
  });
});

/**
 * Health check
 */
export const health = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'Alerts API is healthy',
    timestamp: new Date().toISOString(),
  });
});
