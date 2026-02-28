'use client';

import Link from 'next/link';
import { MessageSquare, Calendar, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';
import { SecureAvatar } from '@/components/secure-avatar';
import { StarRating } from './star-rating';
import { getReviewLabels } from '@/lib/review-utils';
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

/** Determine if the review author was the client (reviewing a freelancer) */
function isClientAuthor(review: Review): boolean {
  return Boolean(review.contract && review.authorId === review.contract.clientId);
}

function ReviewCard({ review }: { review: Review }) {
  const authorName = review.author?.name || 'Anonymous';
  const clientReview = isClientAuthor(review);
  const labels = getReviewLabels(clientReview);

  return (
    <Card className="border-dt-border bg-dt-surface shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Author Avatar */}
          <SecureAvatar
            src={review.author?.avatarUrl}
            alt={authorName}
            size={40}
            fallbackInitial={authorName[0]}
          />

          <div className="min-w-0 flex-1">
            {/* Header Row */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-medium text-dt-text">{authorName}</span>
                {review.contract?.title && review.contract?.id && (
                  <Link
                    href={`/contracts/${review.contract.id}`}
                    className="ml-2 inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 hover:underline dark:text-emerald-400 dark:hover:text-emerald-300"
                  >
                    on &ldquo;{review.contract.title}&rdquo;
                    <ExternalLink className="h-3 w-3" />
                  </Link>
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
                  <span>{labels.communication}: {Number(review.communicationRating).toFixed(1)}</span>
                )}
                {review.qualityRating && (
                  <span>{labels.quality}: {Number(review.qualityRating).toFixed(1)}</span>
                )}
                {review.timelinessRating && (
                  <span>{labels.timeliness}: {Number(review.timelinessRating).toFixed(1)}</span>
                )}
                {review.professionalismRating && (
                  <span>{labels.professionalism}: {Number(review.professionalismRating).toFixed(1)}</span>
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
