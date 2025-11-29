'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Award,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Mail,
  MapPin,
  Shield,
  Sparkles,
  Star,
  XCircle,
} from 'lucide-react';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Spinner } from '@/components/ui/spinner';
import { userApi, type User } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function FreelancerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const freelancerId = params.id as string;

  const [freelancer, setFreelancer] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchFreelancer = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userApi.getUser(freelancerId);
      if (response.success && response.data) {
        setFreelancer(response.data);
      } else {
        toast.error('Freelancer not found');
        router.push('/talent');
      }
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [freelancerId, router]);

  useEffect(() => {
    fetchFreelancer();
  }, [fetchFreelancer]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!freelancer || freelancer.role !== 'FREELANCER') {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <XCircle className="h-12 w-12 text-slate-300" />
        <h3 className="mt-4 text-lg font-semibold text-slate-900">Profile not found</h3>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/talent">Back to Talent</Link>
        </Button>
      </div>
    );
  }

  const profile = freelancer.freelancerProfile;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="gap-2 text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="grid gap-6 lg:grid-cols-[1fr,380px]">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Profile Header */}
          <Card className="border-slate-200 bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-start gap-6">
                <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-emerald-100 bg-slate-100">
                  {freelancer.avatarUrl ? (
                    <Image
                      src={freelancer.avatarUrl}
                      alt={freelancer.name || 'Freelancer'}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-slate-500">
                      {freelancer.name?.[0]?.toUpperCase() || 'F'}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-semibold text-slate-900">
                    {freelancer.name || 'Anonymous Freelancer'}
                  </h1>
                  <p className="text-lg text-slate-600">
                    {profile?.title || 'Freelancer'}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    {profile?.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {profile.location}
                      </span>
                    )}
                    {profile?.availability && (
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-xs',
                          profile.availability === 'Full-time'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200'
                        )}
                      >
                        {profile.availability}
                      </Badge>
                    )}
                    {profile?.hourlyRate && (
                      <span className="font-semibold text-slate-900">
                        ${profile.hourlyRate}/hr
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-4 gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-2xl font-semibold text-slate-900">
                    <Shield className="h-6 w-6 text-emerald-500" />
                    {profile?.trustScore || 0}%
                  </div>
                  <p className="text-sm text-slate-500">Trust Score</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-2xl font-semibold text-slate-900">
                    <Star className="h-6 w-6 text-amber-500" />
                    {Number(profile?.avgRating || 0).toFixed(1)}
                  </div>
                  <p className="text-sm text-slate-500">Rating ({profile?.totalReviews || 0} reviews)</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-2xl font-semibold text-slate-900">
                    <Briefcase className="h-6 w-6 text-blue-500" />
                    {profile?.completedJobs || 0}
                  </div>
                  <p className="text-sm text-slate-500">Jobs Completed</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-2xl font-semibold text-slate-900">
                    <Sparkles className="h-6 w-6 text-purple-500" />
                    {profile?.aiCapabilityScore || 0}
                  </div>
                  <p className="text-sm text-slate-500">AI Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bio */}
          {profile?.bio && (
            <Card className="border-slate-200 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900">About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-slate-700">{profile.bio}</p>
              </CardContent>
            </Card>
          )}

          {/* Skills */}
          {profile?.skills && profile.skills.length > 0 && (
            <Card className="border-slate-200 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                  <Sparkles className="h-5 w-5 text-emerald-500" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((s, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="bg-slate-100 px-3 py-1 text-slate-700"
                    >
                      {s.skill?.name}
                      {s.yearsExperience && (
                        <span className="ml-1 text-xs text-slate-500">
                          ({s.yearsExperience}y)
                        </span>
                      )}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Education */}
          {profile?.education && profile.education.length > 0 && (
            <Card className="border-slate-200 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                  <GraduationCap className="h-5 w-5 text-emerald-500" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.education.map((edu) => (
                  <div key={edu.id} className="border-l-2 border-emerald-200 pl-4">
                    <h4 className="font-semibold text-slate-900">{edu.degree}</h4>
                    <p className="text-slate-600">{edu.institution}</p>
                    {edu.fieldOfStudy && (
                      <p className="text-sm text-slate-500">{edu.fieldOfStudy}</p>
                    )}
                    {(edu.startDate || edu.endDate) && (
                      <p className="text-sm text-slate-400">
                        {edu.startDate && new Date(edu.startDate).getFullYear()}
                        {edu.endDate && ` - ${new Date(edu.endDate).getFullYear()}`}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Certifications */}
          {profile?.certifications && profile.certifications.length > 0 && (
            <Card className="border-slate-200 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                  <Award className="h-5 w-5 text-emerald-500" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.certifications.map((cert) => (
                  <div key={cert.id} className="flex items-start gap-3 border-l-2 border-emerald-200 pl-4">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-900">{cert.name}</h4>
                      <p className="text-sm text-slate-600">{cert.issuer}</p>
                      {cert.issueDate && (
                        <p className="text-sm text-slate-400">
                          Issued {new Date(cert.issueDate).toLocaleDateString()}
                        </p>
                      )}
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-sm text-emerald-600 hover:underline"
                        >
                          View Credential <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact */}
          <Card className="border-slate-200 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-base text-slate-900">Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full bg-emerald-500 text-white hover:bg-emerald-600">
                <Link href={`/messages?to=${freelancer.id}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Message
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card className="border-slate-200 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-base text-slate-900">Availability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Status</span>
                <Badge
                  className={cn(
                    profile?.availability === 'Full-time'
                      ? 'bg-emerald-100 text-emerald-700'
                      : profile?.availability === 'Part-time'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-700'
                  )}
                >
                  {profile?.availability || 'Not specified'}
                </Badge>
              </div>
              {profile?.hourlyRate && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Hourly Rate</span>
                  <span className="font-semibold text-slate-900">${profile.hourlyRate}/hr</span>
                </div>
              )}
              {profile?.timezone && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Timezone</span>
                  <span className="text-slate-900">{profile.timezone}</span>
                </div>
              )}
              {profile?.languages && profile.languages.length > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Languages</span>
                  <span className="text-slate-900">{profile.languages.join(', ')}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Portfolio Links */}
          {profile?.portfolioLinks && profile.portfolioLinks.length > 0 && (
            <Card className="border-slate-200 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-base text-slate-900">Portfolio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {profile.portfolioLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-emerald-600 hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {new URL(link).hostname}
                  </a>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
