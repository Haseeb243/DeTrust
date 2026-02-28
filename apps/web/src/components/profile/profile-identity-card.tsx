'use client';

import { BadgeCheck } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import type { User } from '@/lib/api/user';

export interface ProfileIdentityCardProps {
  profile: User;
  walletDisplayAddress: string | null | undefined;
  shortWallet: (address?: string | null) => string;
}

export function ProfileIdentityCard({ profile, walletDisplayAddress, shortWallet }: ProfileIdentityCardProps) {
  return (
    <Card className="border-dt-border bg-dt-surface shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-dt-text">
          <BadgeCheck className="h-4 w-4 text-emerald-500" /> Identity &amp; channels
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-dt-text-muted">
        <div className="rounded-2xl border border-dt-border bg-dt-surface-alt p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-dt-text-muted">Email</p>
          <p className="text-dt-text">{profile.email}</p>
        </div>
        <div className="rounded-2xl border border-dt-border bg-dt-surface-alt p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-dt-text-muted">Wallet</p>
          <p className="font-mono text-dt-text">{walletDisplayAddress ? shortWallet(walletDisplayAddress) : 'Not paired yet'}</p>
          {!profile.walletAddress && walletDisplayAddress ? (
            <p className="text-xs text-dt-text-muted">Connected this session — save it in edit mode to persist.</p>
          ) : null}
        </div>
        <div className="rounded-2xl border border-dt-border bg-dt-surface-alt p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-dt-text-muted">Created</p>
          <p className="text-dt-text">{new Date(profile.createdAt).toLocaleString()}</p>
        </div>
      </CardContent>
    </Card>
  );
}
