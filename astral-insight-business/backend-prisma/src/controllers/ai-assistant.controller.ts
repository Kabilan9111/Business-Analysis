import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { AIAssistantService } from '../services/ai-assistant.service';

export const generateAIResponse = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req.body;

  if (!query || !query.trim()) {
    return res.status(400).json({
      status: 'error',
      message: 'Query is required'
    });
  }

  const response = await AIAssistantService.generateAIResponse(query);

  return res.json({
    status: 'success',
    data: {
      query,
      response,
      timestamp: new Date().toISOString()
    }
  });
});

export const getRevenueAnalysis = asyncHandler(async (req: Request, res: Response) => {
  const { days = 30 } = req.query;
  const metrics = await AIAssistantService.analyzeRevenueMetrics(Number(days));

  return res.json({
    status: 'success',
    data: metrics
  });
});

export const getChurnAnalysis = asyncHandler(async (req: Request, res: Response) => {
  const analysis = await AIAssistantService.analyzeChurnRisk();

  return res.json({
    status: 'success',
    data: analysis
  });
});

export const getMRRForecast = asyncHandler(async (req: Request, res: Response) => {
  const forecast = await AIAssistantService.forecastMRR();

  return res.json({
    status: 'success',
    data: forecast
  });
});

export const getTrafficAnalysis = asyncHandler(async (req: Request, res: Response) => {
  const { days = 30 } = req.query;
  const metrics = await AIAssistantService.analyzeTrafficMetrics(Number(days));

  return res.json({
    status: 'success',
    data: metrics
  });
});

export const getConversionAnalysis = asyncHandler(async (req: Request, res: Response) => {
  const analysis = await AIAssistantService.analyzeConversionFunnel();

  return res.json({
    status: 'success',
    data: analysis
  });
});

export const getSubscriptionMetrics = asyncHandler(async (req: Request, res: Response) => {
  const metrics = await AIAssistantService.analyzeSubscriptionMetrics();

  return res.json({
    status: 'success',
    data: metrics
  });
});

export const getBusinessInsights = asyncHandler(async (req: Request, res: Response) => {
  const [revenue, churn, forecast, traffic, conversion, subscription] = await Promise.all([
    AIAssistantService.analyzeRevenueMetrics(),
    AIAssistantService.analyzeChurnRisk(),
    AIAssistantService.forecastMRR(),
    AIAssistantService.analyzeTrafficMetrics(),
    AIAssistantService.analyzeConversionFunnel(),
    AIAssistantService.analyzeSubscriptionMetrics()
  ]);

  return res.json({
    status: 'success',
    data: {
      revenue,
      churn,
      forecast,
      traffic,
      conversion,
      subscription
    }
  });
});
