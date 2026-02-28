import { Request, Response, NextFunction } from 'express';
import { reviewService } from '../services/review.service';
import { createReviewSchema, listReviewsSchema } from '../validators/review.validator';
import { z } from 'zod';

export class ReviewController {
  /**
   * Create a review for a completed contract
   * POST /api/reviews
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = createReviewSchema.parse(req.body);

      const result = await reviewService.createReview(
        data.contractId,
        userId,
        data
      );

      res.status(201).json({
        success: true,
        data: result.review,
        meta: {
          bothSubmitted: result.bothSubmitted,
          contentHash: result.contentHash,
        },
        message: 'Review submitted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update review with IPFS and blockchain hashes
   * PUT /api/reviews/:id/hashes
   */
  async updateHashes(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const schema = z.object({
        ipfsHash: z.string().min(1, 'IPFS hash is required'),
        blockchainTxHash: z.string().min(1, 'Blockchain transaction hash is required'),
      });

      const data = schema.parse(req.body);

      const review = await reviewService.updateReviewHashes(
        id,
        userId,
        data.ipfsHash,
        data.blockchainTxHash
      );

      res.json({
        success: true,
        data: review,
        message: 'Review hashes updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get reviews for a user
   * GET /api/reviews/user/:userId
   */
  async getUserReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const query = listReviewsSchema.parse(req.query);

      const result = await reviewService.getUserReviews(
        userId,
        query.page,
        query.limit
      );

      res.json({
        success: true,
        data: result.reviews,
        meta: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get reviews for a specific contract
   * GET /api/reviews/contract/:contractId
   */
  async getContractReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { contractId } = req.params;

      const reviews = await reviewService.getContractReviews(contractId, userId);

      res.json({
        success: true,
        data: reviews,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get review summary for a user
   * GET /api/reviews/user/:userId/summary
   */
  async getUserReviewSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      const summary = await reviewService.getUserReviewSummary(userId);

      res.json({
        success: true,
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const reviewController = new ReviewController();
