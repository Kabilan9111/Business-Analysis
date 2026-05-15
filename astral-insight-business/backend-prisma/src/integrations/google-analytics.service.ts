import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { logger } from '../utils/logger';
import { cacheGet, cacheSet } from '../config/redis';

export class GoogleAnalyticsService {
  private client: BetaAnalyticsDataClient;
  private propertyId: string;

  constructor() {
    // Use service account credentials file or env vars
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (clientEmail && privateKey) {
      this.client = new BetaAnalyticsDataClient({
        credentials: { client_email: clientEmail, private_key: privateKey },
      });
    } else if (credentialsPath) {
      this.client = new BetaAnalyticsDataClient({
        keyFilename: credentialsPath,
      });
    } else {
      this.client = new BetaAnalyticsDataClient();
    }

    this.propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID || '';
  }

  private dateRange(days = 30) {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };
  }

  async getTraffic(days = 30) {
    const cacheKey = `ga:traffic:${days}`;
    try {
      const cached = await cacheGet(cacheKey);
      if (cached) return cached;

      if (!this.propertyId) return this.fallbackTraffic();

      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [this.dateRange(days)],
        metrics: [
          { name: 'activeUsers' },
          { name: 'newUsers' },
          { name: 'sessions' },
          { name: 'bounceRate' },
        ],
        dimensions: [{ name: 'date' }],
      });

      const traffic = (response.rows || []).map((row: any) => ({
        date: row.dimensionValues[0].value,
        users: parseInt(row.metricValues[0].value || '0'),
        newUsers: parseInt(row.metricValues[1].value || '0'),
        sessions: parseInt(row.metricValues[2].value || '0'),
        bounceRate: parseFloat(row.metricValues[3].value || '0'),
      }));

      await cacheSet(cacheKey, traffic, 3600);
      return traffic;
    } catch (error) {
      logger.warn({ error }, 'GA traffic fetch failed — returning fallback');
      return this.fallbackTraffic();
    }
  }

  async getConversions(days = 30) {
    const cacheKey = `ga:conversions:${days}`;
    try {
      const cached = await cacheGet(cacheKey);
      if (cached) return cached;

      if (!this.propertyId) return [];

      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [this.dateRange(days)],
        metrics: [{ name: 'conversions' }, { name: 'conversionRate' }],
        dimensions: [{ name: 'date' }],
      });

      const data = (response.rows || []).map((row: any) => ({
        date: row.dimensionValues[0].value,
        conversions: parseInt(row.metricValues[0].value || '0'),
        conversionRate: parseFloat(row.metricValues[1].value || '0'),
      }));

      await cacheSet(cacheKey, data, 3600);
      return data;
    } catch (error) {
      logger.warn({ error }, 'GA conversions fetch failed');
      return [];
    }
  }

  async getDeviceAnalytics(days = 30) {
    const cacheKey = `ga:devices:${days}`;
    try {
      const cached = await cacheGet(cacheKey);
      if (cached) return cached;

      if (!this.propertyId) return [];

      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [this.dateRange(days)],
        metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
        dimensions: [{ name: 'deviceCategory' }],
      });

      const data = (response.rows || []).map((row: any) => ({
        device: row.dimensionValues[0].value,
        users: parseInt(row.metricValues[0].value || '0'),
        sessions: parseInt(row.metricValues[1].value || '0'),
      }));

      await cacheSet(cacheKey, data, 3600);
      return data;
    } catch (error) {
      logger.warn({ error }, 'GA device analytics failed');
      return [];
    }
  }

  async getRegionalAnalytics(days = 30) {
    const cacheKey = `ga:regions:${days}`;
    try {
      const cached = await cacheGet(cacheKey);
      if (cached) return cached;

      if (!this.propertyId) return [];

      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [this.dateRange(days)],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'conversionRate' },
        ],
        dimensions: [{ name: 'region' }],
      });

      const data = (response.rows || []).map((row: any) => ({
        region: row.dimensionValues[0].value,
        users: parseInt(row.metricValues[0].value || '0'),
        sessions: parseInt(row.metricValues[1].value || '0'),
        conversionRate: parseFloat(row.metricValues[2].value || '0'),
      }));

      await cacheSet(cacheKey, data, 3600);
      return data;
    } catch (error) {
      logger.warn({ error }, 'GA regional analytics failed');
      return [];
    }
  }

  async getUserRetention(days = 30) {
    const cacheKey = `ga:retention:${days}`;
    try {
      const cached = await cacheGet(cacheKey);
      if (cached) return cached;

      if (!this.propertyId) return [];

      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [this.dateRange(days)],
        metrics: [{ name: 'activeUsers' }, { name: 'newUsers' }],
        dimensions: [{ name: 'date' }],
      });

      const data = (response.rows || []).map((row: any) => {
        const active = parseInt(row.metricValues[0].value || '0');
        const newU = parseInt(row.metricValues[1].value || '0');
        const returning = active - newU;
        return {
          date: row.dimensionValues[0].value,
          activeUsers: active,
          returningUsers: returning,
          retentionRate: active > 0 ? parseFloat(((returning / active) * 100).toFixed(2)) : 0,
        };
      });

      await cacheSet(cacheKey, data, 3600);
      return data;
    } catch (error) {
      logger.warn({ error }, 'GA retention fetch failed');
      return [];
    }
  }

  /** Fallback when GA credentials not configured */
  private fallbackTraffic() {
    return [
      { date: 'today', users: 0, newUsers: 0, sessions: 0, bounceRate: 0 }
    ];
  }
}

export const googleAnalyticsService = new GoogleAnalyticsService();
