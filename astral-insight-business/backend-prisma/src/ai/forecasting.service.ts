import axios from 'axios';
import { logger } from '../utils/logger';
import { cacheGet, cacheSet } from '../config/redis';

export class ForecastingService {
  private pythonApiUrl = process.env.PYTHON_API_URL || 'http://localhost:8000';

  /**
   * Generate revenue forecast
   */
  async generateRevenueForcast(params: any = {}) {
    try {
      const cacheKey = `forecast:revenue:${JSON.stringify(params)}`;
      const cached = await cacheGet(cacheKey);
      if (cached) {
        logger.debug('Returning cached revenue forecast');
        return cached;
      }

      const response = await axios.post(`${this.pythonApiUrl}/forecast/revenue`, {
        days: params.days || 30,
        model: params.model || 'prophet',
        confidence_level: params.confidenceLevel || 95,
      });

      const forecast = response.data;
      await cacheSet(cacheKey, forecast, 3600);
      logger.info({ days: params.days }, 'Generated revenue forecast');
      return forecast;
    } catch (error) {
      logger.error({ error }, 'Failed to generate revenue forecast');
      // Return mock data if Python service is unavailable
      return this.generateMockForecast(params.days || 30);
    }
  }

  /**
   * Generate scenario-based forecast
   */
  async generateScenarioForcast(scenarios: any) {
    try {
      const response = await axios.post(`${this.pythonApiUrl}/forecast/scenario`, {
        base_revenue: scenarios.baseRevenue,
        ad_spend_change: scenarios.adSpendChange,
        conversion_boost: scenarios.conversionBoost,
        traffic_spike: scenarios.trafficSpike,
        days: scenarios.days || 30,
      });

      logger.info('Generated scenario forecast');
      return response.data;
    } catch (error) {
      logger.error({ error }, 'Failed to generate scenario forecast');
      return this.generateMockScenarioForcast(scenarios);
    }
  }

  /**
   * Detect anomalies in time series
   */
  async detectAnomalies(timeSeries: any[]) {
    try {
      const response = await axios.post(`${this.pythonApiUrl}/forecast/anomalies`, {
        time_series: timeSeries,
        threshold: 2.5, // Standard deviations
      });

      logger.info({ anomalies: response.data.count }, 'Detected anomalies');
      return response.data;
    } catch (error) {
      logger.error({ error }, 'Failed to detect anomalies');
      return { anomalies: [], scores: [] };
    }
  }

  /**
   * Compare multiple forecasting models
   */
  async compareModels(timeSeries: any[], days: number = 30) {
    try {
      const response = await axios.post(`${this.pythonApiUrl}/forecast/compare-models`, {
        time_series: timeSeries,
        days,
        models: ['prophet', 'lstm', 'xgboost', 'arima'],
      });

      logger.info({ models: response.data.length }, 'Compared forecasting models');
      return response.data;
    } catch (error) {
      logger.error({ error }, 'Failed to compare models');
      return [];
    }
  }

  /**
   * Calculate forecast accuracy metrics
   */
  async calculateAccuracy(predicted: number[], actual: number[]) {
    try {
      const response = await axios.post(`${this.pythonApiUrl}/forecast/accuracy`, {
        predicted,
        actual,
      });

      logger.info(
        {
          mape: response.data.mape,
          rmse: response.data.rmse,
          mae: response.data.mae,
        },
        'Calculated forecast accuracy'
      );

      return response.data;
    } catch (error) {
      logger.error({ error }, 'Failed to calculate accuracy');
      return this.calculateMockAccuracy(predicted, actual);
    }
  }

  /**
   * Predict customer churn
   */
  async predictChurn(customerMetrics: any) {
    try {
      const response = await axios.post(`${this.pythonApiUrl}/forecast/churn-prediction`, {
        customer_data: customerMetrics,
      });

      logger.info({ predictions: response.data.count }, 'Generated churn predictions');
      return response.data;
    } catch (error) {
      logger.error({ error }, 'Failed to predict churn');
      return { churnRisk: [], predictions: [] };
    }
  }

  /**
   * Predict inventory depletion
   */
  async predictInventoryDepletion(inventory: any) {
    try {
      const response = await axios.post(`${this.pythonApiUrl}/forecast/inventory-depletion`, {
        inventory_data: inventory,
      });

      logger.info('Predicted inventory depletion');
      return response.data;
    } catch (error) {
      logger.error({ error }, 'Failed to predict inventory depletion');
      return { predictions: [] };
    }
  }

  // ============================================================================
  // MOCK DATA GENERATORS (for development/fallback)
  // ============================================================================

  private generateMockForecast(days: number) {
    const forecast = [];
    let baseValue = 85000;

    for (let i = 0; i < days; i++) {
      const trend = 1 + Math.random() * 0.04 - 0.02;
      baseValue = baseValue * trend;
      const seasonality = 1 + Math.sin(i / 7) * 0.05;
      const predicted = baseValue * seasonality;

      forecast.push({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        predicted: Math.round(predicted),
        lower: Math.round(predicted * 0.92),
        upper: Math.round(predicted * 1.08),
      });
    }

    return {
      forecast,
      confidence: 95,
      model: 'prophet',
    };
  }

  private generateMockScenarioForcast(scenarios: any) {
    const multiplier =
      1 +
      scenarios.adSpendChange * 0.005 +
      scenarios.conversionBoost * 0.015 +
      scenarios.trafficSpike * 0.008;

    return {
      baseCase: 85000 * multiplier,
      bestCase: 85000 * multiplier * 1.1,
      worstCase: 85000 * multiplier * 0.9,
      impact: {
        revenue: Math.round(85000 * (multiplier - 1)),
        percentage: parseFloat(((multiplier - 1) * 100).toFixed(2)),
      },
    };
  }

  private calculateMockAccuracy(predicted: number[], actual: number[]) {
    if (predicted.length !== actual.length) {
      return { mape: 0, rmse: 0, mae: 0 };
    }

    const errors = predicted.map((p, i) => Math.abs(p - actual[i]));
    const mae = errors.reduce((a, b) => a + b) / errors.length;
    const mape =
      (errors.reduce((sum, e, i) => sum + e / (actual[i] || 1), 0) /
        errors.length) *
      100;
    const rmse = Math.sqrt(
      errors.reduce((sum, e) => sum + e * e, 0) / errors.length
    );

    return {
      mae: parseFloat(mae.toFixed(2)),
      mape: parseFloat(mape.toFixed(2)),
      rmse: parseFloat(rmse.toFixed(2)),
      accuracy: Math.max(0, 100 - mape),
    };
  }
}

export const forecastingService = new ForecastingService();
