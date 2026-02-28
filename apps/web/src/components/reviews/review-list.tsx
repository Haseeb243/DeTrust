'use client';

import { MessageSquare, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';
import { StarRating } from './star-rating';
import type { Review } from '@/lib/api/review';

interface ReviewListProps {
  reviews: Review[];
  emptyMessage?: string;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

function ReviewCard({ review }: { review: Review }) {
  const authorName = review.author?.name || 'Anonymous';
  const initial = authorName[0]?.toUpperCase() ?? 'A';

  return (
    <Card className="border-dt-border bg-dt-surface shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Author Avatar */}
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            {initial}
          </div>

          <div className="min-w-0 flex-1">
            {/* Header Row */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-medium text-dt-text">{authorName}</span>
                {review.contract?.title && (
                  <span className="ml-2 text-xs text-dt-text-muted">
                    on &ldquo;{review.contract.title}&rdquo;
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-dt-text-muted">
                <Calendar className="h-3 w-3" />
                {formatDate(review.createdAt)}
              </div>
            </div>

            {/* Overall Rating */}
            <div className="mt-1.5">
              <StarRating value={Number(review.overallRating)} readonly size="sm" showValue />
            </div>

            {/* Category Ratings */}
            {(review.communicationRating || review.qualityRating || review.timelinessRating || review.professionalismRating) && (
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-dt-text-muted">
                {review.communicationRating && (
                  <span>Communication: {Number(review.communicationRating).toFixed(1)}</span>
                )}
                {review.qualityRating && (
                  <span>Quality: {Number(review.qualityRating).toFixed(1)}</span>
                )}
                {review.timelinessRating && (
                  <span>Timeliness: {Number(review.timelinessRating).toFixed(1)}</span>
                )}
                {review.professionalismRating && (
                  <span>Professionalism: {Number(review.professionalismRating).toFixed(1)}</span>
                )}
              </div>
            )}

            {/* Comment */}
            {review.comment && (
              <div className="mt-3 flex gap-2">
                <MessageSquare className="mt-0.5 h-4 w-4 flex-shrink-0 text-dt-text-muted" />
                <p className="text-sm leading-relaxed text-dt-text">{review.comment}</p>
              </div>
            )}

            {/* Blockchain badge */}
            {review.blockchainTxHash && (
              <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                ✓ On-chain verified
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReviewList({ reviews, emptyMessage = 'No reviews yet' }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <Card className="border-dt-border bg-dt-surface shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <MessageSquare className="h-10 w-10 text-slate-300 dark:text-slate-600" />
          <p className="mt-3 text-sm text-dt-text-muted">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
