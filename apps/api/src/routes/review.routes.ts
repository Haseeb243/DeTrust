import { Router } from 'express';
import { reviewController } from '../controllers/review.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All review routes require authentication
router.use(authenticate);

/**
 * Create a review for a completed contract
 * POST /api/reviews
 * Body: CreateReviewInput
 */
router.post('/', reviewController.create.bind(reviewController));

/**
 * Update review with IPFS and blockchain transaction hashes
 * PUT /api/reviews/:id/hashes
 * Body: { ipfsHash: string, blockchainTxHash: string }
 */
router.put('/:id/hashes', reviewController.updateHashes.bind(reviewController));

/**
 * Get reviews for a specific user
 * GET /api/reviews/user/:userId
 * Query: page, limit
 */
router.get('/user/:userId', reviewController.getUserReviews.bind(reviewController));

/**
 * Get review summary statistics for a user
 * GET /api/reviews/user/:userId/summary
 */
router.get('/user/:userId/summary', reviewController.getUserReviewSummary.bind(reviewController));

/**
 * Get reviews for a specific contract
 * GET /api/reviews/contract/:contractId
 */
router.get('/contract/:contractId', reviewController.getContractReviews.bind(reviewController));

export default router;
