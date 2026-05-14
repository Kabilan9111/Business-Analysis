import axios, { AxiosInstance } from 'axios';
import { logger } from '../utils/logger';
import { cacheGet, cacheSet } from '../config/redis';

export class ShopifyService {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor() {
    const domain = process.env.SHOPIFY_STORE_DOMAIN;
    const version = process.env.SHOPIFY_API_VERSION || '2024-01';
    this.baseUrl = `https://${domain}/admin/api/${version}`;

    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
      },
    });
  }

  /**
   * Fetch all orders from Shopify
   */
  async getOrders(params: any = {}) {
    try {
      const cacheKey = `shopify:orders:${JSON.stringify(params)}`;
      const cached = await cacheGet(cacheKey);
      if (cached) {
        logger.debug('Returning cached Shopify orders');
        return cached;
      }

      const response = await this.client.get('/orders.json', { params });
      const orders = response.data.orders || [];

      await cacheSet(cacheKey, orders, 3600);
      logger.info({ count: orders.length }, 'Fetched Shopify orders');
      return orders;
    } catch (error) {
      logger.error({ error }, 'Failed to fetch Shopify orders');
      throw error;
    }
  }

  /**
   * Fetch products
   */
  async getProducts(params: any = {}) {
    try {
      const cacheKey = `shopify:products:${JSON.stringify(params)}`;
      const cached = await cacheGet(cacheKey);
      if (cached) return cached;

      const response = await this.client.get('/products.json', { params });
      const products = response.data.products || [];

      await cacheSet(cacheKey, products, 3600);
      logger.info({ count: products.length }, 'Fetched Shopify products');
      return products;
    } catch (error) {
      logger.error({ error }, 'Failed to fetch Shopify products');
      throw error;
    }
  }

  /**
   * Fetch customers
   */
  async getCustomers(params: any = {}) {
    try {
      const cacheKey = `shopify:customers:${JSON.stringify(params)}`;
      const cached = await cacheGet(cacheKey);
      if (cached) return cached;

      const response = await this.client.get('/customers.json', { params });
      const customers = response.data.customers || [];

      await cacheSet(cacheKey, customers, 3600);
      logger.info({ count: customers.length }, 'Fetched Shopify customers');
      return customers;
    } catch (error) {
      logger.error({ error }, 'Failed to fetch Shopify customers');
      throw error;
    }
  }

  /**
   * Fetch inventory
   */
  async getInventory() {
    try {
      const cacheKey = 'shopify:inventory';
      const cached = await cacheGet(cacheKey);
      if (cached) return cached;

      const products = await this.getProducts();
      const inventory = products.map((p: any) => ({
        id: p.id,
        title: p.title,
        variants: p.variants.map((v: any) => ({
          id: v.id,
          sku: v.sku,
          inventory_quantity: v.inventory_quantity,
        })),
      }));

      await cacheSet(cacheKey, inventory, 1800);
      return inventory;
    } catch (error) {
      logger.error({ error }, 'Failed to fetch Shopify inventory');
      throw error;
    }
  }

  /**
   * Calculate revenue from orders
   */
  async calculateRevenue(startDate?: string, endDate?: string) {
    try {
      const params: any = { limit: 250, status: 'any' };
      if (startDate) params.created_at_min = startDate;
      if (endDate) params.created_at_max = endDate;

      const orders = await this.getOrders(params);
      const revenue = orders.reduce((sum: number, order: any) => {
        return sum + parseFloat(order.total_price || 0);
      }, 0);

      return {
        totalRevenue: revenue,
        totalOrders: orders.length,
        averageOrderValue: orders.length > 0 ? revenue / orders.length : 0,
      };
    } catch (error) {
      logger.error({ error }, 'Failed to calculate Shopify revenue');
      throw error;
    }
  }

  /**
   * Fetch abandoned carts
   */
  async getAbandonedCarts() {
    try {
      const response = await this.client.get('/checkouts.json', {
        params: { status: 'abandoned' },
      });
      return response.data.checkouts || [];
    } catch (error) {
      logger.error({ error }, 'Failed to fetch abandoned carts');
      throw error;
    }
  }
}

export const shopifyService = new ShopifyService();
