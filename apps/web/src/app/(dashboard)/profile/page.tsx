'use client';

import { Clock3 } from 'lucide-react';

import { Button, Card, CardContent } from '@/components/ui';
import { Spinner } from '@/components/ui/spinner';
import { shortWallet } from '@/lib/profile-utils';
import { useProfileViewData } from '@/hooks/use-profile-view-data';

import { ProfileHero } from '@/components/profile/profile-hero';
import { ProfileAboutCard } from '@/components/profile/profile-about-card';
import { ProfileDossierCard } from '@/components/profile/profile-dossier-card';
import { ProfileIdentityCard } from '@/components/profile/profile-identity-card';
import { ProfileChecklistCard } from '@/components/profile/profile-checklist-card';
import { ProfileActivityCard } from '@/components/profile/profile-activity-card';

export default function ProfileViewPage() {
  const d = useProfileViewData();

  if (!d.profile && d.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!d.profile) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center space-y-4 py-10">
          <p className="text-center text-sm text-dt-text-muted">We couldn&apos;t load your profile. Try again.</p>
          <Button onClick={() => void d.refetch()} className="gap-2">
            <Clock3 className="h-4 w-4" />Reload
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-10">
      <ProfileHero
        profile={d.profile} completion={d.completion} profileComplete={d.profileComplete}
        avatarObjectUrl={d.avatarObjectUrl} avatarLoading={d.avatarLoading}
        highlightStats={d.highlightStats} walletBadgeLabel={d.walletBadgeLabel}
        role={d.role} isFreelancer={d.isFreelancer}
        freelancerProfile={d.freelancerProfile} clientProfile={d.clientProfile} languages={d.languages}
      />

      {d.error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{d.error.message}</div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.65fr,1fr]">
        <div className="space-y-6">
          <ProfileAboutCard isFreelancer={d.isFreelancer} freelancerProfile={d.freelancerProfile} clientProfile={d.clientProfile} />
          {d.isFreelancer && d.freelancerProfile && (
            <ProfileDossierCard
              freelancerProfile={d.freelancerProfile} isAuthenticated={d.isAuthenticated}
              topSkills={d.topSkills} educationEntries={d.educationEntries}
              certifications={d.certifications} certPreviewMap={d.certPreviewMap}
              resumeUploaded={d.resumeUploaded} formatEducationRange={d.formatEducationRange}
            />
          )}
          <ProfileIdentityCard profile={d.profile} walletDisplayAddress={d.walletDisplayAddress} shortWallet={shortWallet} />
        </div>
        <div className="space-y-6">
          <ProfileChecklistCard taskList={d.taskList} onRefetch={() => void d.refetch()} isFetching={d.isFetching} />
          <ProfileActivityCard activityCards={d.activityCards} />
        </div>
      </div>
    </div>
  );
}
