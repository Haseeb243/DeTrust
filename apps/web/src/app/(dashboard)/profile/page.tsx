'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Award, BadgeCheck, Briefcase, Building2, Clock3, FileText, GraduationCap, Layers, MapPin, PenLine, ScrollText, Shield, Sparkles, UploadCloud, WalletMinimal } from 'lucide-react';
import { toast } from 'sonner';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Spinner } from '@/components/ui/spinner';
import { userApi, type User } from '@/lib/api';
import { computeProfileCompletion, shortWallet } from '@/lib/profile-utils';
import { useAuthStore } from '@/store';
import { useSafeAccount } from '@/hooks/use-safe-account';
import { fetchSecureFile, openSecureFileInNewTab, releaseObjectUrl } from '@/lib/secure-files';
import { useSecureObjectUrl } from '@/hooks/use-secure-object-url';

export default function ProfileViewPage() {
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

  const highlightStats = isFreelancer
    ? [
        {
          label: 'Trust score',
          value: `${freelancerProfile?.trustScore ?? 0}%`,
          detail: `${freelancerProfile?.totalReviews ?? 0} on-chain reviews`,
          icon: <Shield className="h-4 w-4 text-emerald-500" />,
        },
        {
          label: 'AI capability',
          value: `${freelancerProfile?.aiCapabilityScore ?? 0}%`,
          detail: 'Signals refresh after each skill update',
          icon: <Sparkles className="h-4 w-4 text-cyan-500" />,
        },
        {
          label: 'Jobs shipped',
          value: `${freelancerProfile?.completedJobs ?? 0}`,
          detail: `${freelancerProfile?.avgRating?.toFixed?.(1) ?? '—'} star avg`,
          icon: <Building2 className="h-4 w-4 text-slate-500" />,
        },
      ]
    : [
        {
          label: 'Trust score',
          value: `${clientProfile?.trustScore ?? 0}%`,
          detail: `${clientProfile?.totalReviews ?? 0} talent reviews`,
          icon: <Shield className="h-4 w-4 text-emerald-500" />,
        },
        {
          label: 'Hire rate',
          value: `${clientProfile?.hireRate ?? 0}%`,
          detail: `${clientProfile?.jobsPosted ?? 0} jobs posted`,
          icon: <Building2 className="h-4 w-4 text-cyan-500" />,
        },
        {
          label: 'Payment status',
          value: clientProfile?.paymentVerified ? 'Verified' : 'Pending',
          detail: clientProfile?.paymentVerified ? 'Escrow ready' : 'Verify inside edit view',
          icon: <WalletMinimal className="h-4 w-4 text-slate-500" />,
        },
      ];

  const taskList = isFreelancer
    ? [
        { label: 'Add headline & timezone', complete: Boolean(freelancerProfile?.title && freelancerProfile?.timezone) },
        { label: 'Write 100+ word narrative', complete: (freelancerProfile?.bio?.length ?? 0) >= 100 },
        { label: 'List ≥3 verified skills', complete: (freelancerProfile?.skills?.length ?? 0) >= 3 },
        { label: 'Log an education signal', complete: (freelancerProfile?.education?.length ?? 0) > 0 },
        { label: 'Share a portfolio link', complete: (freelancerProfile?.portfolioLinks?.length ?? 0) > 0 },
      ]
    : [
        { label: 'Name your organization', complete: Boolean(clientProfile?.companyName) },
        { label: 'Describe what you build', complete: Boolean(clientProfile?.description) },
        { label: 'Link website or deck', complete: Boolean(clientProfile?.companyWebsite) },
        { label: 'Verify payment method', complete: Boolean(clientProfile?.paymentVerified) },
      ];

  const certifications = useMemo(() => freelancerProfile?.certifications ?? [], [freelancerProfile?.certifications]);
  const topSkills = useMemo(() => {
    const skills = freelancerProfile?.skills ?? [];
    return [...skills]
      .sort((a, b) => {
        const aScore = a.verificationScore ?? a.proficiencyLevel ?? 0;
        const bScore = b.verificationScore ?? b.proficiencyLevel ?? 0;
        return bScore - aScore;
      })
      .slice(0, 8);
  }, [freelancerProfile?.skills]);

  const educationEntries = useMemo(() => {
    const entries = freelancerProfile?.education ?? [];
    return [...entries]
      .sort((a, b) => {
        const aDate = a.endDate ?? a.startDate ?? new Date(0);
        const bDate = b.endDate ?? b.startDate ?? new Date(0);
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      })
      .slice(0, 3);
  }, [freelancerProfile?.education]);

  const formatEducationRange = useCallback((start?: Date | string | null, end?: Date | string | null) => {
    if (!start && !end) return 'Dates not provided';
    const startYear = start ? new Date(start).getFullYear() : '—';
    const endYear = end ? new Date(end).getFullYear() : 'Present';
    return `${startYear} – ${endYear}`;
  }, []);
  const certificationCount = certifications.length;
  const [certPreviewMap, setCertPreviewMap] = useState<Record<string, { url: string; mimeType: string }>>({});

  useEffect(() => {
    if (!token || !certifications.length) {
      setCertPreviewMap((current) => {
        Object.values(current).forEach((entry) => releaseObjectUrl(entry.url));
        return {};
      });
      return undefined;
    }

    const controller = new AbortController();
    const createdUrls: string[] = [];
    let cancelled = false;

    const loadPreviews = async () => {
      const nextEntries: Record<string, { url: string; mimeType: string }> = {};
      for (const cert of certifications) {
        if (!cert.credentialUrl) continue;
        try {
          const file = await fetchSecureFile(cert.credentialUrl, {
            token,
            signal: controller.signal,
            attachObjectUrl: true,
          });
          if (!file.objectUrl) continue;
          if (!file.mimeType.startsWith('image/')) {
            releaseObjectUrl(file.objectUrl);
            continue;
          }
          createdUrls.push(file.objectUrl);
          nextEntries[cert.id] = {
            url: file.objectUrl,
            mimeType: file.mimeType,
          };
        } catch (error) {
          if ((error as Error)?.name === 'AbortError') {
            return;
          }
          console.warn('Unable to fetch certification preview', error);
        }
      }
      if (cancelled) {
        createdUrls.forEach(releaseObjectUrl);
        return;
      }
      setCertPreviewMap((current) => {
        Object.values(current).forEach((entry) => releaseObjectUrl(entry.url));
        return nextEntries;
      });
    };

    void loadPreviews();

    return () => {
      cancelled = true;
      controller.abort();
      createdUrls.forEach(releaseObjectUrl);
    };
  }, [token, certifications]);

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
            <Clock3 className="h-4 w-4" />Reload
          </Button>
        </CardContent>
      </Card>
    );
  }

  const languages = (freelancerProfile?.languages ?? []).join(' · ');
  const portfolio = freelancerProfile?.portfolioLinks?.[0];
  const resumeUploaded = Boolean(freelancerProfile?.resumeUrl);
  const clientWebsite = clientProfile?.companyWebsite;
  const clientIndustry = clientProfile?.industry;
  const clientTeamSize = clientProfile?.companySize;
  const activityCards = isFreelancer
    ? [
        {
          label: 'Latest resume status',
          body: resumeUploaded ? 'Resume ready to share with curated clients.' : 'Upload a polished PDF to boost match quality.',
        },
        {
          label: 'Certification pipeline',
          body: certificationCount
            ? `${certificationCount} credential${certificationCount === 1 ? '' : 's'} pinned to your dossier.`
            : 'Add a credential to your dossier to elevate trust signals.',
        },
        {
          label: 'Wallet syncing',
          body: walletDisplayAddress ? 'Wallet connected — finalize sync inside edit mode.' : 'Connect a wallet from the editor to unlock escrow.',
        },
      ]
    : [
        {
          label: 'Payment verification',
          body: clientProfile?.paymentVerified
            ? 'Payment method verified — escrow releases are unlocked for upcoming contracts.'
            : 'Verify a payment method in the editor to unlock escrow-backed hires.',
        },
        {
          label: 'Company dossier',
          body: clientProfile?.description
            ? 'Your narrative is live. Refresh it as the roadmap evolves to keep talent aligned.'
            : 'Add a short company narrative so senior talent understands the mission.',
        },
        {
          label: 'Opportunities pipeline',
          body: clientProfile?.jobsPosted
            ? `You’ve posted ${clientProfile.jobsPosted} job${clientProfile.jobsPosted === 1 ? '' : 's'}. Keep momentum by updating briefs regularly.`
            : 'Publish your first scoped opportunity to surface in curated freelancer feeds.',
        },
      ];

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-white via-slate-50 to-slate-100 p-8 text-slate-900 shadow-[0_35px_120px_rgba(15,23,42,0.12)]">
        <div className="absolute inset-0 opacity-80" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(79,70,229,0.12),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_0%,rgba(16,185,129,0.12),transparent_45%)]" />
        </div>
        <div className="relative z-10 flex flex-wrap items-start gap-8">
          <div className="flex items-start gap-5">
            <div className="group relative h-24 w-24 overflow-hidden rounded-3xl border border-slate-200 bg-white p-1 shadow-xl">
              {avatarObjectUrl ? (
                <Image src={avatarObjectUrl} alt={user.name ?? 'Avatar'} fill className="rounded-2xl object-cover" sizes="96px" unoptimized />
              ) : avatarLoading ? (
                <div className="flex h-full w-full items-center justify-center">
                  <Spinner size="sm" />
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl">🪪</div>
              )}
              <div className="absolute inset-0 rounded-3xl border border-emerald-400/40 opacity-0 transition group-hover:opacity-100" />
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.4em] text-slate-500">
                <span>{role.toLowerCase()}</span>
                <span className="h-0.5 w-8 bg-slate-200" />
                <span>{profileComplete ? 'ready' : 'in progress'}</span>
              </div>
              <h1 className="text-3xl font-semibold text-slate-900">{user.name || 'Unnamed talent'}</h1>
              <p className="text-base text-slate-600">{isFreelancer ? freelancerProfile?.title || 'Add a headline to unlock discovery' : clientProfile?.companyName || 'Add your organization name'}</p>
              <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4 text-emerald-400" /> {freelancerProfile?.location || clientProfile?.location || 'Location TBD'}</span>
                {freelancerProfile?.timezone && <span>UTC {freelancerProfile.timezone}</span>}
                {languages && <span>{languages}</span>}
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge variant={profileComplete ? 'success' : 'secondary'} className="bg-emerald-50 text-emerald-700">
                  {profileComplete ? 'Profile clears trust threshold' : 'Complete profile to unlock proposals'}
                </Badge>
                <Badge variant="outline" className="border-slate-200 text-slate-600">
                  {walletBadgeLabel}
                </Badge>
              </div>
            </div>
          </div>
          <div className="ml-auto flex flex-col items-end gap-4 text-right">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Completion</p>
              <p className="text-5xl font-light text-slate-900">{completion}%</p>
              <p className="text-sm text-slate-500">Reach 70%+ to surface in curated searches.</p>
            </div>
            <Button asChild variant="secondary" className="bg-emerald-500 text-white shadow-lg shadow-emerald-300/70">
              <Link href="/profile/edit" className="flex items-center gap-2">
                <PenLine className="h-4 w-4" /> Edit profile
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative z-10 mt-8 grid gap-4 md:grid-cols-3">
          {highlightStats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-inner">
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

      <div className="grid gap-6 lg:grid-cols-[1.65fr,1fr]">
        <div className="space-y-6">
          <Card className="border-slate-200 bg-white text-slate-700 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                <FileText className="h-5 w-5 text-emerald-500" /> About me
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed text-slate-600">
              <p>{isFreelancer ? freelancerProfile?.bio || 'Share how you work, the stacks you own, and proof of impact.' : clientProfile?.description || 'Describe what you are building to attract senior talent.'}</p>
              <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-slate-400">
                {isFreelancer ? (
                  <>
                    {portfolio ? (
                      <Link href={portfolio} target="_blank" className="text-emerald-600 transition hover:text-emerald-500">
                        Portfolio →
                      </Link>
                    ) : (
                      <span>Add portfolio links in edit mode</span>
                    )}
                    <span>{freelancerProfile?.languages?.length ? `${freelancerProfile.languages.length} languages` : 'Add languages'}</span>
                    <span>{freelancerProfile?.availability || 'Availability not set'}</span>
                  </>
                ) : (
                  <>
                    {clientWebsite ? (
                      <Link href={clientWebsite} target="_blank" className="text-emerald-600 transition hover:text-emerald-500">
                        Company site →
                      </Link>
                    ) : (
                      <span>Add company site in edit mode</span>
                    )}
                    <span>{clientIndustry || 'Industry not set'}</span>
                    <span>{clientTeamSize ? `${clientTeamSize} team` : 'Team size TBD'}</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {isFreelancer && (
            <Card className="border-slate-200 bg-white text-slate-800 shadow-xl">
              <CardHeader className="space-y-3">
                <p className="text-xs uppercase tracking-[0.45em] text-slate-400">Professional dossier</p>
                <CardTitle className="flex flex-wrap items-center gap-3 text-2xl text-slate-900">
                  <Layers className="h-6 w-6 text-emerald-500" /> Proof that travels well
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-emerald-500">Resume</p>
                        <p className="text-lg font-semibold text-slate-900">{resumeUploaded ? 'Private PDF ready' : 'No resume uploaded'}</p>
                      </div>
                      <ScrollText className="h-8 w-8 text-emerald-400" />
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Button asChild variant="outline" className="border-emerald-200 text-emerald-700">
                        <Link href="/profile/edit#documents" className="flex items-center gap-2">
                          <UploadCloud className="h-4 w-4" /> Manage
                        </Link>
                      </Button>
                      {resumeUploaded && token && freelancerProfile?.resumeUrl && (
                        <Button
                          type="button"
                          variant="secondary"
                          className="bg-emerald-500 text-white shadow-md shadow-emerald-200/70"
                          onClick={() =>
                            openSecureFileInNewTab(freelancerProfile.resumeUrl!, {
                              token,
                              fallbackName: 'resume.pdf',
                            })
                          }
                        >
                          View PDF
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-white to-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Skills</p>
                        <p className="text-lg font-semibold text-slate-900">{topSkills.length ? 'Core stack' : 'Add skills'}</p>
                      </div>
                      <Briefcase className="h-7 w-7 text-slate-400" />
                    </div>
                    {topSkills.length ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {topSkills.map((skill) => (
                          <div
                            key={skill.id ?? skill.skillId}
                            className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700"
                          >
                            <span>{skill.skill?.name ?? 'Unnamed skill'}</span>
                            <span className="text-xs uppercase tracking-wide text-emerald-500">{skill.verificationStatus ? skill.verificationStatus.toLowerCase() : 'unverified'}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white/60 p-4 text-sm text-slate-500">Document skills inside the editor.</p>
                    )}
                  </div>

                  <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/60 via-white to-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Education</p>
                        <p className="text-lg font-semibold text-slate-900">{educationEntries.length ? 'Recent study' : 'Add entries'}</p>
                      </div>
                      <GraduationCap className="h-7 w-7 text-slate-400" />
                    </div>
                    {educationEntries.length ? (
                      <div className="mt-4 space-y-3">
                        {educationEntries.map((entry) => (
                          <div key={entry.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
                            <p className="text-sm font-semibold text-slate-900">{entry.degree || 'Program'} · {entry.institution}</p>
                            <p className="text-xs text-slate-500">{formatEducationRange(entry.startDate, entry.endDate)}</p>
                            {entry.fieldOfStudy ? <p className="text-xs text-slate-500">{entry.fieldOfStudy}</p> : null}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4 text-sm text-slate-500">Log schools, bootcamps, or certifications.</p>
                    )}
                  </div>

                  <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 via-white to-white p-5 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Credentials</p>
                        <p className="text-lg font-semibold text-slate-900">{certificationCount ? 'Verified badges' : 'No credentials yet'}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700">{certificationCount} on file</Badge>
                        <Award className="h-7 w-7 text-amber-500" />
                      </div>
                    </div>
                    {certificationCount > 0 ? (
                      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.3fr),minmax(0,0.9fr)]">
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {certifications.slice(0, 3).map((cert) => {
                            const preview = certPreviewMap[cert.id];
                            return (
                              <div key={cert.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                                <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white">
                                  {preview ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={preview.url} alt={`${cert.name} credential`} className="h-28 w-full object-cover" loading="lazy" />
                                  ) : (
                                    <div className="flex h-28 items-center justify-center text-xs text-slate-400">
                                      {cert.credentialUrl ? 'Asset ready — open to review' : 'No credential attached'}
                                    </div>
                                  )}
                                </div>
                                <p className="mt-3 text-sm font-medium text-slate-900">{cert.name}</p>
                                <p className="text-xs text-slate-500">{cert.issuer}</p>
                              </div>
                            );
                          })}
                        </div>
                        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                          <ul className="space-y-3 text-sm text-slate-700">
                            {certifications.slice(0, 4).map((cert) => (
                              <li key={cert.id} className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="font-semibold text-slate-900">{cert.name}</p>
                                  <p className="text-xs text-slate-500">{cert.issuer}</p>
                                </div>
                                <Badge variant="outline" className="border-slate-200 text-xs text-slate-600">
                                  {cert.issueDate ? new Date(cert.issueDate).getFullYear() : 'Year TBD'}
                                </Badge>
                              </li>
                            ))}
                          </ul>
                          {certificationCount > 4 && (
                            <p className="mt-3 text-xs text-slate-500">+{certificationCount - 4} more credential{certificationCount - 4 === 1 ? '' : 's'} stored</p>
                          )}
                          <Button asChild variant="ghost" className="mt-4 w-full justify-center text-emerald-600">
                            <Link href="/profile/edit#documents" className="flex items-center gap-2">
                              <UploadCloud className="h-4 w-4" /> Manage credentials
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-5 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                        Add certifications or references inside the documents section.
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-slate-200 bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-slate-900">
                <BadgeCheck className="h-4 w-4 text-emerald-500" /> Identity & channels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Email</p>
                <p className="text-slate-900">{user.email}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Wallet</p>
                <p className="font-mono text-slate-900">{walletDisplayAddress ? shortWallet(walletDisplayAddress) : 'Not paired yet'}</p>
                {!user.walletAddress && walletDisplayAddress ? (
                  <p className="text-xs text-slate-500">Connected this session — save it in edit mode to persist.</p>
                ) : null}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Created</p>
                <p className="text-slate-900">{new Date(user.createdAt).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-slate-200 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base text-slate-900">
                Completion checklist
                <Button variant="ghost" size="sm" onClick={refreshProfile} disabled={isRefreshing} className="text-xs text-slate-500">
                  <Clock3 className={`mr-2 h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} /> Sync
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {taskList.map((task) => (
                <div key={task.label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{task.label}</p>
                    <p className="text-xs text-slate-500">{task.complete ? 'Looks great' : 'Required for Module 1 completion'}</p>
                  </div>
                  {task.complete ? (
                    <Shield className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <Clock3 className="h-5 w-5 text-amber-500" />
                  )}
                </div>
              ))}
              <p className="text-xs text-slate-500">
                Ready to edit? <Link href="/profile/edit" className="font-semibold text-emerald-600">Jump to the editor →</Link>
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-slate-900">
                <PenLine className="h-4 w-4 text-slate-500" /> Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              {activityCards.map((card) => (
                <div key={card.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{card.label}</p>
                  <p className="text-slate-900">{card.body}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
