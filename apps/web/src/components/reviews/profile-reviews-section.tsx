'use client';

import { useState } from 'react';
import { ReviewCard, ReviewSummaryCard } from '@/components/reviews';
import { useUserReviews, useUserReviewSummary } from '@/hooks/queries/use-reviews';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';

interface ProfileReviewsSectionProps {
  userId: string;
}

export function ProfileReviewsSection({ userId }: ProfileReviewsSectionProps) {
  const [page, setPage] = useState(1);
  const REVIEWS_PER_PAGE = 5;

  const { data: summary, isLoading: summaryLoading } = useUserReviewSummary(userId);
  const { data: reviewsData, isLoading: reviewsLoading } = useUserReviews(userId, page, REVIEWS_PER_PAGE);

  const reviews = reviewsData?.reviews || [];
  const totalPages = reviewsData?.totalPages || 1;

  if (summaryLoading || reviewsLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <ReviewSummaryCard summary={summary} />

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-dt-text">
            Recent Reviews ({summary.totalReviews})
          </h3>

          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border-dt-border text-dt-text hover:bg-dt-surface-alt"
              >
                Previous
              </Button>
              <div className="flex items-center gap-2 px-4">
                <span className="text-sm text-dt-text-muted">
                  Page {page} of {totalPages}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="border-dt-border text-dt-text hover:bg-dt-surface-alt"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
