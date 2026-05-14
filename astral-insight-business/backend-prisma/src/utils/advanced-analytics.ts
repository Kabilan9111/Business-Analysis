import { prisma } from '../config/prisma';

/**
 * Advanced analytics queries for deep business intelligence
 */
export class AdvancedAnalytics {
  
  /**
   * Calculate Month-over-Month growth
   */
  static async getMonthOverMonthGrowth() {
    const today = new Date();
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    const currentMonth = await prisma.order.aggregate({
      where: {
        createdAt: { gte: currentMonthStart },
        paymentStatus: 'completed'
      },
      _sum: { amount: true }
    });

    const lastMonth = await prisma.order.aggregate({
      where: {
        createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
        paymentStatus: 'completed'
      },
      _sum: { amount: true }
    });

    const current = Number(currentMonth._sum.amount || 0);
    const last = Number(lastMonth._sum.amount || 0);
    const growth = last === 0 ? 0 : ((current - last) / last) * 100;

    return {
      currentMonth: current,
      lastMonth: last,
      growthPercentage: growth.toFixed(2)
    };
  }

  /**
   * Get cohort analysis for customer retention
   */
  static async getCohortAnalysis() {
    const cohorts = await prisma.customer.groupBy({
      by: ['subscriptionTier'],
      _count: { id: true },
      _avg: { customerLifetimeValue: true },
      _sum: { customerLifetimeValue: true }
    });

    return cohorts.map(cohort => ({
      tier: cohort.subscriptionTier,
      count: cohort._count.id,
      avgLTV: Number(cohort._avg.customerLifetimeValue || 0).toFixed(2),
      totalLTV: Number(cohort._sum.customerLifetimeValue || 0)
    }));
  }

  /**
   * Get high-value customer segments
   */
  static async getHighValueSegments(threshold: number = 50000) {
    const customers = await prisma.customer.findMany({
      where: {
        customerLifetimeValue: { gte: threshold }
      },
      include: {
        orders: { where: { paymentStatus: 'completed' } }
      },
      orderBy: { customerLifetimeValue: 'desc' }
    });

    return customers.map(customer => ({
      id: customer.id,
      name: customer.fullName,
      company: customer.companyName,
      ltv: Number(customer.customerLifetimeValue),
      orders: customer.orders.length,
      tier: customer.subscriptionTier,
      joinedAt: customer.joinedAt
    }));
  }

  /**
   * Analyze product cross-sell opportunities
   */
  static async getCrossSellAnalysis() {
    const customerOrders = await prisma.order.groupBy({
      by: ['customerId'],
      where: { paymentStatus: 'completed' },
      _count: { productId: true }
    });

    const single = customerOrders.filter(c => c._count.productId === 1).length;
    const multiple = customerOrders.filter(c => c._count.productId > 1).length;
    const crossSellRate = customerOrders.length === 0 ? 0 : (multiple / customerOrders.length) * 100;

    return {
      singleProduct: single,
      multipleProducts: multiple,
      crossSellRate: crossSellRate.toFixed(2),
      totalCustomers: customerOrders.length
    };
  }

  /**
   * Get regional benchmark
   */
  static async getRegionalBenchmark() {
    const regions = await prisma.order.groupBy({
      by: ['region'],
      where: { paymentStatus: 'completed' },
      _sum: { amount: true },
      _avg: { amount: true },
      _count: true
    });

    const overall_avg = regions.reduce((sum, r) => sum + Number(r._avg.amount || 0), 0) / regions.length;

    return regions.map(region => ({
      region: region.region,
      revenue: Number(region._sum.amount || 0),
      avgOrderValue: Number(region._avg.amount || 0),
      benchmark: ((Number(region._avg.amount || 0) / overall_avg) * 100).toFixed(1),
      orders: region._count
    }));
  }

  /**
   * Predict customer churn risk
   */
  static async getChurnPredictions() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const atRisk = await prisma.customer.findMany({
      where: {
        OR: [
          { churnRiskScore: { gte: 70 } },
          { lastActivityAt: { lt: thirtyDaysAgo } }
        ]
      },
      select: {
        id: true,
        fullName: true,
        companyName: true,
        subscriptionTier: true,
        churnRiskScore: true,
        customerLifetimeValue: true,
        lastActivityAt: true
      },
      orderBy: { churnRiskScore: 'desc' }
    });

    return {
      totalAtRisk: atRisk.length,
      totalValue: atRisk.reduce((sum, c) => sum + Number(c.customerLifetimeValue), 0),
      byTier: {
        starter: atRisk.filter(c => c.subscriptionTier === 'starter').length,
        pro: atRisk.filter(c => c.subscriptionTier === 'pro').length,
        enterprise: atRisk.filter(c => c.subscriptionTier === 'enterprise').length
      },
      topAtRisk: atRisk.slice(0, 10)
    };
  }

  /**
   * Calculate CAC (Customer Acquisition Cost)
   */
  static async getAcquisitionMetrics() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newCustomers = await prisma.customer.count({
      where: { joinedAt: { gte: thirtyDaysAgo } }
    });

    const newCustomersLifetime = await prisma.customer.aggregate({
      where: { joinedAt: { gte: thirtyDaysAgo } },
      _sum: { customerLifetimeValue: true }
    });

    return {
      newCustomersThisMonth: newCustomers,
      newCustomerLTV: Number(newCustomersLifetime._sum.customerLifetimeValue || 0),
      avgNewCustomerValue: newCustomers > 0 ? Number(newCustomersLifetime._sum.customerLifetimeValue || 0) / newCustomers : 0
    };
  }

  /**
   * Get payment method breakdown
   */
  static async getPaymentMethodAnalysis() {
    const payments = await prisma.order.groupBy({
      by: ['paymentStatus'],
      _sum: { amount: true },
      _count: true
    });

    return payments.map(p => ({
      status: p.paymentStatus,
      revenue: Number(p._sum.amount || 0),
      transactions: p._count
    }));
  }

  /**
   * Get product performance ranking
   */
  static async getProductRanking() {
    const products = await prisma.productPerformance.findMany({
      include: { product: true },
      orderBy: { totalRevenue: 'desc' }
    });

    return products.map(p => ({
      productName: p.product.name,
      rank: products.indexOf(p) + 1,
      revenue: Number(p.totalRevenue),
      orders: p.totalOrders,
      avgOrderValue: p.totalOrders > 0 ? Number(p.totalRevenue) / p.totalOrders : 0,
      customers: p.customerCount
    }));
  }
}

export default AdvancedAnalytics;
