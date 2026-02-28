'use client';

import { Star } from 'lucide-react';
import type { ReviewSummary } from '@detrust/types';

interface ReviewSummaryCardProps {
  summary: ReviewSummary;
}

export function ReviewSummaryCard({ summary }: ReviewSummaryCardProps) {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const isFilled = i < fullStars;
          const isHalf = i === fullStars && hasHalfStar;

          return (
            <Star
              key={i}
              className={`h-5 w-5 ${
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

  const getBarWidth = (count: number) => {
    if (summary.totalReviews === 0) return '0%';
    return `${(count / summary.totalReviews) * 100}%`;
  };

  return (
    <div className="bg-dt-surface border border-dt-border rounded-lg p-6 space-y-6">
      {/* Overall Rating */}
      <div className="text-center space-y-2">
        <div className="text-5xl font-bold text-dt-text">
          {summary.averageRating.toFixed(1)}
        </div>
        <div className="flex justify-center">
          {renderStars(summary.averageRating)}
        </div>
        <p className="text-dt-text-muted">
          Based on {summary.totalReviews} {summary.totalReviews === 1 ? 'review' : 'reviews'}
        </p>
      </div>

      {/* Rating Distribution */}
      {summary.totalReviews > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-dt-text mb-3">Rating Distribution</h4>
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-3">
              <span className="text-sm text-dt-text-muted w-12">
                {rating} star{rating !== 1 && 's'}
              </span>
              <div className="flex-1 h-2 bg-dt-surface-alt rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 transition-all duration-300"
                  style={{ width: getBarWidth(summary.ratingDistribution[rating as 1 | 2 | 3 | 4 | 5]) }}
                />
              </div>
              <span className="text-sm text-dt-text-muted w-8 text-right">
                {summary.ratingDistribution[rating as 1 | 2 | 3 | 4 | 5]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* No Reviews Message */}
      {summary.totalReviews === 0 && (
        <div className="text-center py-8">
          <Star className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-dt-text-muted">No reviews yet</p>
        </div>
      )}
    </div>
  );
}
