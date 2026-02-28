'use client';

import { Star, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import type { Review } from '@detrust/types';

interface ReviewCardProps {
  review: Review;
  showContract?: boolean;
}

export function ReviewCard({ review, showContract = false }: ReviewCardProps) {
  const renderStars = (rating: number | null) => {
    if (!rating) return null;

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const isFilled = i < fullStars;
          const isHalf = i === fullStars && hasHalfStar;

          return (
            <Star
              key={i}
              className={`h-4 w-4 ${
                isFilled || isHalf
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-slate-300 dark:text-slate-600'
              }`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-dt-surface border border-dt-border rounded-lg p-6 space-y-4">
      {/* Author Info */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
            <span className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
              {review.author?.name?.[0]?.toUpperCase() || '?'}
            </span>
          </div>
          <div>
            <h4 className="font-medium text-dt-text">{review.author?.name || 'Anonymous'}</h4>
            <p className="text-sm text-dt-text-muted">
              {format(new Date(review.createdAt), 'MMM d, yyyy')}
            </p>
          </div>
        </div>

        {/* Blockchain Verification Badge */}
        {review.blockchainTxHash && (
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-xs font-medium">Verified on Blockchain</span>
          </div>
        )}
      </div>

      {/* Ratings */}
      <div className="space-y-3">
        {/* Overall Rating */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-dt-text">Overall</span>
          <div className="flex items-center gap-2">
            {renderStars(parseFloat(review.overallRating.toString()))}
            <span className="text-sm font-semibold text-dt-text">
              {parseFloat(review.overallRating.toString()).toFixed(1)}
            </span>
          </div>
        </div>

        {/* Specific Ratings */}
        {review.communicationRating && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-dt-text-muted">Communication</span>
            <div className="flex items-center gap-2">
              {renderStars(parseFloat(review.communicationRating.toString()))}
              <span className="text-sm text-dt-text-muted">
                {parseFloat(review.communicationRating.toString()).toFixed(1)}
              </span>
            </div>
          </div>
        )}

        {review.qualityRating && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-dt-text-muted">Quality</span>
            <div className="flex items-center gap-2">
              {renderStars(parseFloat(review.qualityRating.toString()))}
              <span className="text-sm text-dt-text-muted">
                {parseFloat(review.qualityRating.toString()).toFixed(1)}
              </span>
            </div>
          </div>
        )}

        {review.timelinessRating && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-dt-text-muted">Timeliness</span>
            <div className="flex items-center gap-2">
              {renderStars(parseFloat(review.timelinessRating.toString()))}
              <span className="text-sm text-dt-text-muted">
                {parseFloat(review.timelinessRating.toString()).toFixed(1)}
              </span>
            </div>
          </div>
        )}

        {review.professionalismRating && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-dt-text-muted">Professionalism</span>
            <div className="flex items-center gap-2">
              {renderStars(parseFloat(review.professionalismRating.toString()))}
              <span className="text-sm text-dt-text-muted">
                {parseFloat(review.professionalismRating.toString()).toFixed(1)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Comment */}
      {review.comment && (
        <div className="pt-3 border-t border-dt-border">
          <p className="text-dt-text whitespace-pre-wrap">{review.comment}</p>
        </div>
      )}

      {/* Blockchain Link */}
      {review.blockchainTxHash && (
        <div className="pt-3 border-t border-dt-border">
          <a
            href={`https://polygonscan.com/tx/${review.blockchainTxHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            View on Blockchain →
          </a>
        </div>
      )}
    </div>
  );
}
