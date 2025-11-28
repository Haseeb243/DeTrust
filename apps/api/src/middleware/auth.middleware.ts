import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config';
import { prisma } from '../config/database';
import { ApiErrorCode } from '@detrust/types';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        walletAddress?: string;
        email?: string;
      };
    }
  }
}

/**
 * Authenticated request interface for controllers
 */
export interface AuthenticatedRequest extends Request {
  userId?: string;
  userRole?: string;
  userWallet?: string;
  userEmail?: string;
}

export interface TokenPayload {
  userId: string;
  role: string;
  walletAddress?: string;
  email?: string;
  iat: number;
  exp: number;
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: {
          code: ApiErrorCode.UNAUTHORIZED,
          message: 'No token provided',
        },
      });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload;
    
    // Check if user exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        role: true,
        walletAddress: true,
        email: true,
        status: true,
      },
    });
    
    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          code: ApiErrorCode.UNAUTHORIZED,
          message: 'User not found',
        },
      });
      return;
    }
    
    if (user.status !== 'ACTIVE') {
      res.status(403).json({
        success: false,
        error: {
          code: ApiErrorCode.FORBIDDEN,
          message: 'Account is suspended or deactivated',
        },
      });
      return;
    }
    
    // Attach user to request
    req.user = {
      id: user.id,
      role: user.role,
      walletAddress: user.walletAddress || undefined,
      email: user.email || undefined,
    };
    
    // Also set direct properties for convenience
    (req as AuthenticatedRequest).userId = user.id;
    (req as AuthenticatedRequest).userRole = user.role;
    (req as AuthenticatedRequest).userWallet = user.walletAddress || undefined;
    (req as AuthenticatedRequest).userEmail = user.email || undefined;
    
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: {
          code: ApiErrorCode.TOKEN_EXPIRED,
          message: 'Token has expired',
        },
      });
      return;
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: {
          code: ApiErrorCode.INVALID_TOKEN,
          message: 'Invalid token',
        },
      });
      return;
    }
    
    next(error);
  }
};

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't require it
 */
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        role: true,
        walletAddress: true,
        email: true,
        status: true,
      },
    });
    
    if (user && user.status === 'ACTIVE') {
      req.user = {
        id: user.id,
        role: user.role,
        walletAddress: user.walletAddress || undefined,
        email: user.email || undefined,
      };

      (req as AuthenticatedRequest).userId = user.id;
      (req as AuthenticatedRequest).userRole = user.role;
      (req as AuthenticatedRequest).userWallet = user.walletAddress || undefined;
      (req as AuthenticatedRequest).userEmail = user.email || undefined;
    }
    
    next();
  } catch {
    // Silently continue without user
    next();
  }
};

export default authenticate;
