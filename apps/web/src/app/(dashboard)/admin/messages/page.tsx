'use client';

import { MessageCircle, TrendingUp } from 'lucide-react';

import { Card, CardContent } from '@/components/ui';
import { Spinner } from '@/components/ui/spinner';
import { useAdminStats } from '@/hooks/queries/use-admin';

export default function AdminMessagesPage() {
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
          <MessageCircle className="h-6 w-6 text-rose-500" />
          Message Overview
        </h1>
        <p className="mt-1 text-sm text-dt-text-muted">
          Platform messaging statistics
        </p>
      </div>

      {stats && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-dt-border bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-950/30 dark:to-rose-900/20">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500 text-white">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-medium text-rose-700 dark:text-rose-400">Total Messages</p>
                  <p className="text-2xl font-bold text-rose-800 dark:text-rose-300">{stats.messages.total.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-dt-border bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-white">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-medium text-blue-700 dark:text-blue-400">This Month</p>
                  <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">{stats.messages.thisMonth.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Info */}
      <Card className="border-dt-border bg-dt-surface">
        <CardContent className="flex items-start gap-3 p-4">
          <MessageCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-400" />
          <div>
            <p className="text-sm font-medium text-dt-text">Message Privacy</p>
            <p className="mt-0.5 text-xs text-dt-text-muted">
              Messages are private between participants. Admins can view aggregate statistics but cannot read individual message content unless subpoenaed for dispute evidence.
              All messages are archived and may be used as evidence in dispute resolution.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
