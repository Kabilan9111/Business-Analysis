import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { redis } from '../config/redis';
import { logger } from '../utils/logger';
import { alertService } from '../analytics/alert.service';
import { salesAnalyticsService } from '../analytics/sales.analytics';

export class RealtimeGateway {
  private io: SocketIOServer;
  private alertCheckInterval: NodeJS.Timeout | null = null;

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5174',
        credentials: true,
      },
    });

    this.setupMiddleware();
    this.setupNamespaces();
    this.setupPubSub();
  }

  private setupMiddleware() {
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication failed'));
      }

      // Validate token here
      socket.data.userId = 'user-id'; // Extract from token
      next();
    });
  }

  private setupNamespaces() {
    // Sales Dashboard namespace
    const salesNamespace = this.io.of('/sales');
    salesNamespace.on('connection', (socket: Socket) => {
      logger.info({ socketId: socket.id }, 'Client connected to sales namespace');

      socket.on('subscribe_metrics', async () => {
        try {
          const metrics = await salesAnalyticsService.getDashboardMetrics(30);
          socket.emit('metrics_update', metrics);
        } catch (error) {
          logger.error({ error }, 'Failed to emit metrics');
        }
      });

      socket.on('disconnect', () => {
        logger.info('Client disconnected from sales namespace');
      });
    });

    // Forecasting namespace
    const forecastNamespace = this.io.of('/forecast');
    forecastNamespace.on('connection', (socket: Socket) => {
      logger.info({ socketId: socket.id }, 'Client connected to forecast namespace');

      socket.on('request_forecast', (data) => {
        // Emit forecast updates
        socket.emit('forecast_update', {
          predicted: data.days || 30,
          confidence: 95,
        });
      });

      socket.on('disconnect', () => {
        logger.info('Client disconnected from forecast namespace');
      });
    });

    // Alerts namespace
    const alertNamespace = this.io.of('/alerts');
    alertNamespace.on('connection', (socket: Socket) => {
      logger.info({ socketId: socket.id }, 'Client connected to alerts namespace');

      socket.on('subscribe_alerts', () => {
        socket.join('alert-subscribers');
      });

      socket.on('disconnect', () => {
        logger.info('Client disconnected from alerts namespace');
      });
    });
  }

  private setupPubSub() {
    // Listen for alerts from other instances/services
    redis.subscribe('alerts', (err, count) => {
      if (err) {
        logger.error({ error: err }, 'Failed to subscribe to alerts channel');
      } else {
        logger.info({ count }, 'Subscribed to Redis channels');
      }
    });

    redis.on('message', (channel, message) => {
      if (channel === 'alerts') {
        const alert = JSON.parse(message);
        this.io.of('/alerts').emit('new_alert', alert);
        logger.debug('Broadcast alert via Socket.io');
      }
    });
  }

  /**
   * Broadcast revenue update
   */
  broadcastRevenueUpdate(data: any) {
    this.io.of('/sales').emit('revenue_update', data);
    logger.debug('Broadcast revenue update');
  }

  /**
   * Broadcast forecast update
   */
  broadcastForecastUpdate(data: any) {
    this.io.of('/forecast').emit('forecast_update', data);
    logger.debug('Broadcast forecast update');
  }

  /**
   * Broadcast critical alert
   */
  async broadcastAlert(alert: any) {
    // Store in Redis for distribution across instances
    await redis.publish('alerts', JSON.stringify(alert));
    this.io.of('/alerts').emit('new_alert', alert);
    logger.info({ type: alert.type }, 'Broadcast alert');
  }

  /**
   * Start periodic alert checks
   */
  startAlertPolling() {
    if (this.alertCheckInterval) return;

    this.alertCheckInterval = setInterval(async () => {
      try {
        const alerts = await alertService.runAllAlerts();

        for (const alert of alerts) {
          if (alert.severity === 'critical' || alert.severity === 'high') {
            await this.broadcastAlert(alert);
          }
        }
      } catch (error) {
        logger.error({ error }, 'Alert polling failed');
      }
    }, 60000); // Check every minute

    logger.info('Started alert polling');
  }

  /**
   * Stop periodic alert checks
   */
  stopAlertPolling() {
    if (this.alertCheckInterval) {
      clearInterval(this.alertCheckInterval);
      this.alertCheckInterval = null;
      logger.info('Stopped alert polling');
    }
  }

  /**
   * Get server instance
   */
  getIO() {
    return this.io;
  }
}

export let realtimeGateway: RealtimeGateway;

export function initRealtimeGateway(httpServer: HTTPServer) {
  realtimeGateway = new RealtimeGateway(httpServer);
  realtimeGateway.startAlertPolling();
  return realtimeGateway;
}
