'use client';

import { Star, MessageSquareText, BarChart2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Spinner } from '@/components/ui/spinner';
import { useAdminStats } from '@/hooks/queries/use-admin';

export default function AdminReviewsPage() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center"><Spinner size="lg" /></div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-dt-text">
          <Star className="h-6 w-6 text-amber-500" />
          Review Oversight
        </h1>
        <p className="mt-1 text-sm text-dt-text-muted">
          Monitor reviews across the platform
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-dt-border bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-white">
                  <Star className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-medium text-amber-700 dark:text-amber-400">Total Reviews</p>
                  <p className="text-2xl font-bold text-amber-800 dark:text-amber-300">{stats.reviews.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-dt-border bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white">
                  <BarChart2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Average Rating</p>
                  <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">{stats.reviews.avgRating.toFixed(1)} ★</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-dt-border bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-white">
                  <MessageSquareText className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-medium text-blue-700 dark:text-blue-400">This Month</p>
                  <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">{stats.reviews.thisMonth}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Info */}
      <Card className="border-dt-border bg-dt-surface">
        <CardContent className="flex items-start gap-3 p-4">
          <Star className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400" />
          <div>
            <p className="text-sm font-medium text-dt-text">Review Integrity</p>
            <p className="mt-0.5 text-xs text-dt-text-muted">
              All reviews are immutably stored. Reviews cannot be edited or deleted by any party — including admins — ensuring trust and transparency.
              Double-blind reviews: neither party sees the other&apos;s review until both submit or the 14-day window closes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
