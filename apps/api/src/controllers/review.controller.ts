import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware';
import { reviewService } from '../services/review.service';
import type { CreateReviewInput, GetReviewsQuery } from '../validators/review.validator';

/**
 * Submit a review for a completed contract
 * POST /api/reviews
 */
const submitReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const authorId = authReq.userId!;
    const input = req.body as CreateReviewInput;

    const review = await reviewService.submitReview(authorId, input);
    res.status(201).json({ success: true, data: review, message: 'Review submitted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get reviews for a specific user
 * GET /api/reviews/user/:userId
 */
const getUserReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const viewerId = authReq.userId;
    const { userId } = req.params;

    const query: GetReviewsQuery = {
      role: req.query.role as GetReviewsQuery['role'],
      page: parseInt(req.query.page as string, 10) || 1,
      limit: Math.min(parseInt(req.query.limit as string, 10) || 20, 100),
      minRating: req.query.minRating ? parseFloat(req.query.minRating as string) : undefined,
      maxRating: req.query.maxRating ? parseFloat(req.query.maxRating as string) : undefined,
      search: (req.query.search as string) || undefined,
      sort: (req.query.sort as GetReviewsQuery['sort']) || 'createdAt',
      order: (req.query.order as GetReviewsQuery['order']) || 'desc',
    };

    const reviews = await reviewService.getUserReviews(userId, query, viewerId);
    res.json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

/**
 * Get reviews for a specific contract
 * GET /api/reviews/contract/:contractId
 */
const getContractReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const viewerId = authReq.userId;
    const { contractId } = req.params;

    const result = await reviewService.getContractReviews(contractId, viewerId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * Get aggregated review summary for a user
 * GET /api/reviews/user/:userId/summary
 */
const getReviewSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.params;
    const summary = await reviewService.getReviewSummary(userId);
    res.json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
};

/**
 * Check if current user has reviewed a contract
 * GET /api/reviews/contract/:contractId/status
 */
const getReviewStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.userId!;
    const { contractId } = req.params;

    const hasReviewed = await reviewService.hasReviewed(contractId, userId);
    res.json({ success: true, data: { hasReviewed } });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit a response (rebuttal) to a review
 * POST /api/reviews/:reviewId/response
 */
const submitResponse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.userId!;
    const { reviewId } = req.params;
    const { responseText } = req.body;

    const review = await reviewService.submitResponse(reviewId, userId, responseText);
    res.json({ success: true, data: review, message: 'Response submitted successfully' });
  } catch (error) {
    next(error);
  }
};

export const reviewController = {
  submitReview,
  getUserReviews,
  getContractReviews,
  getReviewSummary,
  getReviewStatus,
  submitResponse,
};