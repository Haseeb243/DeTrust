import { apiClient } from './client';
import type { Review, CreateReviewInput, ReviewSummary } from '@detrust/types';

export const reviewApi = {
  /**
   * Create a review for a completed contract
   */
  create: async (data: CreateReviewInput): Promise<{
    review: Review;
    bothSubmitted: boolean;
    contentHash: string;
  }> => {
    const response = await apiClient.post<{
      data: Review;
      meta: { bothSubmitted: boolean; contentHash: string };
    }>('/reviews', data);
    return {
      review: response.data.data,
      bothSubmitted: response.data.meta.bothSubmitted,
      contentHash: response.data.meta.contentHash,
    };
  },

  /**
   * Update review with IPFS and blockchain hashes after upload
   */
  updateHashes: async (
    reviewId: string,
    ipfsHash: string,
    blockchainTxHash: string
  ): Promise<Review> => {
    const response = await apiClient.put<{ data: Review }>(
      `/reviews/${reviewId}/hashes`,
      { ipfsHash, blockchainTxHash }
    );
    return response.data.data;
  },

  /**
   * Get reviews for a specific user
   */
  getUserReviews: async (
    userId: string,
    page = 1,
    limit = 10
  ): Promise<{
    reviews: Review[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    const response = await apiClient.get<{
      data: Review[];
      meta: { total: number; page: number; limit: number; totalPages: number };
    }>(`/reviews/user/${userId}`, {
      params: { page, limit },
    });
    return {
      reviews: response.data.data,
      ...response.data.meta,
    };
  },

  /**
   * Get review summary statistics for a user
   */
  getUserReviewSummary: async (userId: string): Promise<ReviewSummary> => {
    const response = await apiClient.get<{ data: ReviewSummary }>(
      `/reviews/user/${userId}/summary`
    );
    return response.data.data;
  },

  /**
   * Get reviews for a specific contract
   */
  getContractReviews: async (contractId: string): Promise<Review[]> => {
    const response = await apiClient.get<{ data: Review[] }>(
      `/reviews/contract/${contractId}`
    );
    return response.data.data;
  },
};
