import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'No authorization token provided',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret') as any;
    req.user = decoded;
    next();
  } catch (error) {
    logger.error({ error }, 'Auth middleware error');
    res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token',
    });
  }
}

export function roleBasedAuth(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Insufficient permissions',
      });
    }
    next();
  };
}

export function generateToken(payload: any, expiresIn = '7d'): string {
  return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret', { expiresIn });
}
