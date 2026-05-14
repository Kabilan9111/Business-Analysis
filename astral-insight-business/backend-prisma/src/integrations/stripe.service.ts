import Stripe from 'stripe';
import { logger } from '../utils/logger';
import { cacheGet, cacheSet } from '../config/redis';

export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2023-10-16',
    });
  }

  /**
   * Fetch all charges
   */
  async getCharges(params: any = {}) {
    try {
      const cacheKey = `stripe:charges:${JSON.stringify(params)}`;
      const cached = await cacheGet(cacheKey);
      if (cached) {
        logger.debug('Returning cached Stripe charges');
        return cached;
      }

      const charges = await this.stripe.charges.list({
        limit: 100,
        ...params,
      });

      const data = charges.data || [];
      await cacheSet(cacheKey, data, 3600);
      logger.info({ count: data.length }, 'Fetched Stripe charges');
      return data;
    } catch (error) {
      logger.error({ error }, 'Failed to fetch Stripe charges');
      throw error;
    }
  }

  /**
   * Fetch subscriptions
   */
  async getSubscriptions(params: any = {}) {
    try {
      const cacheKey = `stripe:subscriptions:${JSON.stringify(params)}`;
      const cached = await cacheGet(cacheKey);
      if (cached) return cached;

      const subscriptions = await this.stripe.subscriptions.list({
        limit: 100,
        ...params,
      });

      const data = subscriptions.data || [];
      await cacheSet(cacheKey, data, 3600);
      logger.info({ count: data.length }, 'Fetched Stripe subscriptions');
      return data;
    } catch (error) {
      logger.error({ error }, 'Failed to fetch Stripe subscriptions');
      throw error;
    }
  }

  /**
   * Calculate monthly recurring revenue (MRR)
   */
  async calculateMRR() {
    try {
      const cacheKey = 'stripe:mrr';
      const cached = await cacheGet(cacheKey);
      if (cached) return cached;

      const subscriptions = await this.getSubscriptions({ status: 'active' });

      const mrr = subscriptions.reduce((sum: number, sub: any) => {
        if (sub.items.data.length > 0) {
          const item = sub.items.data[0];
          const amount = item.price.unit_amount || 0;
          return sum + amount / 100; // Convert cents to dollars
        }
        return sum;
      }, 0);

      await cacheSet(cacheKey, mrr, 1800);
      logger.info({ mrr }, 'Calculated Stripe MRR');
      return mrr;
    } catch (error) {
      logger.error({ error }, 'Failed to calculate MRR');
      throw error;
    }
  }

  /**
   * Calculate revenue from charges
   */
  async calculateRevenue(params: any = {}) {
    try {
      const charges = await this.getCharges(params);

      const revenue = charges.reduce((sum: number, charge: any) => {
        if (charge.paid) {
          return sum + charge.amount / 100; // Convert cents to dollars
        }
        return sum;
      }, 0);

      const refunded = charges.reduce((sum: number, charge: any) => {
        return sum + (charge.amount_refunded || 0) / 100;
      }, 0);

      return {
        totalRevenue: revenue,
        totalRefunded: refunded,
        netRevenue: revenue - refunded,
        totalCharges: charges.length,
      };
    } catch (error) {
      logger.error({ error }, 'Failed to calculate Stripe revenue');
      throw error;
    }
  }

  /**
   * Get failed payment attempts
   */
  async getFailedPayments() {
    try {
      const charges = await this.getCharges({ limit: 100 });
      const failed = charges.filter((c: any) => !c.paid);

      logger.info({ count: failed.length }, 'Fetched failed Stripe payments');
      return failed;
    } catch (error) {
      logger.error({ error }, 'Failed to fetch failed payments');
      throw error;
    }
  }

  /**
   * Calculate churn by analyzing subscription changes
   */
  async calculateChurn(days: number = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const subscriptions = await this.getSubscriptions();

      const churned = subscriptions.filter((sub: any) => {
        if (sub.canceled_at) {
          const cancelDate = new Date(sub.canceled_at * 1000);
          return cancelDate > cutoffDate;
        }
        return false;
      });

      const churnRate = subscriptions.length > 0 
        ? (churned.length / subscriptions.length) * 100 
        : 0;

      return {
        totalSubscriptions: subscriptions.length,
        churnedSubscriptions: churned.length,
        churnRate: parseFloat(churnRate.toFixed(2)),
      };
    } catch (error) {
      logger.error({ error }, 'Failed to calculate churn');
      throw error;
    }
  }
}

export const stripeService = new StripeService();
