'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Sparkles, Shield, WalletMinimal, RefreshCw, CheckCircle2, Clock3, Building2 } from 'lucide-react';
import { toast } from 'sonner';

import { BasicProfileCard } from '@/components/profile/basic-profile-card';
import { FreelancerProfileForm } from '@/components/profile/freelancer-profile-form';
import { FreelancerSkillsCard } from '@/components/profile/freelancer-skills-card';
import { FreelancerEducationCard } from '@/components/profile/freelancer-education-card';
import { FreelancerDocumentsCard } from '@/components/profile/freelancer-documents-card';
import { ClientProfileForm } from '@/components/profile/client-profile-form';
import { ProfileProgressRing } from '@/components/profile/profile-progress-ring';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Spinner } from '@/components/ui/spinner';
import { userApi, type User, type FreelancerProfile, type ClientProfile, type FreelancerSkill, type EducationEntry, type CertificationEntry } from '@/lib/api';
import { computeProfileCompletion, shortWallet } from '@/lib/profile-utils';
import { useAuthStore } from '@/store';
import { useSafeAccount } from '@/hooks/use-safe-account';
import { useSecureObjectUrl } from '@/hooks/use-secure-object-url';

export default function ProfileEditPage() {
  const { user, setUser } = useAuthStore();
  const token = useAuthStore((state) => state.token);
  const { address: connectedAddress, isConnected } = useSafeAccount();
  const [isRefreshing, setIsRefreshing] = useState(!user);
  const [loadError, setLoadError] = useState<string | null>(null);

  const refreshProfile = useCallback(async () => {
    setIsRefreshing(true);
    const response = await userApi.getMe();
    if (!response.success || !response.data) {
      const message = response.error?.message || 'Unable to load profile';
      setLoadError(message);
      toast.error(message);
      setIsRefreshing(false);
      return;
    }
    setLoadError(null);
    setUser(response.data as User);
    setIsRefreshing(false);
  }, [setUser]);

  useEffect(() => {
    if (!user) {
      void refreshProfile();
    }
  }, [refreshProfile, user]);

  const { objectUrl: avatarObjectUrl, isLoading: avatarLoading } = useSecureObjectUrl(user?.avatarUrl);

  const completion = useMemo(() => computeProfileCompletion(user), [user]);
  const role = user?.role ?? 'FREELANCER';
  const isFreelancer = role === 'FREELANCER';
  const freelancerProfile = user?.freelancerProfile ?? null;
  const clientProfile = user?.clientProfile ?? null;
  const profileComplete = isFreelancer ? Boolean(freelancerProfile?.profileComplete) : completion >= 70;
  const walletDisplayAddress = user?.walletAddress ?? (isConnected ? connectedAddress : null);
  const walletBadgeLabel = walletDisplayAddress
    ? user?.walletAddress
      ? `Wallet ${shortWallet(walletDisplayAddress)}`
      : `Wallet ${shortWallet(walletDisplayAddress)} · unsynced`
    : 'Wallet not linked';
  const walletBadgeTone = user?.walletAddress
    ? 'border-slate-200 text-slate-600'
    : walletDisplayAddress
    ? 'border-cyan-200 text-cyan-600'
    : 'border-amber-200 text-amber-500';

  const handleFreelancerUpdated = (profile: FreelancerProfile) => {
    if (!user) return;
    setUser({ ...user, freelancerProfile: profile });
  };

  const handleClientUpdated = (profile: ClientProfile) => {
    if (!user) return;
    setUser({ ...user, clientProfile: profile });
  };

  const handleSkillAdded = (skill: FreelancerSkill) => {
    if (!user || !user.freelancerProfile) return;
    setUser({
      ...user,
      freelancerProfile: {
        ...user.freelancerProfile,
        skills: [...(user.freelancerProfile.skills ?? []), skill],
      },
    });
  };

  const handleSkillRemoved = (skillId: string) => {
    if (!user || !user.freelancerProfile) return;
    setUser({
      ...user,
      freelancerProfile: {
        ...user.freelancerProfile,
        skills: (user.freelancerProfile.skills ?? []).filter((skill) => skill.skillId !== skillId),
      },
    });
  };

  const handleEducationAdded = (entry: EducationEntry) => {
    if (!user || !user.freelancerProfile) return;
    setUser({
      ...user,
      freelancerProfile: {
        ...user.freelancerProfile,
        education: [...(user.freelancerProfile.education ?? []), entry],
      },
    });
  };

  const handleEducationRemoved = (educationId: string) => {
    if (!user || !user.freelancerProfile) return;
    setUser({
      ...user,
      freelancerProfile: {
        ...user.freelancerProfile,
        education: (user.freelancerProfile.education ?? []).filter((entry) => entry.id !== educationId),
      },
    });
  };

  const handleResumeUpdated = (resumeUrl: string | null) => {
    if (!user || !user.freelancerProfile) return;
    setUser({
      ...user,
      freelancerProfile: {
        ...user.freelancerProfile,
        resumeUrl: resumeUrl || null,
      },
    });
  };

  const handleCertificationAdded = (certification: CertificationEntry) => {
    if (!user || !user.freelancerProfile) return;
    setUser({
      ...user,
      freelancerProfile: {
        ...user.freelancerProfile,
        certifications: [...(user.freelancerProfile.certifications ?? []), certification],
      },
    });
  };

  const handleCertificationRemoved = (certificationId: string) => {
    if (!user || !user.freelancerProfile) return;
    setUser({
      ...user,
      freelancerProfile: {
        ...user.freelancerProfile,
        certifications: (user.freelancerProfile.certifications ?? []).filter((entry) => entry.id !== certificationId),
      },
    });
  };

  const taskList = isFreelancer
    ? [
        { label: 'Add a headline & timezone', complete: Boolean(freelancerProfile?.title && freelancerProfile?.timezone) },
        { label: 'Write 100+ word narrative', complete: (freelancerProfile?.bio?.length ?? 0) >= 100 },
        { label: 'List at least 3 verified skills', complete: (freelancerProfile?.skills?.length ?? 0) >= 3 },
        { label: 'Log an education signal', complete: (freelancerProfile?.education?.length ?? 0) > 0 },
        { label: 'Share a portfolio link', complete: (freelancerProfile?.portfolioLinks?.length ?? 0) > 0 },
      ]
    : [
        { label: 'Name your organization', complete: Boolean(clientProfile?.companyName) },
        { label: 'Describe what you build', complete: Boolean(clientProfile?.description) },
        { label: 'Link website or deck', complete: Boolean(clientProfile?.companyWebsite) },
        { label: 'Verify payment method', complete: Boolean(clientProfile?.paymentVerified) },
      ];

  const insightStats = isFreelancer
    ? [
        {
          label: 'Trust Score',
          value: `${freelancerProfile?.trustScore ?? 0}%`,
          detail: `${freelancerProfile?.totalReviews ?? 0} on-chain reviews`,
          icon: <Shield className="h-4 w-4 text-emerald-300" />,
        },
        {
          label: 'AI Capability',
          value: `${freelancerProfile?.aiCapabilityScore ?? 0}%`,
          detail: 'Updated after each skills update',
          icon: <Sparkles className="h-4 w-4 text-cyan-300" />,
        },
        {
          label: 'Completed Jobs',
          value: `${freelancerProfile?.completedJobs ?? 0}`,
          detail: `${freelancerProfile?.avgRating?.toFixed?.(1) ?? '—'} star average`,
          icon: <Building2 className="h-4 w-4 text-slate-400" />,
        },
      ]
    : [
        {
          label: 'Trust Score',
          value: `${clientProfile?.trustScore ?? 0}%`,
          detail: `${clientProfile?.totalReviews ?? 0} feedback cycles`,
          icon: <Shield className="h-4 w-4 text-emerald-300" />,
        },
        {
          label: 'Hire Rate',
          value: `${clientProfile?.hireRate ?? 0}%`,
          detail: `${clientProfile?.jobsPosted ?? 0} jobs posted`,
          icon: <Building2 className="h-4 w-4 text-cyan-500" />,
        },
        {
          label: 'Payment Status',
          value: clientProfile?.paymentVerified ? 'Verified' : 'Pending',
          detail: clientProfile?.paymentVerified ? 'Escrow ready' : 'Connect wallet on dashboard',
          icon: <WalletMinimal className="h-4 w-4 text-slate-400" />,
        },
      ];

  if (!user && isRefreshing) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center space-y-4 py-10">
          <p className="text-center text-sm text-slate-600">We couldn&apos;t load your profile. Try again.</p>
          <Button onClick={refreshProfile} className="gap-2">
            <RefreshCw className="h-4 w-4" />Reload
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[36px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white p-8 text-slate-900 shadow-[0_30px_120px_rgba(16,185,129,0.14)]">
        <div className="absolute inset-0 opacity-80" aria-hidden>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(94,234,212,0.25),_transparent_65%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.12),_transparent_60%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.5)_35%,rgba(255,255,255,0)_70%)]" />
        </div>
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr,auto]">
          <div className="space-y-4 text-slate-900">
            <p className="text-[0.7rem] uppercase tracking-[0.7em] text-emerald-500">Module 1 · Profile {profileComplete ? 'ready' : 'in progress'}</p>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="group relative h-24 w-24 overflow-hidden rounded-3xl border border-emerald-200 bg-white p-1 shadow-xl">
                {avatarObjectUrl ? (
                  <Image src={avatarObjectUrl} alt={user?.name || 'Avatar'} fill className="rounded-2xl object-cover" sizes="96px" unoptimized />
                ) : avatarLoading ? (
                  <div className="flex h-full w-full items-center justify-center">
                    <Spinner size="sm" />
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl">🪪</div>
                )}
                <div className="pointer-events-none absolute inset-0 rounded-3xl border border-emerald-400/40 opacity-0 transition group-hover:opacity-100" />
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold leading-tight">
                  {profileComplete ? 'Your on-chain identity is ready for work.' : 'Finish crafting a profile that earns trust instantly.'}
                </h1>
                <p className="text-sm uppercase tracking-[0.4em] text-slate-400">{user?.name || 'Unnamed talent'}</p>
              </div>
            </div>
            <p className="text-slate-600">
              {isFreelancer
                ? 'Profiles that cross the 70% threshold appear in curated searches, unlocking smart escrow proposals and AI capability boosts.'
                : 'A complete organization profile reassures top-tier talent. Verified payment signals and context improve proposal quality.'}
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge variant={profileComplete ? 'success' : 'warning'} className="text-sm">
                {profileComplete ? 'Ready for proposals' : 'Complete profile to unlock proposals'}
              </Badge>
              <Badge variant="secondary" className="bg-white/70 text-slate-700 uppercase tracking-[0.3em]">
                {role.toLowerCase()}
              </Badge>
              <Badge variant="outline" className={walletBadgeTone}>{walletBadgeLabel}</Badge>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Signal-dense onboarding
              </span>
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4" /> Trust-first scoring
              </span>
            </div>
          </div>
          <ProfileProgressRing
            value={completion}
            caption={profileComplete ? 'Great! You meet the 70% completeness threshold.' : 'Reach at least 70% to unlock proposals and escrow contracts.'}
          />
        </div>
        <div className="relative z-10 mt-8 grid gap-4 md:grid-cols-3">
          {insightStats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                {stat.icon}
                <span>{stat.label}</span>
              </div>
              <div className="mt-3 text-2xl font-semibold text-slate-900">{stat.value}</div>
              <p className="text-sm text-slate-500">{stat.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {loadError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {loadError}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.8fr,1fr]">
        <div className="rounded-[32px] border border-emerald-100 bg-gradient-to-b from-emerald-50 via-white to-white p-6 shadow-[0_25px_70px_rgba(16,185,129,0.12)]">
          <div className="space-y-6">
            <BasicProfileCard user={user} onUpdated={(updatedUser) => setUser(updatedUser)} />
            {isFreelancer ? (
              <>
                <FreelancerProfileForm profile={freelancerProfile} onUpdated={handleFreelancerUpdated} />
                <FreelancerSkillsCard
                  skills={freelancerProfile?.skills ?? []}
                  onSkillAdded={handleSkillAdded}
                  onSkillRemoved={handleSkillRemoved}
                  onSync={refreshProfile}
                />
                <FreelancerEducationCard
                  education={freelancerProfile?.education ?? []}
                  onAdded={handleEducationAdded}
                  onRemoved={handleEducationRemoved}
                  onSync={refreshProfile}
                />
                <FreelancerDocumentsCard
                  profile={freelancerProfile}
                  onResumeUpdated={handleResumeUpdated}
                  onCertificationAdded={handleCertificationAdded}
                  onCertificationRemoved={handleCertificationRemoved}
                />
              </>
            ) : (
              <ClientProfileForm profile={clientProfile} onUpdated={handleClientUpdated} />
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-none bg-gradient-to-br from-emerald-50 via-white to-white shadow-lg shadow-emerald-100/60">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base text-slate-900">
                Completion checklist
                <Button variant="ghost" size="sm" className="text-xs text-slate-500" onClick={refreshProfile} disabled={isRefreshing}>
                  <RefreshCw className={`mr-2 h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} /> Sync
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {taskList.map((task) => (
                <div key={task.label} className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-white/60 px-4 py-3 backdrop-blur">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{task.label}</p>
                    <p className="text-xs text-slate-500">{task.complete ? 'Looks great' : 'Required for Module 1 completion'}</p>
                  </div>
                  {task.complete ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <Clock3 className="h-5 w-5 text-amber-500" />
                  )}
                </div>
              ))}
              <p className="text-xs text-slate-500">
                Need help? Explore our <Link href="/docs" className="font-semibold text-emerald-600">profile playbook</Link> to see what world-class entries look like.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none bg-gradient-to-br from-emerald-50 via-white to-white shadow-lg shadow-emerald-100/60">
            <CardHeader>
              <CardTitle className="text-base text-slate-900">Identity & channels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600">
              <div className="rounded-2xl border border-emerald-100 bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Email</p>
                <p className="text-slate-900">{user.email}</p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Wallet</p>
                <p className="font-mono text-slate-900">{walletDisplayAddress ? shortWallet(walletDisplayAddress) : 'Not paired yet'}</p>
                {!user.walletAddress && walletDisplayAddress ? (
                  <p className="text-xs text-slate-500">Connected this session — save it in account basics to persist.</p>
                ) : null}
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Created</p>
                <p className="text-slate-900">{new Date(user.createdAt).toLocaleString()}</p>
              </div>
              <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600">
                Head back to dashboard →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
