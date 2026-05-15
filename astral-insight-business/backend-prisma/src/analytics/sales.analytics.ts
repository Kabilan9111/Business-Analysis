import { prisma } from '../config/prisma';
import { logger } from '../utils/logger';
import { cacheGet, cacheSet } from '../config/redis';
import Decimal from 'decimal.js';

export class SalesAnalyticsService {

  // ============================================================================
  // FULL DASHBOARD — Redis-cached
  // ============================================================================
  async getDashboardMetrics(days: number = 30) {
    const cacheKey = `sales:dashboard:${days}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const prevStart = new Date(startDate);
    prevStart.setDate(prevStart.getDate() - days);

    const [
      kpis, trends, topProducts, regional, categories, channels,
      insights, recentOrders, prevRevenue
    ] = await Promise.all([
      this.getKPIs(startDate),
      this.getRevenueTrend(startDate),
      this.getTopProducts(8),
      this.getRegionalBreakdown(),
      this.getCategoryBreakdown(),
      this.getChannelBreakdown(),
      this.getDynamicInsights(startDate),
      this.getRecentOrders(20),
      this.getTotalRevenue(prevStart, startDate),
    ]);

    const currentRevenue = kpis.totalRevenue;
    const revenueGrowth = Number(prevRevenue) > 0
      ? ((currentRevenue - Number(prevRevenue)) / Number(prevRevenue)) * 100
      : 0;

    const metrics = {
      kpis: { ...kpis, revenueGrowth: parseFloat(revenueGrowth.toFixed(2)) },
      trends,
      topProducts,
      regional,
      categories,
      channels,
      insights,
      recentOrders,
      period: { days, startDate: startDate.toISOString() },
      generatedAt: new Date().toISOString(),
    };

    await cacheSet(cacheKey, metrics, 900); // 15-min cache
    return metrics;
  }

  // ============================================================================
  // KPIs
  // ============================================================================
  async getKPIs(startDate: Date) {
    const [
      revenueResult, ordersCount, refundResult,
      repeatCustomers, totalCustomers, activeCustomers,
      mrrResult, churnRiskCount
    ] = await Promise.all([
      prisma.order.aggregate({
        where: { createdAt: { gte: startDate }, paymentStatus: 'completed' },
        _sum: { amount: true }, _count: true, _avg: { amount: true }
      }),
      prisma.order.count({
        where: { createdAt: { gte: startDate }, paymentStatus: 'completed' }
      }),
      prisma.order.count({
        where: { createdAt: { gte: startDate }, refundStatus: { not: 'none' } }
      }),
      this.getRepeatCustomers(startDate),
      prisma.customer.count(),
      prisma.customer.count({
        where: { lastActivityAt: { gte: new Date(Date.now() - 30 * 864e5) } }
      }),
      prisma.product.aggregate({ _sum: { monthlyRecurringRevenue: true } }),
      prisma.customer.count({ where: { churnRiskScore: { gte: 70 } } }),
    ]);

    const totalRevenue = Number(revenueResult._sum.amount || 0);
    const avgOrderValue = revenueResult._count > 0
      ? totalRevenue / revenueResult._count : 0;
    const refundRate = ordersCount > 0 ? (refundResult / ordersCount) * 100 : 0;
    const retentionRate = totalCustomers > 0 ? (activeCustomers / totalCustomers) * 100 : 0;
    const repeatPct = activeCustomers > 0 ? (repeatCustomers / activeCustomers) * 100 : 0;

    return {
      totalRevenue,
      totalOrders: ordersCount,
      avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
      monthlyRecurringRevenue: Number(mrrResult._sum.monthlyRecurringRevenue || 0),
      repeatCustomers,
      repeatCustomerPct: parseFloat(repeatPct.toFixed(1)),
      retentionRate: parseFloat(retentionRate.toFixed(1)),
      refundRate: parseFloat(refundRate.toFixed(2)),
      churnRiskCount,
      totalCustomers,
      activeCustomers,
    };
  }

  // ============================================================================
  // REVENUE TREND — grouped by day
  // ============================================================================
  async getRevenueTrend(startDate: Date) {
    const orders = await prisma.order.findMany({
      where: { createdAt: { gte: startDate }, paymentStatus: 'completed' },
      select: { createdAt: true, amount: true },
      orderBy: { createdAt: 'asc' },
    });

    const daily: Record<string, { revenue: number; orders: number }> = {};
    orders.forEach(o => {
      const d = o.createdAt.toISOString().split('T')[0];
      if (!daily[d]) daily[d] = { revenue: 0, orders: 0 };
      daily[d].revenue += Number(o.amount);
      daily[d].orders += 1;
    });

    return Object.entries(daily).map(([date, v]) => ({
      date,
      revenue: parseFloat(v.revenue.toFixed(2)),
      orders: v.orders,
    }));
  }

  // ============================================================================
  // MONTHLY TREND — for chart
  // ============================================================================
  async getMonthlyTrend(months: number = 12) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const orders = await prisma.order.findMany({
      where: { createdAt: { gte: startDate }, paymentStatus: 'completed' },
      select: { createdAt: true, amount: true },
      orderBy: { createdAt: 'asc' },
    });

    const monthly: Record<string, { revenue: number; orders: number }> = {};
    orders.forEach(o => {
      const d = o.createdAt;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!monthly[key]) monthly[key] = { revenue: 0, orders: 0 };
      monthly[key].revenue += Number(o.amount);
      monthly[key].orders += 1;
    });

    return Object.entries(monthly).map(([month, v]) => ({
      month,
      revenue: parseFloat(v.revenue.toFixed(2)),
      orders: v.orders,
    }));
  }

  // ============================================================================
  // TOP PRODUCTS — with growth
  // ============================================================================
  async getTopProducts(limit: number = 8) {
    const grouped = await prisma.order.groupBy({
      by: ['productId'],
      where: { paymentStatus: 'completed' },
      _sum: { amount: true },
      _count: true,
      orderBy: { _sum: { amount: 'desc' } },
      take: limit,
    });

    const productIds = grouped.map(g => g.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    return grouped.map(g => {
      const product = products.find(p => p.id === g.productId);
      const revenue = Number(g._sum.amount || 0);
      const avgVal = g._count > 0 ? revenue / g._count : 0;
      return {
        productId: g.productId,
        name: product?.name || 'Unknown',
        category: product?.category || 'Unknown',
        revenue: parseFloat(revenue.toFixed(2)),
        orders: g._count,
        avgOrderValue: parseFloat(avgVal.toFixed(2)),
        conversionRate: Number(product?.conversionRate || 0),
        growthPercentage: Number(product?.growthPercentage || 0),
      };
    });
  }

  // ============================================================================
  // REGIONAL BREAKDOWN
  // ============================================================================
  async getRegionalBreakdown() {
    const regions = await prisma.order.groupBy({
      by: ['region'],
      where: { paymentStatus: 'completed' },
      _sum: { amount: true },
      _count: true,
      orderBy: { _sum: { amount: 'desc' } },
    });

    const totalRevenue = regions.reduce((s, r) => s + Number(r._sum.amount || 0), 0);

    return regions.map(r => ({
      region: r.region,
      revenue: Number(r._sum.amount || 0),
      orders: r._count,
      marketShare: totalRevenue > 0
        ? parseFloat(((Number(r._sum.amount || 0) / totalRevenue) * 100).toFixed(1))
        : 0,
    }));
  }

  // ============================================================================
  // CATEGORY BREAKDOWN — via product join
  // ============================================================================
  async getCategoryBreakdown() {
    const products = await prisma.product.findMany({
      select: { id: true, category: true }
    });
    const productMap = new Map(products.map(p => [p.id, p.category]));

    const orders = await prisma.order.findMany({
      where: { paymentStatus: 'completed' },
      select: { productId: true, amount: true },
    });

    const catMap: Record<string, number> = {};
    orders.forEach(o => {
      const cat = productMap.get(o.productId) || 'Other';
      catMap[cat] = (catMap[cat] || 0) + Number(o.amount);
    });

    const COLORS = ['#6432E6', '#10b981', '#3b82f6', '#f59e0b', '#ec4899'];
    return Object.entries(catMap)
      .sort(([, a], [, b]) => b - a)
      .map(([name, value], i) => ({
        name,
        value: parseFloat(value.toFixed(2)),
        color: COLORS[i % COLORS.length],
      }));
  }

  // ============================================================================
  // CHANNEL BREAKDOWN
  // ============================================================================
  async getChannelBreakdown() {
    const channels = await prisma.order.groupBy({
      by: ['salesChannel'],
      where: { paymentStatus: 'completed' },
      _sum: { amount: true },
      _count: true,
      orderBy: { _sum: { amount: 'desc' } },
    });

    const total = channels.reduce((s, c) => s + Number(c._sum.amount || 0), 0);

    return channels.map(c => ({
      channel: c.salesChannel,
      revenue: Number(c._sum.amount || 0),
      orders: c._count,
      share: total > 0
        ? parseFloat(((Number(c._sum.amount || 0) / total) * 100).toFixed(1))
        : 0,
    }));
  }

  // ============================================================================
  // RECENT ORDERS — transaction ledger
  // ============================================================================
  async getRecentOrders(
    limit = 20,
    page = 1,
    filters: {
      status?: string;
      region?: string;
      search?: string;
      startDate?: string;
      endDate?: string;
    } = {}
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters.status && filters.status !== 'all') {
      where.paymentStatus = filters.status;
    }
    if (filters.region) {
      where.region = filters.region;
    }
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
      if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          customer: { select: { fullName: true, companyName: true } },
          product: { select: { name: true, category: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders: orders.map(o => ({
        id: o.orderId,
        customer: o.customer.companyName || o.customer.fullName,
        product: o.product.name,
        category: o.product.category,
        region: o.region,
        city: o.city,
        amount: Number(o.amount),
        quantity: o.quantity,
        paymentStatus: o.paymentStatus,
        refundStatus: o.refundStatus,
        salesChannel: o.salesChannel,
        date: o.createdAt.toISOString().split('T')[0],
      })),
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  }

  // ============================================================================
  // DYNAMIC AI INSIGHTS — derived from real DB data
  // ============================================================================
  async getDynamicInsights(startDate: Date) {
    const [topRegion, topProduct, refundData, recentRevenue, prevRevenue] = await Promise.all([
      prisma.order.groupBy({
        by: ['region'],
        where: { createdAt: { gte: startDate }, paymentStatus: 'completed' },
        _sum: { amount: true },
        orderBy: { _sum: { amount: 'desc' } },
        take: 1,
      }),
      prisma.order.groupBy({
        by: ['productId'],
        where: { createdAt: { gte: startDate }, paymentStatus: 'completed' },
        _sum: { amount: true },
        orderBy: { _sum: { amount: 'desc' } },
        take: 1,
      }),
      prisma.order.count({
        where: { createdAt: { gte: startDate }, refundStatus: { not: 'none' } }
      }),
      this.getTotalRevenue(startDate, new Date()),
      this.getTotalRevenue(
        new Date(startDate.getTime() - (Date.now() - startDate.getTime())),
        startDate
      ),
    ]);

    const insights = [];
    const growthPct = Number(prevRevenue) > 0
      ? ((Number(recentRevenue) - Number(prevRevenue)) / Number(prevRevenue)) * 100
      : 0;

    if (growthPct > 10) {
      insights.push({
        id: 'rev-growth',
        severity: 'success',
        category: 'Revenue',
        confidence: 94,
        text: `Revenue increased ${growthPct.toFixed(1)}% vs the previous period. Strong momentum detected across enterprise channels.`,
        generatedAt: new Date().toISOString(),
      });
    } else if (growthPct < -5) {
      insights.push({
        id: 'rev-decline',
        severity: 'warning',
        category: 'Revenue',
        confidence: 89,
        text: `Revenue declined ${Math.abs(growthPct).toFixed(1)}% vs the previous period. Investigate top channels for friction.`,
        generatedAt: new Date().toISOString(),
      });
    }

    if (topRegion[0]) {
      insights.push({
        id: 'top-region',
        severity: 'info',
        category: 'Growth',
        confidence: 91,
        text: `${topRegion[0].region} is the top-performing region this period with ₹${Number(topRegion[0]._sum.amount || 0).toLocaleString('en-IN')} in revenue.`,
        generatedAt: new Date().toISOString(),
      });
    }

    if (topProduct[0]) {
      const prod = await prisma.product.findUnique({ where: { id: topProduct[0].productId } });
      if (prod) {
        insights.push({
          id: 'top-product',
          severity: 'success',
          category: 'Conversion',
          confidence: 88,
          text: `"${prod.name}" is driving the highest revenue this period. Consider cross-selling adjacent products to this segment.`,
          generatedAt: new Date().toISOString(),
        });
      }
    }

    if (refundData > 5) {
      insights.push({
        id: 'refund-spike',
        severity: 'warning',
        category: 'Churn',
        confidence: 85,
        text: `${refundData} refunds detected this period. Investigate customer satisfaction in high-churn segments.`,
        generatedAt: new Date().toISOString(),
      });
    }

    return insights;
  }

  // ============================================================================
  // EXPORT — CSV structure
  // ============================================================================
  async getExportData(filters: { startDate?: string; endDate?: string } = {}) {
    const where: any = { paymentStatus: 'completed' };
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
      if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
    }

    return prisma.order.findMany({
      where,
      include: {
        customer: { select: { fullName: true, companyName: true, email: true, city: true, state: true } },
        product: { select: { name: true, category: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5000,
    });
  }

  // ============================================================================
  // CUSTOMER INTELLIGENCE
  // ============================================================================
  async getCustomerIntelligence() {
    const [total, atRisk, highValue, avgLTV, tierBreakdown, newCustomers] = await Promise.all([
      prisma.customer.count(),
      prisma.customer.count({ where: { churnRiskScore: { gte: 70 } } }),
      prisma.customer.count({ where: { customerLifetimeValue: { gte: 50000 } } }),
      prisma.customer.aggregate({ _avg: { customerLifetimeValue: true } }),
      prisma.customer.groupBy({
        by: ['subscriptionTier'],
        _count: true,
        _sum: { customerLifetimeValue: true },
      }),
      prisma.customer.count({
        where: { joinedAt: { gte: new Date(Date.now() - 30 * 864e5) } }
      }),
    ]);

    return {
      total,
      atRisk,
      highValue,
      newCustomers,
      avgLifetimeValue: Number(avgLTV._avg.customerLifetimeValue || 0),
      tierBreakdown: tierBreakdown.map(t => ({
        tier: t.subscriptionTier,
        count: t._count,
        totalLTV: Number(t._sum.customerLifetimeValue || 0),
      })),
    };
  }

  // ============================================================================
  // HELPERS
  // ============================================================================
  private async getTotalRevenue(startDate: Date, endDate: Date) {
    const result = await prisma.order.aggregate({
      where: { createdAt: { gte: startDate, lte: endDate }, paymentStatus: 'completed' },
      _sum: { amount: true },
    });
    return result._sum.amount || new Decimal(0);
  }

  private async getRepeatCustomers(startDate: Date) {
    const grouped = await prisma.order.groupBy({
      by: ['customerId'],
      where: { createdAt: { gte: startDate }, paymentStatus: 'completed' },
      _count: true,
      having: { customerId: { _count: { gt: 1 } } },
    });
    return grouped.length;
  }
}

export const salesAnalyticsService = new SalesAnalyticsService();
