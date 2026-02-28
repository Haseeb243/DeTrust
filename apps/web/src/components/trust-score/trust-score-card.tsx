'use client';

import { Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { TRUST_SCORE_EXCELLENT, TRUST_SCORE_GOOD } from '@/lib/review-utils';
import { cn } from '@/lib/utils';
import type { TrustScoreBreakdown } from '@/lib/api/user';

interface TrustScoreCardProps {
  breakdown: TrustScoreBreakdown;
  className?: string;
}

function getScoreColor(score: number): string {
  if (score > TRUST_SCORE_EXCELLENT) return 'text-emerald-500';
  if (score >= TRUST_SCORE_GOOD) return 'text-blue-500';
  if (score > 0) return 'text-amber-500';
  return 'text-slate-400';
}

function getBarColor(score: number): string {
  if (score > TRUST_SCORE_EXCELLENT) return 'bg-emerald-500';
  if (score >= TRUST_SCORE_GOOD) return 'bg-blue-500';
  if (score > 0) return 'bg-amber-500';
  return 'bg-slate-300';
}

export function TrustScoreCard({ breakdown, className }: TrustScoreCardProps) {
  return (
    <Card className={cn('border-dt-border bg-dt-surface shadow-lg', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-dt-text">
          <Shield className="h-5 w-5 text-emerald-500" />
          Trust Score Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Score */}
        <div className="flex items-center gap-4">
          <div className={cn('text-4xl font-bold', getScoreColor(breakdown.totalScore))}>
            {breakdown.totalScore > 0 ? breakdown.totalScore.toFixed(1) : '—'}
          </div>
          <div>
            <p className="text-sm font-medium text-dt-text">Overall Trust Score</p>
            <p className="text-xs text-dt-text-muted">
              {breakdown.totalScore > TRUST_SCORE_EXCELLENT
                ? 'Excellent — highly trusted'
                : breakdown.totalScore >= TRUST_SCORE_GOOD
                  ? 'Good — building credibility'
                  : breakdown.totalScore > 0
                    ? 'Developing — keep improving'
                    : 'No data yet'}
            </p>
          </div>
        </div>

        {/* Component Breakdown */}
        {breakdown.components.length > 0 && (
          <div className="space-y-3 border-t border-dt-border pt-4">
            {breakdown.components.map((component) => (
              <div key={component.label} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dt-text-muted">
                    {component.label}{' '}
                    <span className="text-xs text-dt-text-muted/60">
                      ({(component.weight * 100).toFixed(0)}%)
                    </span>
                  </span>
                  <span className="font-medium text-dt-text">
                    {component.normalizedValue.toFixed(1)}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={cn('h-full rounded-full transition-all', getBarColor(component.normalizedValue))}
                    style={{ width: `${Math.min(component.normalizedValue, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
