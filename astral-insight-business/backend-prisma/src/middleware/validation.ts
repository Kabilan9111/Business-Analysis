import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { logger } from '../utils/logger';

export function validateRequest(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    logger.warn({ errors: errors.array() }, 'Validation error');
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array().map(e => ({
        field: e.type === 'field' ? (e as any).path : 'body',
        message: e.msg,
      })),
    });
  }
  
  next();
}
