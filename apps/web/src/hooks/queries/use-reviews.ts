import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewApi } from '@/lib/api/review';
import type { CreateReviewInput } from '@detrust/types';
import { toast } from 'sonner';

/**
 * Get reviews for a user (with pagination)
 */
export function useUserReviews(userId: string | undefined, page = 1, limit = 10) {
  return useQuery({
    queryKey: ['reviews', 'user', userId, { page, limit }],
    queryFn: () => reviewApi.getUserReviews(userId!, page, limit),
    enabled: !!userId,
  });
}

/**
 * Get review summary for a user
 */
export function useUserReviewSummary(userId: string | undefined) {
  return useQuery({
    queryKey: ['reviews', 'user', userId, 'summary'],
    queryFn: () => reviewApi.getUserReviewSummary(userId!),
    enabled: !!userId,
  });
}

/**
 * Get reviews for a contract
 */
export function useContractReviews(contractId: string | undefined) {
  return useQuery({
    queryKey: ['reviews', 'contract', contractId],
    queryFn: () => reviewApi.getContractReviews(contractId!),
    enabled: !!contractId,
  });
}

/**
 * Create a review (Step 1: Create in database)
 */
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewInput) => reviewApi.create(data),
    onSuccess: (result, variables) => {
      toast.success('Review submitted successfully');

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['reviews', 'contract', variables.contractId] });
      // We don't know the subject ID yet, but we can invalidate after hash update
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    },
  });
}

/**
 * Update review with IPFS and blockchain hashes (Step 2: After blockchain confirmation)
 */
export function useUpdateReviewHashes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      ipfsHash,
      blockchainTxHash,
    }: {
      reviewId: string;
      ipfsHash: string;
      blockchainTxHash: string;
    }) => reviewApi.updateHashes(reviewId, ipfsHash, blockchainTxHash),
    onSuccess: (review) => {
      toast.success('Review recorded on blockchain');

      // Invalidate all reviews for the subject
      queryClient.invalidateQueries({ queryKey: ['reviews', 'user', review.subjectId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'contract', review.contractId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update review hashes');
    },
  });
}
