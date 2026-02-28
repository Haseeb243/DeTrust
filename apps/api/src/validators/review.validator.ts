import { z } from 'zod';
import { safeText } from '../utils/sanitize';

/**
 * Validator for creating a review
 * Supports both client and freelancer reviews with different rating categories
 */
export const createReviewSchema = z.object({
  contractId: z.string().cuid('Invalid contract ID'),

  // Overall rating (required for all reviews)
  overallRating: z.number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5')
    .refine((val) => Number.isInteger(val * 2), 'Rating must be in 0.5 increments'),

  // Specific ratings (optional)
  communicationRating: z.number()
    .min(1)
    .max(5)
    .refine((val) => Number.isInteger(val * 2), 'Rating must be in 0.5 increments')
    .optional(),

  qualityRating: z.number()
    .min(1)
    .max(5)
    .refine((val) => Number.isInteger(val * 2), 'Rating must be in 0.5 increments')
    .optional(),

  timelinessRating: z.number()
    .min(1)
    .max(5)
    .refine((val) => Number.isInteger(val * 2), 'Rating must be in 0.5 increments')
    .optional(),

  professionalismRating: z.number()
    .min(1)
    .max(5)
    .refine((val) => Number.isInteger(val * 2), 'Rating must be in 0.5 increments')
    .optional(),

  // Comment (optional, sanitized for XSS)
  comment: z.string()
    .min(10, 'Comment must be at least 10 characters')
    .max(5000, 'Comment must be less than 5000 characters')
    .transform(safeText)
    .optional(),
});

/**
 * Query parameters for listing reviews
 */
export const listReviewsSchema = z.object({
  userId: z.string().cuid('Invalid user ID').optional(),
  contractId: z.string().cuid('Invalid contract ID').optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default('10'),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type ListReviewsQuery = z.infer<typeof listReviewsSchema>;
