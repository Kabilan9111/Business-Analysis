import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { forecastingService } from '../ai/forecasting.service';
import { aiCopilotService } from '../ai/copilot.service';
import { logger } from '../utils/logger';

/**
 * Generate revenue forecast
 */
export const generateRevenueForcast = asyncHandler(
  async (req: Request, res: Response) => {
    const { days = 30, model = 'prophet', confidenceLevel = 95 } = req.body;

    const forecast = await forecastingService.generateRevenueForcast({
      days,
      model,
      confidenceLevel,
    });

    res.json({
      status: 'success',
      data: forecast,
    });
  }
);

/**
 * Generate scenario forecast
 */
export const generateScenarioForcast = asyncHandler(
  async (req: Request, res: Response) => {
    const scenarios = req.body;
    const forecast = await forecastingService.generateScenarioForcast(scenarios);

    res.json({
      status: 'success',
      data: forecast,
    });
  }
);

/**
 * Detect anomalies
 */
export const detectAnomalies = asyncHandler(async (req: Request, res: Response) => {
  const { timeSeries } = req.body;
  const anomalies = await forecastingService.detectAnomalies(timeSeries);

  res.json({
    status: 'success',
    data: anomalies,
  });
});

/**
 * Compare forecasting models
 */
export const compareModels = asyncHandler(async (req: Request, res: Response) => {
  const { timeSeries, days = 30 } = req.body;
  const comparison = await forecastingService.compareModels(timeSeries, days);

  res.json({
    status: 'success',
    data: comparison,
  });
});

/**
 * Calculate forecast accuracy
 */
export const calculateAccuracy = asyncHandler(async (req: Request, res: Response) => {
  const { predicted, actual } = req.body;
  const accuracy = await forecastingService.calculateAccuracy(predicted, actual);

  res.json({
    status: 'success',
    data: accuracy,
  });
});

/**
 * AI Copilot chat endpoint
 */
export const copilotChat = asyncHandler(async (req: Request, res: Response) => {
  const { question, context } = req.body;

  try {
    const response = await aiCopilotService.answerForecastQuestion(question, context);

    res.json({
      status: 'success',
      data: {
        response,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error({ error }, 'Copilot chat failed');
    res.status(500).json({
      status: 'error',
      message: 'Failed to process copilot request',
    });
  }
});

/**
 * Explain forecast
 */
export const explainForcast = asyncHandler(async (req: Request, res: Response) => {
  const { forecastData, businessContext } = req.body;

  const explanation = await aiCopilotService.explainForecast(
    forecastData,
    businessContext
  );

  res.json({
    status: 'success',
    data: { explanation },
  });
});

/**
 * Generate recommendations
 */
export const generateRecommendations = asyncHandler(
  async (req: Request, res: Response) => {
    const businessMetrics = req.body;
    const recommendations = await aiCopilotService.generateRecommendations(
      businessMetrics
    );

    res.json({
      status: 'success',
      data: recommendations,
    });
  }
);

/**
 * Health check
 */
export const health = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'Forecast API is healthy',
    timestamp: new Date().toISOString(),
  });
});
