'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'z

od';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCreateReview, useUpdateReviewHashes } from '@/hooks/queries/use-reviews';
import { useReputationRegistry } from '@/hooks/use-reputation-registry';
import type { Address } from 'viem';

const reviewSchema = z.object({
  overallRating: z.number().min(1).max(5),
  communicationRating: z.number().min(1).max(5).optional(),
  qualityRating: z.number().min(1).max(5).optional(),
  timelinessRating: z.number().min(1).max(5).optional(),
  professionalismRating: z.number().min(1).max(5).optional(),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(5000).optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  contractId: string;
  reviewedUserWalletAddress: Address;
  isFreelancer?: boolean; // If true, show "Job Clarity" rating category
  onSuccess?: () => void;
}

export function ReviewForm({
  contractId,
  reviewedUserWalletAddress,
  isFreelancer = false,
  onSuccess,
}: ReviewFormProps) {
  const [hoveredRating, setHoveredRating] = useState<Record<string, number>>({});
  const createReview = useCreateReview();
  const updateHashes = useUpdateReviewHashes();
  const { recordFeedback, isSubmitting: isBlockchainSubmitting } = useReputationRegistry();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      overallRating: 0,
      communicationRating: 0,
      qualityRating: 0,
      timelinessRating: 0,
      professionalismRating: 0,
      comment: '',
    },
  });

  const ratings = watch();
  const isSubmitting = createReview.isPending || updateHashes.isPending || isBlockchainSubmitting;

  const onSubmit = async (data: ReviewFormData) => {
    try {
      // Step 1: Create review in database
      const result = await createReview.mutateAsync({
        contractId,
        ...data,
      });

      // Step 2: Record on blockchain
      const blockchainResult = await recordFeedback({
        contractId,
        reviewedWalletAddress: reviewedUserWalletAddress,
        contentHash: result.contentHash,
        overallRating: data.overallRating,
      });

      if (blockchainResult) {
        // Step 3: Update review with blockchain hashes
        await updateHashes.mutateAsync({
          reviewId: result.review.id,
          ipfsHash: result.contentHash, // In production, this would be the IPFS CID
          blockchainTxHash: blockchainResult.txHash,
        });

        onSuccess?.();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const renderStarRating = (fieldName: keyof ReviewFormData, label: string) => {
    const currentRating = ratings[fieldName] as number || 0;
    const hovered = hoveredRating[fieldName] || 0;

    return (
      <div className="space-y-2">
        <Label className="text-dt-text">{label}</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= (hovered || currentRating);
            return (
              <button
                key={star}
                type="button"
                onClick={() => setValue(fieldName, star)}
                onMouseEnter={() => setHoveredRating((prev) => ({ ...prev, [fieldName]: star }))}
                onMouseLeave={() => setHoveredRating((prev) => ({ ...prev, [fieldName]: 0 }))}
                className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded"
                aria-label={`Rate ${star} out of 5 stars`}
              >
                <Star
                  className={`h-8 w-8 ${
                    isFilled
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-slate-300 dark:text-slate-600'
                  }`}
                />
              </button>
            );
          })}
        </div>
        {errors[fieldName] && (
          <p className="text-sm text-red-500">{errors[fieldName]?.message}</p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Overall Rating (Required) */}
      {renderStarRating('overallRating', 'Overall Rating *')}

      {/* Specific Ratings (Optional) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderStarRating('communicationRating', 'Communication')}
        {isFreelancer ? (
          <div className="space-y-2">
            <Label className="text-dt-text">
              Job Clarity
              <span className="text-sm text-dt-text-muted ml-2">(How clear were the job requirements?)</span>
            </Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= (hoveredRating.qualityRating || (ratings.qualityRating as number) || 0);
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setValue('qualityRating', star)}
                    onMouseEnter={() => setHoveredRating((prev) => ({ ...prev, qualityRating: star }))}
                    onMouseLeave={() => setHoveredRating((prev) => ({ ...prev, qualityRating: 0 }))}
                    className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded"
                    aria-label={`Rate ${star} out of 5 stars`}
                  >
                    <Star
                      className={`h-8 w-8 ${
                        isFilled
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          renderStarRating('qualityRating', 'Quality of Work')
        )}
        {!isFreelancer && renderStarRating('timelinessRating', 'Timeliness')}
        {renderStarRating('professionalismRating', 'Professionalism')}
      </div>

      {/* Comment */}
      <div className="space-y-2">
        <Label htmlFor="comment" className="text-dt-text">
          Comment (Optional)
        </Label>
        <Textarea
          id="comment"
          {...register('comment')}
          placeholder="Share your experience working on this project..."
          className="min-h-[120px] bg-dt-input-bg border-dt-border text-dt-text"
          aria-invalid={!!errors.comment}
        />
        {errors.comment && (
          <p className="text-sm text-red-500">{errors.comment.message}</p>
        )}
        <p className="text-sm text-dt-text-muted">
          This review will be visible to the public once both parties have submitted their reviews or after 14 days.
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button
          type="submit"
          disabled={isSubmitting || ratings.overallRating === 0}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>

      {/* Blockchain Info */}
      {isBlockchainSubmitting && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Recording your review on the blockchain to ensure it cannot be altered...
          </p>
        </div>
      )}
    </form>
  );
}
