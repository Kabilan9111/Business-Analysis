import { prisma } from '../config/prisma';
import { Decimal } from '@prisma/client/runtime/library';

export class CustomerService {
  // ============================================================================
  // CUSTOMER INSIGHTS
  // ============================================================================

  /**
   * Get all customers with health scores and metrics
   */
  static async getCustomers(
    page: number = 1,
    limit: number = 10,
    search?: string
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          fullName: true,
          email: true,
          subscriptionTier: true,
          customerLifetimeValue: true,
          churnRiskScore: true,
          lastActivityAt: true,
          joinedAt: true,
          _count: { select: { orders: true } }
        },
        orderBy: { lastActivityAt: 'desc' }
      }),
      prisma.customer.count({ where })
    ]);

    return {
      customers: customers.map(c => this.enrichCustomer(c)),
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };
  }

  /**
   * Enrich customer with calculated metrics
   */
  private static enrichCustomer(customer: any) {
    // Calculate health score (0-100)
    const daysActive = Math.floor((Date.now() - customer.joinedAt.getTime()) / (1000 * 60 * 60 * 24));
    const daysSinceActive = Math.floor((Date.now() - customer.lastActivityAt.getTime()) / (1000 * 60 * 60 * 24));
    
    // Health factors
    const recencyScore = daysSinceActive < 7 ? 100 : daysSinceActive < 30 ? 75 : daysSinceActive < 90 ? 50 : 25;
    const frequencyScore = customer._count.orders > 10 ? 90 : customer._count.orders > 5 ? 70 : customer._count.orders > 0 ? 50 : 20;
    const spendScore = Number(customer.customerLifetimeValue) > 50000 ? 95 : Number(customer.customerLifetimeValue) > 10000 ? 80 : Number(customer.customerLifetimeValue) > 1000 ? 60 : 30;
    
    const healthScore = Math.round((recencyScore * 0.3 + frequencyScore * 0.35 + spendScore * 0.35));
    
    // Churn risk based on database score
    let churnRisk = 'Low';
    const riskScore = customer.churnRiskScore || 0;
    if (riskScore > 80) churnRisk = 'Critical';
    else if (riskScore > 60) churnRisk = 'High';
    else if (riskScore > 40) churnRisk = 'Medium';
    
    // LTV estimation
    const avgOrderValue = customer._count.orders > 0 ? Number(customer.customerLifetimeValue) / customer._count.orders : 0;
    const estimatedLTV = avgOrderValue * (12 * (100 - riskScore) / 100); // Project 1 year with churn adjustment
    
    // Format last active
    const lastActive = customer.lastActivityAt 
      ? this.formatLastActive(customer.lastActivityAt)
      : 'Never';

    return {
      id: customer.id,
      name: customer.fullName,
      email: customer.email,
      tier: customer.subscriptionTier || 'Basic',
      health: Math.max(0, Math.min(100, healthScore)),
      ltv: `$${Math.round(estimatedLTV).toLocaleString()}`,
      risk: churnRisk,
      lastActive,
      orderCount: customer._count.orders,
      totalSpend: Number(customer.customerLifetimeValue),
      avatar: customer.fullName.split(' ').slice(0, 2).map((n: string) => n[0]).join('')
    };
  }

  private static formatLastActive(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }

  // ============================================================================
  // GLOBAL HEALTH METRICS
  // ============================================================================

  /**
   * Get global health metrics
   */
  static async getGlobalHealth() {
    const customers = await prisma.customer.findMany({
      select: {
        id: true,
        lastActivityAt: true,
        customerLifetimeValue: true,
        churnRiskScore: true,
        joinedAt: true,
        _count: { select: { orders: true } }
      }
    });

    if (customers.length === 0) {
      return {
        globalHealthScore: 0,
        engagement: 0,
        adoption: 0,
        support: 0,
        revenue: 0,
        advocacy: 0,
        usage: 0
      };
    }

    // Calculate aggregate metrics
    const now = new Date();
    const engagement = customers.filter(c => 
      now.getTime() - c.lastActivityAt.getTime() < 7 * 24 * 60 * 60 * 1000
    ).length / customers.length * 100;

    const adoption = customers.filter(c => c._count.orders > 0).length / customers.length * 100;
    
    const revenue = customers.filter(c => Number(c.customerLifetimeValue) > 10000).length / customers.length * 100;
    
    const support = 100 - (customers.reduce((sum, c) => sum + (c.churnRiskScore || 0), 0) / customers.length);
    
    const advocacy = customers.filter(c => Number(c.customerLifetimeValue) > 50000 && c._count.orders > 10).length / customers.length * 100;
    
    const usage = adoption; // Same as adoption for this dataset

    const globalScore = Math.round((engagement + adoption + support + revenue + advocacy + usage) / 6);

    return {
      globalHealthScore: Math.max(0, Math.min(100, globalScore)),
      engagement: Math.round(engagement),
      adoption: Math.round(adoption),
      support: Math.round(support),
      revenue: Math.round(revenue),
      advocacy: Math.round(advocacy),
      usage: Math.round(usage)
    };
  }

  // ============================================================================
  // CUSTOMER SEGMENTS
  // ============================================================================

  /**
   * Get customer counts by segment
   */
  static async getSegmentMetrics() {
    const customers = await prisma.customer.findMany({
      select: {
        subscriptionTier: true,
        customerLifetimeValue: true,
        _count: { select: { orders: true } }
      }
    });

    const powerUsers = customers.filter(c => c._count.orders > 10 && Number(c.customerLifetimeValue) > 10000).length;
    const churnRisk = customers.filter(c => Number(c.customerLifetimeValue) < 5000).length * 0.15; // Estimate 15% churn risk
    const upsellPotential = customers.filter(c => Number(c.customerLifetimeValue) > 20000).length * (Number(customers.reduce((sum, c) => sum + Number(c.customerLifetimeValue), 0)) / customers.length);

    return {
      powerUsers,
      highChurnRisk: Math.round(churnRisk),
      upsellPotentialRevenue: `$${Math.round(upsellPotential).toLocaleString()}`
    };
  }

  // ============================================================================
  // LTV FORECAST
  // ============================================================================

  /**
   * Get LTV trend data for chart
   */
  static async getLTVTrend(months: number = 6) {
    const data = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);

      const customers = await prisma.customer.findMany({
        where: {
          joinedAt: { lte: date }
        },
        select: { customerLifetimeValue: true, _count: { select: { orders: true } } }
      });

      const avgLTV = customers.length > 0
        ? customers.reduce((sum, c) => sum + Number(c.customerLifetimeValue), 0) / customers.length
        : 0;

      data.push({
        month: monthNames[months - 1 - i],
        ltv: Math.round(avgLTV)
      });
    }

    return data;
  }

  // ============================================================================
  // CUSTOMER RECOMMENDATIONS
  // ============================================================================

  /**
   * Get AI recommendations for customers
   */
  static async getRecommendations() {
    const recommendations = [];

    // Find high-risk customers
    const highRisk = await prisma.customer.findMany({
      where: {
        churnRiskScore: { gte: 70 }
      },
      take: 2,
      select: { fullName: true, churnRiskScore: true }
    });

    highRisk.forEach(customer => {
      recommendations.push({
        type: 'warning',
        text: `Schedule check-in with <strong>${customer.fullName}</strong>. Risk score increased by ${Math.round(customer.churnRiskScore)}.`
      });
    });

    // Find customers who can be upsold
    const upsellCandidates = await prisma.customer.findMany({
      where: {
        subscriptionTier: 'Basic',
        customerLifetimeValue: { gte: 5000 }
      },
      take: 2,
      select: { fullName: true, _count: { select: { orders: true } } }
    });

    upsellCandidates.forEach(customer => {
      recommendations.push({
        type: 'success',
        text: `Offer Pro upgrade to <strong>${customer.fullName}</strong>. Usage limits reached ${customer._count.orders} times.`
      });
    });

    return recommendations;
  }
}
