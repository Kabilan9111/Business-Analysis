import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { recommendationsService } from '../services/recommendations.service';
import { logger } from '../utils/logger';

/**
 * GET /api/recommendations
 * Get AI-powered business recommendations
 */
export const getRecommendations = asyncHandler(async (req: Request, res: Response) => {
  logger.info('📊 Fetching AI-powered recommendations from PostgreSQL + APIs');
  try {
    const recommendations = await recommendationsService.generateRecommendations();
    logger.info({
      count: recommendations.length,
      timestamp: new Date().toISOString(),
    }, '✅ Successfully generated recommendations');
    res.json({ status: 'success', data: recommendations });
  } catch (error) {
    logger.error({ error }, '❌ Error in getRecommendations');
    throw error;
  }
});

/**
 * GET /api/recommendations/stats
 * Get recommendation summary stats
 */
export const getStats = asyncHandler(async (req: Request, res: Response) => {
  logger.info('📈 Fetching recommendation stats');
  try {
    const stats = await recommendationsService.getRecommendationStats();
    logger.info({ stats }, '✅ Successfully fetched stats');
    res.json({ status: 'success', data: stats });
  } catch (error) {
    logger.error({ error }, '❌ Error in getStats');
    throw error;
  }
});

/**
 * Health check
 */
export const health = asyncHandler(async (req: Request, res: Response) => {
  logger.debug('🏥 Recommendations API health check');
  res.json({ status: 'success', message: 'Recommendations API is healthy', timestamp: new Date().toISOString() });
});
