import { prisma } from '@detrust/database';
import { Decimal } from '@prisma/client/runtime/library';
import { CreateReviewInput } from '../validators/review.validator';
import { AppError } from '../utils/errors';
import { createHash } from 'crypto';

export class ReviewService {
  /**
   * Create a review for a completed contract
   * Implements double-blind review mechanism:
   * - Neither party sees the other's review until both submit OR 14 days pass
   */
  async createReview(
    contractId: string,
    authorId: string,
    data: CreateReviewInput
  ) {
    // 1. Verify contract exists and author is a participant
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        client: { select: { id: true, walletAddress: true } },
        freelancer: { select: { id: true, walletAddress: true } },
        reviews: { select: { authorId: true } },
      },
    });

    if (!contract) {
      throw new AppError('Contract not found', 404);
    }

    // 2. Verify author is either client or freelancer
    if (contract.clientId !== authorId && contract.freelancerId !== authorId) {
      throw new AppError('You are not authorized to review this contract', 403);
    }

    // 3. Verify contract is completed
    if (contract.status !== 'COMPLETED') {
      throw new AppError('Contract must be completed before submitting a review', 400);
    }

    // 4. Check if author already submitted a review
    const existingReview = contract.reviews.find((r) => r.authorId === authorId);
    if (existingReview) {
      throw new AppError('You have already submitted a review for this contract', 400);
    }

    // 5. Determine subject (the other party)
    const subjectId = authorId === contract.clientId
      ? contract.freelancerId
      : contract.clientId;

    // 6. Create review content hash for IPFS (will be uploaded by frontend)
    const reviewContent = {
      contractId,
      authorId,
      subjectId,
      ratings: {
        overall: data.overallRating,
        communication: data.communicationRating,
        quality: data.qualityRating,
        timeliness: data.timelinessRating,
        professionalism: data.professionalismRating,
      },
      comment: data.comment,
      timestamp: new Date().toISOString(),
    };

    const contentHash = createHash('sha256')
      .update(JSON.stringify(reviewContent))
      .digest('hex');

    // 7. Create the review
    const review = await prisma.review.create({
      data: {
        contractId,
        authorId,
        subjectId,
        overallRating: new Decimal(data.overallRating),
        communicationRating: data.communicationRating
          ? new Decimal(data.communicationRating)
          : null,
        qualityRating: data.qualityRating
          ? new Decimal(data.qualityRating)
          : null,
        timelinessRating: data.timelinessRating
          ? new Decimal(data.timelinessRating)
          : null,
        professionalismRating: data.professionalismRating
          ? new Decimal(data.professionalismRating)
          : null,
        comment: data.comment || null,
        // IPFS hash and blockchain tx hash will be updated by frontend after upload
        ipfsHash: null,
        blockchainTxHash: null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    // 8. Check if both parties have submitted reviews
    const allReviews = await prisma.review.findMany({
      where: { contractId },
    });

    const bothSubmitted = allReviews.length === 2;

    // 9. Recalculate trust scores for subject after review
    await this.recalculateTrustScore(subjectId);

    return {
      review,
      bothSubmitted,
      contentHash, // Return for frontend to upload to IPFS
    };
  }

  /**
   * Update review with IPFS hash and blockchain transaction hash
   * Called by frontend after successful IPFS upload and smart contract call
   */
  async updateReviewHashes(
    reviewId: string,
    userId: string,
    ipfsHash: string,
    blockchainTxHash: string
  ) {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    if (review.authorId !== userId) {
      throw new AppError('You are not authorized to update this review', 403);
    }

    return prisma.review.update({
      where: { id: reviewId },
      data: {
        ipfsHash,
        blockchainTxHash,
      },
    });
  }

  /**
   * Get reviews for a user (public view)
   * Double-blind logic: Only show reviews if:
   * - Both parties have submitted reviews OR
   * - 14 days have passed since contract completion
   */
  async getUserReviews(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    // Get all reviews where user is the subject
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { subjectId: userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          contract: {
            select: {
              id: true,
              title: true,
              completedAt: true,
              reviews: {
                select: {
                  authorId: true,
                  createdAt: true,
                },
              },
            },
          },
        },
      }),
      prisma.review.count({
        where: { subjectId: userId },
      }),
    ]);

    // Filter based on double-blind rules
    const now = new Date();
    const fourteenDaysInMs = 14 * 24 * 60 * 60 * 1000;

    const visibleReviews = reviews.filter((review) => {
      const { contract } = review;

      // Check if both parties submitted reviews
      const bothSubmitted = contract.reviews.length === 2;
      if (bothSubmitted) return true;

      // Check if 14 days have passed since completion
      if (contract.completedAt) {
        const daysSinceCompletion = now.getTime() - contract.completedAt.getTime();
        if (daysSinceCompletion >= fourteenDaysInMs) return true;
      }

      return false;
    });

    return {
      reviews: visibleReviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get reviews for a specific contract
   * Same double-blind logic applies
   */
  async getContractReviews(contractId: string, requesterId: string) {
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      select: {
        id: true,
        clientId: true,
        freelancerId: true,
        completedAt: true,
      },
    });

    if (!contract) {
      throw new AppError('Contract not found', 404);
    }

    const reviews = await prisma.review.findMany({
      where: { contractId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Check double-blind visibility
    const bothSubmitted = reviews.length === 2;
    const now = new Date();
    const fourteenDaysInMs = 14 * 24 * 60 * 60 * 1000;
    let visible = bothSubmitted;

    if (!visible && contract.completedAt) {
      const daysSinceCompletion = now.getTime() - contract.completedAt.getTime();
      visible = daysSinceCompletion >= fourteenDaysInMs;
    }

    // If requester is a participant, show their own review
    const isParticipant =
      contract.clientId === requesterId ||
      contract.freelancerId === requesterId;

    if (isParticipant && !visible) {
      // Only show requester's own review
      return reviews.filter((r) => r.authorId === requesterId);
    }

    // If visible to all, return all reviews
    return visible ? reviews : [];
  }

  /**
   * Get review summary statistics for a user
   */
  async getUserReviewSummary(userId: string) {
    const reviews = await prisma.review.findMany({
      where: { subjectId: userId },
      select: { overallRating: true },
    });

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    // Calculate average
    const sum = reviews.reduce(
      (acc, r) => acc + parseFloat(r.overallRating.toString()),
      0
    );
    const averageRating = sum / reviews.length;

    // Calculate distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      const rating = Math.round(parseFloat(r.overallRating.toString()));
      distribution[rating as 1 | 2 | 3 | 4 | 5]++;
    });

    return {
      averageRating: Math.round(averageRating * 100) / 100,
      totalReviews: reviews.length,
      ratingDistribution: distribution,
    };
  }

  /**
   * Recalculate trust score for a user after receiving a new review
   * This updates both FreelancerProfile and ClientProfile trust scores
   */
  private async recalculateTrustScore(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        freelancerProfile: { select: { id: true } },
        clientProfile: { select: { id: true } },
      },
    });

    if (!user) return;

    // Get all reviews for this user
    const reviews = await prisma.review.findMany({
      where: { subjectId: userId },
      select: {
        overallRating: true,
        communicationRating: true,
        qualityRating: true,
        timelinessRating: true,
        professionalismRating: true,
      },
    });

    if (reviews.length === 0) return;

    // Calculate average rating (0-100 scale)
    const avgRating = reviews.reduce(
      (sum, r) => sum + parseFloat(r.overallRating.toString()),
      0
    ) / reviews.length;
    const ratingScore = (avgRating / 5) * 100;

    // Get completed contracts
    const completedContracts = await prisma.contract.count({
      where: {
        OR: [
          { clientId: userId },
          { freelancerId: userId },
        ],
        status: 'COMPLETED',
      },
    });

    // Get total contracts
    const totalContracts = await prisma.contract.count({
      where: {
        OR: [
          { clientId: userId },
          { freelancerId: userId },
        ],
      },
    });

    const completionRate = totalContracts > 0
      ? (completedContracts / totalContracts) * 100
      : 0;

    // Get dispute data
    const disputes = await prisma.dispute.findMany({
      where: {
        OR: [
          { clientId: userId },
          { freelancerId: userId },
        ],
      },
      select: { outcome: true, clientId: true },
    });

    const disputeWins = disputes.filter(
      (d) =>
        (d.outcome === 'CLIENT_WINS' && d.clientId === userId) ||
        (d.outcome === 'FREELANCER_WINS' && d.clientId !== userId)
    ).length;

    const disputeWinRate = disputes.length > 0
      ? (disputeWins / disputes.length) * 100
      : 50; // Neutral if no disputes

    // Calculate experience score (contracts completed)
    const experienceScore = Math.min((completedContracts / 10) * 100, 100);

    // Calculate trust score based on formula from SRS
    // TrustScore = (0.4 × AvgRating) + (0.3 × CompletionRate) + (0.2 × DisputeWinRate) + (0.1 × Experience)
    const trustScore =
      (0.4 * ratingScore) +
      (0.3 * completionRate) +
      (0.2 * disputeWinRate) +
      (0.1 * experienceScore);

    const finalScore = Math.round(Math.min(trustScore, 100) * 10) / 10;

    // Update the appropriate profile
    if (user.role === 'FREELANCER' && user.freelancerProfile) {
      await prisma.freelancerProfile.update({
        where: { userId },
        data: { trustScore: new Decimal(finalScore) },
      });
    } else if (user.role === 'CLIENT' && user.clientProfile) {
      await prisma.clientProfile.update({
        where: { userId },
        data: { trustScore: new Decimal(finalScore) },
      });
    }

    return finalScore;
  }
}

export const reviewService = new ReviewService();
