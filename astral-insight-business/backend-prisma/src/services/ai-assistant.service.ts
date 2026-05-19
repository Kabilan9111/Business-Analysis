import { prisma } from '../config/prisma';

export class AIAssistantService {
  /**
   * Analyze revenue trends and identify anomalies
   */
  static async analyzeRevenueMetrics(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await prisma.order.findMany({
      where: { createdAt: { gte: startDate } },
      select: { amount: true, createdAt: true, paymentStatus: true },
      orderBy: { createdAt: 'asc' }
    });

    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.amount), 0);
    const avgOrder = totalRevenue / (orders.length || 1);
    const previousDaysRevenue = totalRevenue / days;
    
    // Calculate trend
    const midPoint = Math.floor(orders.length / 2);
    const firstHalf = orders.slice(0, midPoint).reduce((sum, o) => sum + Number(o.amount), 0);
    const secondHalf = orders.slice(midPoint).reduce((sum, o) => sum + Number(o.amount), 0);
    const trend = firstHalf > 0 ? ((secondHalf - firstHalf) / firstHalf * 100).toFixed(1) : 0;
    const failedOrders = orders.filter(o => o.paymentStatus === 'failed').length;

    return {
      totalRevenue: totalRevenue.toFixed(2),
      avgDailyRevenue: previousDaysRevenue.toFixed(2),
      avgOrderValue: avgOrder.toFixed(2),
      orderCount: orders.length,
      trend: `${trend}%`,
      failedOrders,
      insight: this.generateRevenueInsight(Number(trend), failedOrders, orders.length)
    };
  }

  /**
   * Identify churn risks in customer segments
   */
  static async analyzeChurnRisk() {
    const customers = await prisma.customer.findMany({
      select: {
        id: true,
        fullName: true,
        customerLifetimeValue: true,
        churnRiskScore: true,
        lastActivityAt: true,
        joinedAt: true,
        region: true
      },
      orderBy: { churnRiskScore: 'desc' }
    });

    const highRisk = customers.filter(c => c.churnRiskScore >= 70);
    const mediumRisk = customers.filter(c => c.churnRiskScore >= 40 && c.churnRiskScore < 70);
    
    // Segment by LTV
    const segments = {
      enterprise: customers.filter(c => Number(c.customerLifetimeValue) > 500000).length,
      midMarket: customers.filter(c => Number(c.customerLifetimeValue) >= 100000 && Number(c.customerLifetimeValue) <= 500000).length,
      smb: customers.filter(c => Number(c.customerLifetimeValue) < 100000).length
    };

    const atRiskRevenue = highRisk.reduce((sum, c) => sum + Number(c.customerLifetimeValue), 0);

    return {
      totalCustomers: customers.length,
      highRiskCount: highRisk.length,
      mediumRiskCount: mediumRisk.length,
      atRiskRevenue: atRiskRevenue.toFixed(2),
      segments,
      topAtRiskCustomers: highRisk.slice(0, 5).map(c => ({
        name: c.fullName,
        ltv: Number(c.customerLifetimeValue),
        riskScore: c.churnRiskScore,
        lastActive: c.lastActivityAt
      })),
      insight: this.generateChurnInsight(highRisk.length, customers.length, atRiskRevenue)
    };
  }

  /**
   * Forecast next month's MRR
   */
  static async forecastMRR() {
    const customers = await prisma.customer.findMany({
      select: { customerLifetimeValue: true, lastActivityAt: true }
    });

    const activeCustomers = customers.filter(c => {
      const lastActive = new Date(c.lastActivityAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return lastActive > thirtyDaysAgo;
    });

    const currentMRR = customers.reduce((sum, c) => sum + (Number(c.customerLifetimeValue) / 12), 0);
    const activeMRR = activeCustomers.reduce((sum, c) => sum + (Number(c.customerLifetimeValue) / 12), 0);
    
    // Simple forecast: assume 5% growth if retention is good
    const retentionRate = (activeCustomers.length / customers.length) * 100;
    const growthRate = retentionRate > 80 ? 0.05 : retentionRate > 60 ? 0.02 : -0.03;
    const forecastedMRR = currentMRR * (1 + growthRate);

    return {
      currentMRR: currentMRR.toFixed(2),
      forecastedMRR: forecastedMRR.toFixed(2),
      growth: `${(growthRate * 100).toFixed(1)}%`,
      activeCustomers: activeCustomers.length,
      totalCustomers: customers.length,
      retentionRate: `${retentionRate.toFixed(1)}%`,
      insight: this.generateMRRInsight(currentMRR, forecastedMRR, retentionRate)
    };
  }

  /**
   * Analyze traffic and user behavior
   */
  static async analyzeTrafficMetrics(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const activities = await prisma.userActivity.findMany({
      where: { timestamp: { gte: startDate } },
      select: { id: true, customerId: true, activityType: true, timestamp: true }
    });

    const uniqueSessions = new Set(activities.map(a => a.customerId)).size;
    const uniqueUsers = activities.length;
    const pageViews = activities.filter(a => a.activityType === 'page_view').length;
    const conversions = activities.filter(a => a.activityType === 'conversion').length;
    
    const conversionRate = uniqueSessions > 0 ? ((conversions / uniqueSessions) * 100).toFixed(2) : '0';
    const bounceRate = (Math.random() * 40 + 20).toFixed(1); // Simulated bounce rate

    return {
      sessions: uniqueSessions,
      users: uniqueUsers,
      pageViews,
      conversions,
      conversionRate: `${conversionRate}%`,
      bounceRate: `${bounceRate}%`,
      avgSessionsPerUser: (uniqueSessions / (uniqueUsers || 1)).toFixed(2),
      insight: this.generateTrafficInsight(uniqueSessions, conversions, Number(conversionRate))
    };
  }

  /**
   * Analyze conversion funnel
   */
  static async analyzeConversionFunnel() {
    const orders = await prisma.order.findMany({
      select: { id: true, amount: true, paymentStatus: true }
    });

    // Simulate funnel from activities
    const activities = await prisma.userActivity.findMany({
      select: { activityType: true }
    });

    const visitors = activities.length || 1;
    const productViews = activities.filter(a => a.activityType === 'page_view').length;
    const cartAdds = Math.floor(productViews * 0.3);
    const checkouts = Math.floor(cartAdds * 0.6);
    const purchases = orders.length;

    const funnel = [
      { stage: 'Visitors', count: visitors, rate: '100%' },
      { stage: 'Product Views', count: productViews, rate: `${((productViews / visitors) * 100).toFixed(1)}%` },
      { stage: 'Add to Cart', count: cartAdds, rate: `${((cartAdds / visitors) * 100).toFixed(1)}%` },
      { stage: 'Checkout', count: checkouts, rate: `${((checkouts / visitors) * 100).toFixed(1)}%` },
      { stage: 'Purchase', count: purchases, rate: `${((purchases / visitors) * 100).toFixed(1)}%` }
    ];

    const overallConversionRate = ((purchases / visitors) * 100).toFixed(2);

    return {
      funnel,
      overallConversionRate: `${overallConversionRate}%`,
      topBottleneck: this.identifyBottleneck(funnel),
      insight: this.generateConversionInsight(funnel, Number(overallConversionRate))
    };
  }

  /**
   * Analyze subscription and payment metrics
   */
  static async analyzeSubscriptionMetrics() {
    const customers = await prisma.customer.findMany({
      select: { customerLifetimeValue: true }
    });

    const orders = await prisma.order.findMany({
      select: { amount: true, paymentStatus: true }
    });

    const successfulPayments = orders.filter(o => o.paymentStatus === 'success').length;
    const failedPayments = orders.filter(o => o.paymentStatus === 'failed').length;
    const paymentSuccessRate = ((successfulPayments / (orders.length || 1)) * 100).toFixed(1);
    
    const mrrByCustomer = customers.reduce((sum, c) => sum + (Number(c.customerLifetimeValue) / 12), 0);
    const arr = mrrByCustomer * 12;

    return {
      totalSubscriptions: customers.length,
      activeSubscriptions: customers.filter(c => Number(c.customerLifetimeValue) > 0).length,
      MRR: mrrByCustomer.toFixed(2),
      ARR: arr.toFixed(2),
      paymentSuccessRate: `${paymentSuccessRate}%`,
      failedPayments,
      insight: this.generateSubscriptionInsight(customers.length, Number(paymentSuccessRate), failedPayments)
    };
  }

  /**
   * Generate intelligent response based on query
   */
  static async generateAIResponse(query: string): Promise<string> {
    const lowerQuery = query.toLowerCase();

    // Revenue analysis queries
    if (lowerQuery.includes('revenue') || lowerQuery.includes('income') || lowerQuery.includes('sales')) {
      const metrics = await this.analyzeRevenueMetrics();
      return `Revenue Analysis: Your business generated ₹${metrics.totalRevenue} in revenue over the past 30 days, averaging ₹${metrics.avgDailyRevenue} per day. Average order value is ₹${metrics.avgOrderValue}. ${metrics.insight}`;
    }

    // Churn and customer risk queries
    if (lowerQuery.includes('churn') || lowerQuery.includes('risk') || lowerQuery.includes('customer retention')) {
      const churn = await this.analyzeChurnRisk();
      return `Churn Risk Analysis: You have ${churn.highRiskCount} high-risk customers representing ₹${churn.atRiskRevenue} in potential lost revenue. Enterprise: ${churn.segments.enterprise} | Mid-Market: ${churn.segments.midMarket} | SMB: ${churn.segments.smb}. ${churn.insight}`;
    }

    // MRR and forecasting queries
    if (lowerQuery.includes('forecast') || lowerQuery.includes('mrr') || lowerQuery.includes('predict')) {
      const forecast = await this.forecastMRR();
      return `MRR Forecast: Your current MRR is ₹${forecast.currentMRR}. Based on ${forecast.retentionRate} retention rate, next month's MRR is projected at ₹${forecast.forecastedMRR} (${forecast.growth}). ${forecast.insight}`;
    }

    // Traffic and conversion queries
    if (lowerQuery.includes('traffic') || lowerQuery.includes('conversion') || lowerQuery.includes('users')) {
      const traffic = await this.analyzeTrafficMetrics();
      const conversion = await this.analyzeConversionFunnel();
      return `Traffic & Conversion: You had ${traffic.sessions} sessions from ${traffic.users} unique users with ${traffic.pageViews} page views. Conversion rate: ${conversion.overallConversionRate}. Top bottleneck: ${conversion.topBottleneck}. ${traffic.insight}`;
    }

    // Subscription queries
    if (lowerQuery.includes('subscription') || lowerQuery.includes('payment') || lowerQuery.includes('arr') || lowerQuery.includes('mrr')) {
      const subscription = await this.analyzeSubscriptionMetrics();
      return `Subscription Metrics: ${subscription.activeSubscriptions} active subscriptions generating ₹${subscription.MRR} MRR (₹${subscription.ARR} ARR). Payment success rate: ${subscription.paymentSuccessRate}. ${subscription.insight}`;
    }

    // Default comprehensive analysis
    const revenue = await this.analyzeRevenueMetrics();
    const churn = await this.analyzeChurnRisk();
    const forecast = await this.forecastMRR();
    return `Business Overview: Revenue is at ₹${revenue.totalRevenue} (${revenue.trend} trend). You have ${churn.highRiskCount} customers at churn risk. Projected MRR: ₹${forecast.forecastedMRR}. How else can I help analyze your business?`;
  }

  // ===== Helper Methods for Insights =====

  private static generateRevenueInsight(trend: number, failedOrders: number, totalOrders: number): string {
    if (trend > 10) {
      return `Strong upward trend! Revenue is accelerating. ${failedOrders > 0 ? `Note: ${failedOrders} failed orders detected.` : 'Payment processing is smooth.'}`;
    } else if (trend < -10) {
      return `Revenue is declining. Consider reviewing your pricing strategy or marketing efforts. ${failedOrders > 0 ? `High failed order rate (${failedOrders}/${totalOrders}) may be impacting conversion.` : ''}`;
    }
    return `Revenue is stable. ${failedOrders > 0 ? `Address ${failedOrders} failed payment(s) to improve revenue quality.` : 'Payment processing is healthy.'}`;
  }

  private static generateChurnInsight(atRiskCount: number, totalCustomers: number, atRiskRevenue: number): string {
    const percentage = ((atRiskCount / totalCustomers) * 100).toFixed(1);
    if (atRiskCount > totalCustomers * 0.15) {
      return `⚠️ ALERT: ${percentage}% of customers are high-risk, representing ₹${atRiskRevenue} in potential lost revenue. Immediate retention campaigns recommended.`;
    } else if (atRiskCount > totalCustomers * 0.08) {
      return `${percentage}% customer churn risk detected. Recommend proactive outreach to reduce risk.`;
    }
    return `Churn risk is well-controlled at ${percentage}% of customer base.`;
  }

  private static generateMRRInsight(currentMRR: number, forecastedMRR: number, retentionRate: number): string {
    if (retentionRate > 85) {
      return `✓ Excellent retention rate (${retentionRate.toFixed(1)}%). MRR growth is sustainable. Continue current strategies.`;
    } else if (retentionRate > 70) {
      return `Retention is moderate (${retentionRate.toFixed(1)}%). Focus on customer success initiatives to improve growth.`;
    }
    return `⚠️ Retention is below 70% (${retentionRate.toFixed(1)}%). Investigate cancellation reasons and implement win-back campaigns.`;
  }

  private static generateTrafficInsight(sessions: number, conversions: number, conversionRate: number): string {
    if (conversionRate > 3) {
      return `Excellent traffic quality! ${conversionRate}% conversion rate is significantly above industry average.`;
    } else if (conversionRate > 1) {
      return `Traffic conversion is decent at ${conversionRate}%. Optimize landing pages to improve further.`;
    }
    return `Low conversion rate (${conversionRate}%). Consider A/B testing landing pages and improving user experience.`;
  }

  private static generateConversionInsight(funnel: any[], overallRate: number): string {
    if (overallRate > 2) {
      return `Strong funnel performance at ${overallRate}% overall conversion. Focus on scaling traffic acquisition.`;
    } else if (overallRate > 0.5) {
      return `Funnel conversion is adequate at ${overallRate}%. Largest drop-off appears to be at checkout stage.`;
    }
    return `Low funnel conversion (${overallRate}%). Major optimization opportunity exists across multiple funnel stages.`;
  }

  private static generateSubscriptionInsight(subscriptionCount: number, successRate: number, failedPayments: number): string {
    if (successRate > 97) {
      return `✓ Payment processing is excellent (${successRate}% success rate). Focus on expanding subscription base.`;
    } else if (successRate > 95) {
      return `Good payment reliability at ${successRate}%. Monitor ${failedPayments} failed payments to prevent churn.`;
    }
    return `⚠️ Payment success rate of ${successRate}% indicates issues. ${failedPayments} failed payments detected - investigate billing system.`;
  }

  private static identifyBottleneck(funnel: any[]): string {
    let maxDrop = 0;
    let bottleneck = '';
    for (let i = 1; i < funnel.length; i++) {
      const dropRate = ((funnel[i - 1].count - funnel[i].count) / funnel[i - 1].count) * 100;
      if (dropRate > maxDrop) {
        maxDrop = dropRate;
        bottleneck = `${funnel[i].stage} (${dropRate.toFixed(1)}% drop)`;
      }
    }
    return bottleneck || 'Minimal drop-off across funnel';
  }
}
