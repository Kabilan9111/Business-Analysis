import { prisma } from '../config/prisma';
import { Decimal } from '@prisma/client/runtime/library';

export class AnalyticsService {
  // ============================================================================
  // KPI CALCULATIONS
  // ============================================================================

  static async getTotalRevenue(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await prisma.order.aggregate({
      where: {
        createdAt: { gte: startDate },
        paymentStatus: 'completed'
      },
      _sum: { amount: true }
    });

    return result._sum.amount || 0;
  }

  static async getTotalOrders(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return prisma.order.count({
      where: {
        createdAt: { gte: startDate },
        paymentStatus: 'completed'
      }
    });
  }

  static async getAverageOrderValue(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await prisma.order.aggregate({
      where: {
        createdAt: { gte: startDate },
        paymentStatus: 'completed'
      },
      _sum: { amount: true },
      _count: true
    });

    if (result._count === 0) return 0;
    return Number(result._sum.amount || 0) / result._count;
  }

  static async getMonthlyRecurringRevenue() {
    const mrrProducts = await prisma.product.aggregate({
      _sum: { monthlyRecurringRevenue: true }
    });

    return mrrProducts._sum.monthlyRecurringRevenue || 0;
  }

  static async getRepeatCustomers(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const customerOrders = await prisma.order.groupBy({
      by: ['customerId'],
      where: {
        createdAt: { gte: startDate },
        paymentStatus: 'completed'
      },
      _count: true,
      having: {
        customerId: {
          _count: { gt: 1 }
        }
      }
    });

    return customerOrders.length;
  }

  static async getCustomerRetentionRate() {
    const totalCustomers = await prisma.customer.count();
    const activeCustomers = await prisma.customer.count({
      where: {
        lastActivityAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    });

    if (totalCustomers === 0) return 0;
    return (activeCustomers / totalCustomers) * 100;
  }

  static async getRefundRate(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const totalOrders = await prisma.order.count({
      where: {
        createdAt: { gte: startDate },
        paymentStatus: 'completed'
      }
    });

    const refundedOrders = await prisma.order.count({
      where: {
        createdAt: { gte: startDate },
        paymentStatus: 'completed',
        refundStatus: { not: 'none' }
      }
    });

    if (totalOrders === 0) return 0;
    return (refundedOrders / totalOrders) * 100;
  }

  static async getChurnRiskCustomers(riskThreshold: number = 70) {
    return prisma.customer.count({
      where: {
        churnRiskScore: { gte: riskThreshold }
      }
    });
  }

  // ============================================================================
  // TREND ANALYSIS
  // ============================================================================

  static async getRevenueTrend(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        paymentStatus: 'completed'
      },
      select: {
        createdAt: true,
        amount: true
      },
      orderBy: { createdAt: 'asc' }
    });

    // Group by day
    const dailyRevenue: Record<string, number> = {};

    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      dailyRevenue[date] = (dailyRevenue[date] || 0) + Number(order.amount);
    });

    return Object.entries(dailyRevenue).map(([date, revenue]) => ({
      date,
      revenue,
      orders: orders.filter(o => o.createdAt.toISOString().startsWith(date)).length
    }));
  }

  static async getOrderTrend(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        paymentStatus: 'completed'
      },
      select: {
        createdAt: true,
        amount: true
      },
      orderBy: { createdAt: 'asc' }
    });

    // Group by day
    const dailyOrders: Record<string, number> = {};

    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      dailyOrders[date] = (dailyOrders[date] || 0) + 1;
    });

    return Object.entries(dailyOrders).map(([date, count]) => ({
      date,
      orders: count
    }));
  }

  // ============================================================================
  // REGIONAL ANALYTICS
  // ============================================================================

  static async getRegionalPerformance() {
    return prisma.regionPerformance.findMany({
      orderBy: { totalRevenue: 'desc' }
    });
  }

  static async getRegionalBreakdown() {
    const regions = await prisma.order.groupBy({
      by: ['region'],
      where: {
        paymentStatus: 'completed'
      },
      _sum: { amount: true },
      _count: true,
      orderBy: {
        _sum: {
          amount: 'desc'
        }
      }
    });

    const totalRevenue = regions.reduce((sum, r) => sum + Number(r._sum.amount || 0), 0);

    return regions.map(r => ({
      region: r.region,
      revenue: r._sum.amount || 0,
      orders: r._count,
      marketShare: totalRevenue > 0 ? ((Number(r._sum.amount || 0) / totalRevenue) * 100).toFixed(1) : 0
    }));
  }

  // ============================================================================
  // PRODUCT ANALYTICS
  // ============================================================================

  static async getTopProducts(limit: number = 5) {
    const productSales = await prisma.order.groupBy({
      by: ['productId'],
      where: {
        paymentStatus: 'completed'
      },
      _sum: { amount: true },
      _count: true,
      orderBy: {
        _sum: {
          amount: 'desc'
        }
      },
      take: limit
    });

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productSales.map(p => p.productId)
        }
      }
    });

    return productSales.map(sale => {
      const product = products.find(p => p.id === sale.productId);
      return {
        productId: sale.productId,
        productName: product?.name,
        revenue: sale._sum.amount || 0,
        orders: sale._count,
        conversionRate: product?.conversionRate || 0
      };
    });
  }

  static async getProductPerformance() {
    return prisma.productPerformance.findMany({
      include: { product: true },
      orderBy: { totalRevenue: 'desc' }
    });
  }

  // ============================================================================
  // CUSTOMER ANALYTICS
  // ============================================================================

  static async getCustomerSegmentation() {
    const customers = await prisma.customer.findMany({
      select: {
        subscriptionTier: true,
        id: true
      }
    });

    const segmentation = {
      starter: customers.filter(c => c.subscriptionTier === 'starter').length,
      pro: customers.filter(c => c.subscriptionTier === 'pro').length,
      enterprise: customers.filter(c => c.subscriptionTier === 'enterprise').length
    };

    return segmentation;
  }

  static async getNewCustomers(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return prisma.customer.count({
      where: {
        joinedAt: { gte: startDate }
      }
    });
  }

  static async getCustomerLifetimeValue() {
    const result = await prisma.customer.aggregate({
      _avg: { customerLifetimeValue: true },
      _max: { customerLifetimeValue: true },
      _sum: { customerLifetimeValue: true }
    });

    return {
      average: result._avg.customerLifetimeValue || 0,
      max: result._max.customerLifetimeValue || 0,
      total: result._sum.customerLifetimeValue || 0
    };
  }

  // ============================================================================
  // SALES CHANNEL ANALYTICS
  // ============================================================================

  static async getChannelBreakdown() {
    const channels = await prisma.order.groupBy({
      by: ['salesChannel'],
      where: {
        paymentStatus: 'completed'
      },
      _sum: { amount: true },
      _count: true,
      orderBy: {
        _sum: {
          amount: 'desc'
        }
      }
    });

    const totalRevenue = channels.reduce((sum, c) => sum + Number(c._sum.amount || 0), 0);

    return channels.map(c => ({
      channel: c.salesChannel,
      revenue: c._sum.amount || 0,
      orders: c._count,
      share: totalRevenue > 0 ? ((Number(c._sum.amount || 0) / totalRevenue) * 100).toFixed(1) : 0
    }));
  }

  // ============================================================================
  // FORECAST DATA
  // ============================================================================

  static async getForecastData(days: number = 30) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    return prisma.forecast.findMany({
      where: {
        forecastDate: {
          gte: startDate,
          lte: endDate
        }
      },
      include: { product: true },
      orderBy: { forecastDate: 'asc' }
    });
  }

  // ============================================================================
  // AI INSIGHTS
  // ============================================================================

  static async getRecentInsights(limit: number = 10) {
    return prisma.revenueInsight.findMany({
      take: limit,
      orderBy: { generatedAt: 'desc' }
    });
  }

  // ============================================================================
  // RISK ALERTS
  // ============================================================================

  static async getActiveRiskAlerts() {
    return prisma.riskAlert.findMany({
      where: { isResolved: false },
      include: { customer: true },
      orderBy: { detectedAt: 'desc' }
    });
  }

  // ============================================================================
  // COMPREHENSIVE DASHBOARD DATA
  // ============================================================================

  static async getDashboardMetrics(days: number = 30) {
    const [
      totalRevenue,
      totalOrders,
      avgOrderValue,
      mrr,
      repeatCustomers,
      retentionRate,
      refundRate,
      churnRiskCount,
      regionData,
      topProducts,
      channelData,
      newCustomers
    ] = await Promise.all([
      this.getTotalRevenue(days),
      this.getTotalOrders(days),
      this.getAverageOrderValue(days),
      this.getMonthlyRecurringRevenue(),
      this.getRepeatCustomers(days),
      this.getCustomerRetentionRate(),
      this.getRefundRate(days),
      this.getChurnRiskCustomers(),
      this.getRegionalBreakdown(),
      this.getTopProducts(),
      this.getChannelBreakdown(),
      this.getNewCustomers(days)
    ]);

    return {
      kpis: {
        totalRevenue: Number(totalRevenue),
        totalOrders,
        avgOrderValue: Number(avgOrderValue),
        monthlyRecurringRevenue: Number(mrr),
        repeatCustomers,
        retentionRate: Number(retentionRate),
        refundRate: Number(refundRate),
        churnRiskCount,
        newCustomers
      },
      regional: regionData,
      topProducts,
      channels: channelData
    };
  }
}

export default AnalyticsService;
