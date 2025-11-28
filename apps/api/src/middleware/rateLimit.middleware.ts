import rateLimit from 'express-rate-limit';

import { config } from '../config';
import { ApiErrorCode } from '@detrust/types';

/**
 * Default rate limiter
 */
export const defaultLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs, // 15 minutes
  max: config.rateLimit.max, // 100 requests per window
  message: {
    success: false,
    error: {
      code: ApiErrorCode.RATE_LIMITED,
      message: 'Too many requests, please try again later',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict rate limiter for auth endpoints
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: {
    success: false,
    error: {
      code: ApiErrorCode.RATE_LIMITED,
      message: 'Too many login attempts, please try again in 15 minutes',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Very strict limiter for sensitive operations
 */
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 attempts per hour
  message: {
    success: false,
    error: {
      code: ApiErrorCode.RATE_LIMITED,
      message: 'Rate limit exceeded for this operation',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default defaultLimiter;
