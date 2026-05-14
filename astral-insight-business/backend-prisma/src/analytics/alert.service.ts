import { prisma } from '../config/prisma';
import { logger } from '../utils/logger';
import Decimal from 'decimal.js';

export class AlertService {
  /**
   * Detect revenue drops
   */
  async detectRevenueDrops(threshold: number = 15) {
    try {
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      const lastWeekDay = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      const todayRevenue = await this.getDateRevenue(today);
      const yesterdayRevenue = await this.getDateRevenue(yesterday);
      const lastWeekRevenue = await this.getDateRevenue(lastWeekDay);

      const dropFromYesterday =
        yesterdayRevenue > 0
          ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100
          : 0;

      const alerts = [];

      if (dropFromYesterday < -threshold) {
        alerts.push({
          type: 'revenue_drop',
          severity: 'critical',
          title: 'Critical Revenue Drop Detected',
          description: `Revenue dropped ${Math.abs(dropFromYesterday).toFixed(1)}% compared to yesterday`,
          value: parseFloat(dropFromYesterday.toFixed(2)),
          threshold,
          timestamp: new Date(),
          metadata: {
            todayRevenue: Number(todayRevenue),
            yesterdayRevenue: Number(yesterdayRevenue),
          },
        });
      }

      return alerts;
    } catch (error) {
      logger.error({ error }, 'Failed to detect revenue drops');
      return [];
    }
  }

  /**
   * Detect inventory shortages
   */
  async detectInventoryShortages() {
    try {
      const lowStockThreshold = 10;

      // In a real implementation, integrate with your inventory system
      const alerts = [];

      // Example: Check for products with low stock
      // const products = await prisma.product.findMany({
      //   where: { stock: { lt: lowStockThreshold } },
      // });

      // products.forEach(product => {
      //   alerts.push({
      //     type: 'inventory_shortage',
      //     severity: 'warning',
      //     title: `Low Stock Alert: ${product.name}`,
      //     description: `${product.name} has only ${product.stock} units remaining`,
      //     metadata: { productId: product.id, currentStock: product.stock }
      //   });
      // });

      return alerts;
    } catch (error) {
      logger.error({ error }, 'Failed to detect inventory shortages');
      return [];
    }
  }

  /**
   * Detect conversion rate decline
   */
  async detectConversionDecline(threshold: number = 10) {
    try {
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

      const todayData = await this.getDayMetrics(today);
      const yesterdayData = await this.getDayMetrics(yesterday);

      const conversionToday =
        todayData.visits > 0 ? (todayData.conversions / todayData.visits) * 100 : 0;
      const conversionYesterday =
        yesterdayData.visits > 0
          ? (yesterdayData.conversions / yesterdayData.visits) * 100
          : 0;

      const decline = conversionYesterday - conversionToday;

      if (decline > threshold) {
        return [
          {
            type: 'conversion_decline',
            severity: 'warning',
            title: 'Conversion Rate Decline',
            description: `Conversion rate dropped ${decline.toFixed(2)}% compared to yesterday`,
            value: parseFloat(decline.toFixed(2)),
            timestamp: new Date(),
            metadata: {
              todayConversion: conversionToday,
              yesterdayConversion: conversionYesterday,
            },
          },
        ];
      }

      return [];
    } catch (error) {
      logger.error({ error }, 'Failed to detect conversion decline');
      return [];
    }
  }

  /**
   * Detect traffic anomalies
   */
  async detectTrafficAnomalies() {
    try {
      const alerts = [];

      // Example implementation
      const today = new Date();
      const avgTraffic = 15000; // Baseline average
      const spikeThreshold = 1.5; // 50% above average
      const dropThreshold = 0.5; // 50% below average

      const todayVisits = 22500; // Mock data

      if (todayVisits > avgTraffic * spikeThreshold) {
        alerts.push({
          type: 'traffic_spike',
          severity: 'info',
          title: 'Unusual Traffic Spike Detected',
          description: `Traffic is ${((todayVisits / avgTraffic - 1) * 100).toFixed(1)}% above average`,
          value: todayVisits,
          timestamp: new Date(),
        });
      } else if (todayVisits < avgTraffic * dropThreshold) {
        alerts.push({
          type: 'traffic_drop',
          severity: 'warning',
          title: 'Traffic Drop Detected',
          description: `Traffic is ${((1 - todayVisits / avgTraffic) * 100).toFixed(1)}% below average`,
          value: todayVisits,
          timestamp: new Date(),
        });
      }

      return alerts;
    } catch (error) {
      logger.error({ error }, 'Failed to detect traffic anomalies');
      return [];
    }
  }

  /**
   * Detect fraud patterns
   */
  async detectFraudPatterns() {
    try {
      const alerts = [];

      // Check for suspicious patterns
      const suspiciousOrders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
          paymentStatus: 'completed',
        },
        select: {
          id: true,
          customerId: true,
          amount: true,
          region: true,
        },
        take: 1000,
      });

      // Example: Detect large orders from new customers
      const largeOrderThreshold = 10000;
      const newCustomerThreshold = 5;

      for (const order of suspiciousOrders) {
        if (Number(order.amount) > largeOrderThreshold) {
          const customer = await prisma.customer.findUnique({
            where: { id: order.customerId },
            select: { createdAt: true, totalPurchases: true },
          });

          if (customer && customer.totalPurchases < newCustomerThreshold) {
            alerts.push({
              type: 'fraud_pattern',
              severity: 'high',
              title: 'Suspicious Large Order Detected',
              description: `New customer made a large order of $${order.amount}`,
              value: Number(order.amount),
              metadata: {
                orderId: order.id,
                customerId: order.customerId,
              },
              timestamp: new Date(),
            });
          }
        }
      }

      return alerts;
    } catch (error) {
      logger.error({ error }, 'Failed to detect fraud patterns');
      return [];
    }
  }

  /**
   * Detect churn risk
   */
  async detectChurnRisk(threshold: number = 70) {
    try {
      const atRiskCustomers = await prisma.customer.findMany({
        where: {
          churnRiskScore: { gte: threshold },
        },
        select: {
          id: true,
          email: true,
          name: true,
          churnRiskScore: true,
          lastActivityAt: true,
        },
        take: 100,
      });

      const alerts = atRiskCustomers.map((customer) => ({
        type: 'churn_risk',
        severity: customer.churnRiskScore >= 85 ? 'critical' : 'warning',
        title: 'Customer Churn Risk Detected',
        description: `${customer.name} shows ${customer.churnRiskScore}% churn risk`,
        value: customer.churnRiskScore,
        metadata: {
          customerId: customer.id,
          email: customer.email,
          lastActivity: customer.lastActivityAt,
        },
        timestamp: new Date(),
      }));

      return alerts;
    } catch (error) {
      logger.error({ error }, 'Failed to detect churn risk');
      return [];
    }
  }

  /**
   * Run all alerts
   */
  async runAllAlerts() {
    try {
      const [drops, shortages, conversion, traffic, fraud, churn] = await Promise.all([
        this.detectRevenueDrops(),
        this.detectInventoryShortages(),
        this.detectConversionDecline(),
        this.detectTrafficAnomalies(),
        this.detectFraudPatterns(),
        this.detectChurnRisk(),
      ]);

      const allAlerts = [
        ...drops,
        ...shortages,
        ...conversion,
        ...traffic,
        ...fraud,
        ...churn,
      ];

      // Save critical alerts to database
      for (const alert of allAlerts.filter((a) => a.severity === 'critical')) {
        await prisma.alertHistory.create({
          data: {
            type: alert.type,
            severity: alert.severity,
            title: alert.title,
            description: alert.description,
            metadata: JSON.stringify(alert.metadata || {}),
          },
        });
      }

      logger.info({ count: allAlerts.length }, 'Completed alert detection');
      return allAlerts;
    } catch (error) {
      logger.error({ error }, 'Failed to run all alerts');
      return [];
    }
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private async getDateRevenue(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const result = await prisma.order.aggregate({
      where: {
        createdAt: { gte: startOfDay, lte: endOfDay },
        paymentStatus: 'completed',
      },
      _sum: { amount: true },
    });

    return result._sum.amount ? Number(result._sum.amount) : 0;
  }

  private async getDayMetrics(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const visits = await prisma.userActivity.count({
      where: {
        createdAt: { gte: startOfDay, lte: endOfDay },
      },
    });

    const conversions = await prisma.order.count({
      where: {
        createdAt: { gte: startOfDay, lte: endOfDay },
        paymentStatus: 'completed',
      },
    });

    return { visits: Math.max(visits, 1), conversions };
  }
}

export const alertService = new AlertService();
