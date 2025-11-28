'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useAccount, useBalance } from 'wagmi';
import {
  ArrowUpRight,
  BellRing,
  Briefcase,
  Inbox,
  ListChecks,
  ShieldCheck,
  Sparkles,
  Wallet2,
  CheckCircle2,
} from 'lucide-react';

import { useAuthStore } from '@/store';
import { ProfileProgressRing } from '@/components/profile/profile-progress-ring';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { computeProfileCompletion, shortWallet } from '@/lib/profile-utils';

const ratingLabel = (value?: number | null) =>
  typeof value === 'number' ? `${value.toFixed(1)} ★ avg` : 'No reviews yet';

const toneClasses: Record<'success' | 'warning' | 'info', string> = {
  success: 'border-emerald-100 bg-emerald-50 text-emerald-900',
  warning: 'border-amber-100 bg-amber-50 text-amber-900',
  info: 'border-cyan-100 bg-cyan-50 text-cyan-900',
};

export default function DashboardPage() {
  const { user, isNewUser } = useAuthStore();
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({
    address,
    query: {
      enabled: Boolean(address && isConnected),
      refetchInterval: 15000,
    },
  });

  const isFreelancer = user?.role === 'FREELANCER';
  const completion = computeProfileCompletion(user);
  const freelancerProfile = user?.freelancerProfile;
  const clientProfile = user?.clientProfile;
  const heroStats = isFreelancer
    ? [
        {
          label: 'Trust score',
          value: `${freelancerProfile?.trustScore ?? 0}%`,
          helper: `${freelancerProfile?.totalReviews ?? 0} reviews`,
        },
        {
          label: 'AI capability',
          value: `${freelancerProfile?.aiCapabilityScore ?? 0}%`,
          helper: 'Signals from skills + verification',
        },
        {
          label: 'Completed jobs',
          value: `${freelancerProfile?.completedJobs ?? 0}`,
          helper: ratingLabel(freelancerProfile?.avgRating),
        },
      ]
    : [
        {
          label: 'Trust score',
          value: `${clientProfile?.trustScore ?? 0}%`,
          helper: `${clientProfile?.totalReviews ?? 0} client reviews`,
        },
        {
          label: 'Hire rate',
          value: `${clientProfile?.hireRate ?? 0}%`,
          helper: `${clientProfile?.jobsPosted ?? 0} jobs posted`,
        },
        {
          label: 'Payment status',
          value: clientProfile?.paymentVerified ? 'Verified' : 'Pending',
          helper: clientProfile?.paymentVerified ? 'Escrow ready' : 'Fund your first escrow',
        },
      ];

  const notifications = useMemo(() => {
    const entries: Array<{
      title: string;
      detail: string;
      tone: 'success' | 'warning' | 'info';
      action?: { label: string; href: string };
    }> = [];

    const walletLinked = Boolean(user?.walletAddress);

    if (isNewUser || completion < 70) {
      entries.push({
        title: 'Finish your profile',
        detail: 'Hit at least 70% completeness to unlock proposals and escrow.',
        tone: 'warning',
        action: { label: 'Open profile', href: '/profile' },
      });
    }

    if (!walletLinked) {
      entries.push({
        title: 'Connect payout wallet',
        detail: 'Link an Ethereum wallet so we can route escrow releases instantly.',
        tone: 'info',
        action: { label: 'Manage wallet', href: '/profile' },
      });
    }

    if (isFreelancer && (freelancerProfile?.skills?.length ?? 0) < 3) {
      entries.push({
        title: 'Add at least 3 skills',
        detail: 'Verified skills fuel your AI capability score.',
        tone: 'info',
        action: { label: 'Edit skills', href: '/profile' },
      });
    }

    if (!isFreelancer && !clientProfile?.paymentVerified) {
      entries.push({
        title: 'Verify payment method',
        detail: 'Fund an escrow or connect a wallet to earn the verified badge.',
        tone: 'warning',
        action: { label: 'Fund escrow', href: '/jobs/new' },
      });
    }

    if (entries.length === 0) {
      entries.push({
        title: 'All systems optimal',
        detail: 'You have no pending action items right now. Keep shipping!',
        tone: 'success',
      });
    }

    return entries;
  }, [clientProfile, completion, freelancerProfile, isFreelancer, isNewUser, user?.walletAddress]);

  const workMetrics = isFreelancer
    ? [
        {
          label: 'Active contracts',
          value: '0',
          helper: 'Contracts appear here once smart escrow kicks off.',
          action: { label: 'Browse jobs', href: '/jobs' },
        },
        {
          label: 'Completed jobs',
          value: `${freelancerProfile?.completedJobs ?? 0}`,
          helper: ratingLabel(freelancerProfile?.avgRating),
        },
      ]
    : [
        {
          label: 'Active jobs',
          value: '0',
          helper: 'New posts go live here once published.',
          action: { label: 'Post a job', href: '/jobs/new' },
        },
        {
          label: 'Jobs posted',
          value: `${clientProfile?.jobsPosted ?? 0}`,
          helper: `${clientProfile?.totalReviews ?? 0} feedback cycles`,
        },
      ];

  const proposalsCopy = isFreelancer
    ? {
        title: 'Proposal pipeline',
        explainer: 'Your submitted proposals will surface here once sent.',
        action: { label: 'View proposals', href: '/proposals' },
      }
    : {
        title: 'Incoming proposals',
        explainer: 'When freelancers respond, you can triage them here.',
        action: { label: 'Review proposals', href: '/jobs/mine' },
      };

  const tokenBalance = balanceData
    ? `${Number(balanceData.formatted).toFixed(4)} ${balanceData.symbol}`
    : isConnected
    ? '0.0000'
    : '—';

  if (!user) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500 shadow-xl">
        We&apos;re syncing your workspace…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_35px_80px_-40px_rgba(15,23,42,0.7)]">
        <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_60%),radial-gradient(circle_at_20%_20%,_rgba(59,130,246,0.14),_transparent_45%)]" />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.6fr,auto]">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <Badge
                variant="secondary"
                className="border border-emerald-200 bg-emerald-50 text-emerald-700"
              >
                Module 1
              </Badge>
              <span className="text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">
              {isFreelancer ? 'Ship trustworthy freelance work.' : 'Run verifiable hiring on autopilot.'}
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-slate-600">
              {isFreelancer
                ? 'Smart escrow, AI capability scans, and transparent trust scores help you land contracts without cold starts.'
                : 'Publish roles with embedded escrow, verify payments, and evaluate proposals with transparent trust data.'}
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {heroStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.helper}</p>
                </div>
              ))}
            </div>
          </div>
          <Card className="border border-slate-200 bg-white/90 text-slate-900 shadow-xl">
            <CardHeader>
              <CardTitle className="text-base text-slate-900">Profile progress</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <ProfileProgressRing value={completion} caption="Reach 70%+ to unlock escrow workflows" />
              <Link
                href="/profile"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                <ListChecks className="h-4 w-4 text-emerald-500" /> Edit profile
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border border-slate-200 bg-white/90 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-slate-900">
              <Briefcase className="h-4 w-4 text-emerald-500" /> Active workboard
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {workMetrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-xs uppercase tracking-[0.3em] text-slate-400">{metric.label}</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold text-slate-900">{metric.value}</span>
                  {metric.action ? (
                    <Link href={metric.action.href} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                      {metric.action.label} →
                    </Link>
                  ) : null}
                </div>
                <p className="text-sm text-slate-500">{metric.helper}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white/90 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-slate-900">
              <BellRing className="h-4 w-4 text-amber-400" /> Notification center
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.title}
                className={`rounded-2xl border px-4 py-3 text-sm ${toneClasses[notification.tone]}`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{notification.title}</p>
                  {notification.tone === 'success' ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : null}
                </div>
                <p className="text-xs text-slate-600">{notification.detail}</p>
                {notification.action ? (
                  <Link
                    href={notification.action.href}
                    className="mt-2 inline-flex items-center text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-slate-700"
                  >
                    {notification.action.label}
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border border-slate-200 bg-white/90 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-slate-900">
              <Inbox className="h-4 w-4 text-cyan-500" /> {proposalsCopy.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">{proposalsCopy.explainer}</p>
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-xs uppercase tracking-[0.3em] text-slate-500">
              Pipeline idle
            </div>
            <Link
              href={proposalsCopy.action.href}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              {proposalsCopy.action.label}
              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
            </Link>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white/90 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-slate-900">
              <Wallet2 className="h-4 w-4 text-emerald-500" /> Wallet & token balance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-600">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Balance</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{tokenBalance}</p>
              <p className="text-sm text-slate-500">
                {isConnected ? 'Live balance from connected wallet' : 'Connect a wallet to preview on-chain funds.'}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
              <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Wallet</div>
              <div className="font-mono text-base text-slate-900">{shortWallet(user.walletAddress || address)}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-emerald-50/80 p-4 text-sm text-emerald-900">
              <div className="text-xs uppercase tracking-[0.3em] text-emerald-500">Status</div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                {user.walletAddress ? 'Escrow payouts ready' : 'Awaiting wallet pairing'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white/90 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-slate-900">
              <Sparkles className="h-4 w-4 text-fuchsia-500" /> Rituals checklist
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="font-medium text-slate-900">Review trust signals weekly</p>
              <p className="text-xs text-slate-500">Boost your score by reflecting new deliverables.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="font-medium text-slate-900">{isFreelancer ? 'Take a capability microtask' : 'Share milestone proofs'}</p>
              <p className="text-xs text-slate-500">
                {isFreelancer
                  ? 'Re-run AI capability scans when you add evidence.'
                  : 'Keep talent updated with escrow-backed status updates.'}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="font-medium text-slate-900">Monitor notifications</p>
              <p className="text-xs text-slate-500">Critical alerts appear in the center above—stay responsive.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
