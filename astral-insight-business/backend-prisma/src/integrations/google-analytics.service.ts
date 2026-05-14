import { BetaAnalyticsDataClient } from 'google-analytics-data';
import { logger } from '../utils/logger';
import { cacheGet, cacheSet } from '../config/redis';

export class GoogleAnalyticsService {
  private client: BetaAnalyticsDataClient;
  private propertyId: string;

  constructor() {
    this.client = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
    });

    this.propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID || '';
  }

  private formatDateRange() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  }

  /**
   * Fetch traffic metrics
   */
  async getTraffic() {
    try {
      const cacheKey = 'ga:traffic';
      const cached = await cacheGet(cacheKey);
      if (cached) {
        logger.debug('Returning cached GA traffic');
        return cached;
      }

      const dateRange = this.formatDateRange();

      const response = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [dateRange],
        metrics: [
          { name: 'activeUsers' },
          { name: 'newUsers' },
          { name: 'sessions' },
          { name: 'bounceRate' },
        ],
        dimensions: [{ name: 'date' }],
      });

      const traffic = response.rows?.map((row: any) => ({
        date: row.dimensionValues[0].value,
        users: row.metricValues[0].value,
        newUsers: row.metricValues[1].value,
        sessions: row.metricValues[2].value,
        bounceRate: parseFloat(row.metricValues[3].value),
      })) || [];

      await cacheSet(cacheKey, traffic, 3600);
      logger.info({ count: traffic.length }, 'Fetched GA traffic');
      return traffic;
    } catch (error) {
      logger.error({ error }, 'Failed to fetch GA traffic');
      throw error;
    }
  }

  /**
   * Fetch conversion metrics
   */
  async getConversions() {
    try {
      const cacheKey = 'ga:conversions';
      const cached = await cacheGet(cacheKey);
      if (cached) return cached;

      const dateRange = this.formatDateRange();

      const response = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [dateRange],
        metrics: [
          { name: 'conversions' },
          { name: 'conversionRate' },
        ],
        dimensions: [{ name: 'date' }],
      });

      const conversions = response.rows?.map((row: any) => ({
        date: row.dimensionValues[0].value,
        conversions: parseInt(row.metricValues[0].value),
        conversionRate: parseFloat(row.metricValues[1].value),
      })) || [];

      await cacheSet(cacheKey, conversions, 3600);
      logger.info({ count: conversions.length }, 'Fetched GA conversions');
      return conversions;
    } catch (error) {
      logger.error({ error }, 'Failed to fetch GA conversions');
      throw error;
    }
  }

  /**
   * Fetch device analytics
   */
  async getDeviceAnalytics() {
    try {
      const cacheKey = 'ga:devices';
      const cached = await cacheGet(cacheKey);
      if (cached) return cached;

      const dateRange = this.formatDateRange();

      const response = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [dateRange],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
        ],
        dimensions: [{ name: 'deviceCategory' }],
      });

      const devices = response.rows?.map((row: any) => ({
        device: row.dimensionValues[0].value,
        users: parseInt(row.metricValues[0].value),
        sessions: parseInt(row.metricValues[1].value),
      })) || [];

      await cacheSet(cacheKey, devices, 3600);
      logger.info({ count: devices.length }, 'Fetched GA device analytics');
      return devices;
    } catch (error) {
      logger.error({ error }, 'Failed to fetch device analytics');
      throw error;
    }
  }

  /**
   * Fetch regional analytics
   */
  async getRegionalAnalytics() {
    try {
      const cacheKey = 'ga:regions';
      const cached = await cacheGet(cacheKey);
      if (cached) return cached;

      const dateRange = this.formatDateRange();

      const response = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [dateRange],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'conversionRate' },
        ],
        dimensions: [{ name: 'region' }],
      });

      const regions = response.rows?.map((row: any) => ({
        region: row.dimensionValues[0].value,
        users: parseInt(row.metricValues[0].value),
        sessions: parseInt(row.metricValues[1].value),
        conversionRate: parseFloat(row.metricValues[2].value),
      })) || [];

      await cacheSet(cacheKey, regions, 3600);
      logger.info({ count: regions.length }, 'Fetched GA regional analytics');
      return regions;
    } catch (error) {
      logger.error({ error }, 'Failed to fetch regional analytics');
      throw error;
    }
  }

  /**
   * Fetch user retention
   */
  async getUserRetention() {
    try {
      const cacheKey = 'ga:retention';
      const cached = await cacheGet(cacheKey);
      if (cached) return cached;

      const dateRange = this.formatDateRange();

      const response = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [dateRange],
        metrics: [
          { name: 'activeUsers' },
          { name: 'returningUsers' },
        ],
        dimensions: [{ name: 'date' }],
      });

      const retention = response.rows?.map((row: any) => {
        const active = parseInt(row.metricValues[0].value);
        const returning = parseInt(row.metricValues[1].value);
        const rate = active > 0 ? (returning / active) * 100 : 0;

        return {
          date: row.dimensionValues[0].value,
          activeUsers: active,
          returningUsers: returning,
          retentionRate: parseFloat(rate.toFixed(2)),
        };
      }) || [];

      await cacheSet(cacheKey, retention, 3600);
      logger.info({ count: retention.length }, 'Fetched GA retention');
      return retention;
    } catch (error) {
      logger.error({ error }, 'Failed to fetch retention data');
      throw error;
    }
  }
}

export const googleAnalyticsService = new GoogleAnalyticsService();
