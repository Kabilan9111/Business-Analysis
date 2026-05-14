import OpenAI from 'openai';
import { logger } from '../utils/logger';

export class AICopilotService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Generate forecast explanation
   */
  async explainForecast(forecastData: any, businessContext: string): Promise<string> {
    try {
      const prompt = `
        You are an expert business intelligence analyst. Analyze the following forecast data and business context, 
        then provide a concise, professional explanation of the forecast trends.

        Business Context: ${businessContext}
        
        Forecast Data:
        - Predicted Revenue: $${forecastData.predictedRevenue}
        - Confidence Level: ${forecastData.confidenceScore}%
        - Trend Direction: ${forecastData.trendDirection}
        - Lower Bound: $${forecastData.lowerBound}
        - Upper Bound: $${forecastData.upperBound}
        
        Provide a 2-3 sentence business-focused explanation of this forecast.
      `;

      const message = await this.openai.messages.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = message.content[0];
      if (content.type === 'text') {
        logger.debug('Generated forecast explanation via AI');
        return content.text;
      }

      return 'Unable to generate explanation';
    } catch (error) {
      logger.error({ error }, 'Failed to generate forecast explanation');
      throw error;
    }
  }

  /**
   * Analyze scenario simulation
   */
  async analyzeScenario(scenarioData: any): Promise<string> {
    try {
      const prompt = `
        You are a strategic business advisor. Analyze the following business scenario simulation and provide actionable insights.

        Scenario Parameters:
        - Ad Spend Change: ${scenarioData.adSpend}%
        - Conversion Rate Optimization: ${scenarioData.conversionBoost}%
        - Traffic Increase: ${scenarioData.trafficSpike}%
        
        Predicted Impact:
        - Revenue Change: $${scenarioData.revenueImpact}
        - Profit Impact: +${scenarioData.profitImpact}%
        - Customer Growth: ${scenarioData.customerGrowth}%
        
        Provide 2-3 strategic recommendations based on this scenario.
      `;

      const message = await this.openai.messages.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        max_tokens: 400,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = message.content[0];
      if (content.type === 'text') {
        logger.debug('Generated scenario analysis via AI');
        return content.text;
      }

      return 'Unable to analyze scenario';
    } catch (error) {
      logger.error({ error }, 'Failed to analyze scenario');
      throw error;
    }
  }

  /**
   * Answer natural language forecasting questions
   */
  async answerForecastQuestion(question: string, context: any): Promise<string> {
    try {
      const systemPrompt = `
        You are an expert AI business analyst specializing in forecasting, sales intelligence, and predictive analytics.
        You have access to real-time business data and can provide actionable insights.
        
        Current Business Context:
        - Total Revenue (30d): $${context.totalRevenue}
        - Total Orders: ${context.totalOrders}
        - Average Order Value: $${context.avgOrderValue}
        - Churn Risk: ${context.churnRisk}%
        - Top Product: ${context.topProduct}
        - Primary Market: ${context.primaryRegion}
        
        Provide concise, data-driven responses that focus on actionable business insights.
      `;

      const message = await this.openai.messages.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        max_tokens: 500,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: question,
          },
        ],
      });

      const content = message.content[0];
      if (content.type === 'text') {
        logger.debug('Answered forecast question via AI');
        return content.text;
      }

      return 'Unable to answer question';
    } catch (error) {
      logger.error({ error }, 'Failed to answer question');
      throw error;
    }
  }

  /**
   * Generate AI recommendations
   */
  async generateRecommendations(businessMetrics: any): Promise<any[]> {
    try {
      const prompt = `
        Based on the following business metrics, generate 3-4 specific, actionable AI-powered recommendations.
        
        Metrics:
        ${JSON.stringify(businessMetrics, null, 2)}
        
        For each recommendation, provide:
        1. Title (concise action item)
        2. Description (detailed reasoning)
        3. Expected Impact (quantified benefit)
        4. Priority (high/medium/low)
        
        Format as JSON array.
      `;

      const message = await this.openai.messages.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        max_tokens: 800,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = message.content[0];
      if (content.type === 'text') {
        try {
          const recommendations = JSON.parse(content.text);
          logger.debug({ count: recommendations.length }, 'Generated AI recommendations');
          return recommendations;
        } catch {
          logger.warn('Failed to parse AI recommendations as JSON');
          return [];
        }
      }

      return [];
    } catch (error) {
      logger.error({ error }, 'Failed to generate recommendations');
      throw error;
    }
  }

  /**
   * Generate streaming response for real-time chat
   */
  async *streamCopilotResponse(question: string, context: any) {
    try {
      const systemPrompt = `
        You are AstralInsight's Forecasting Copilot - an advanced AI business analyst.
        Provide concise, data-driven insights focused on predictive intelligence and business outcomes.
      `;

      const stream = await this.openai.messages.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        max_tokens: 1000,
        stream: true,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: question,
          },
        ],
      });

      for await (const event of stream) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          yield event.delta.text;
        }
      }
    } catch (error) {
      logger.error({ error }, 'Failed to stream copilot response');
      throw error;
    }
  }
}

export const aiCopilotService = new AICopilotService();
