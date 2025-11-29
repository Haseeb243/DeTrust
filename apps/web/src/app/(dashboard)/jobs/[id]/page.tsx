'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  MapPin,
  Send,
  Shield,
  Sparkles,
  Users,
  XCircle,
} from 'lucide-react';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Textarea } from '@/components/ui';
import { Spinner } from '@/components/ui/spinner';
import { jobApi, proposalApi, type Job, type CreateProposalInput } from '@/lib/api';
import { useAuthStore } from '@/store';
import { cn } from '@/lib/utils';

const formatBudget = (job: Job) => {
  if (job.type === 'FIXED_PRICE') {
    return job.budget ? `$${job.budget.toLocaleString()}` : 'Budget TBD';
  }
  if (job.hourlyRateMin && job.hourlyRateMax) {
    return `$${job.hourlyRateMin} - $${job.hourlyRateMax}/hr`;
  }
  return 'Rate TBD';
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showProposalForm, setShowProposalForm] = useState(false);

  const [proposalData, setProposalData] = useState<CreateProposalInput>({
    coverLetter: '',
    proposedRate: 0,
    estimatedDuration: '',
  });

  const isClient = user?.role === 'CLIENT';
  const isFreelancer = user?.role === 'FREELANCER';
  const isOwner = job?.clientId === user?.id;
  const hasSubmittedProposal = job?.proposals && job.proposals.length > 0;

  const fetchJob = useCallback(async () => {
    setLoading(true);
    try {
      const response = await jobApi.getJob(jobId);
      if (response.success && response.data) {
        setJob(response.data);
        // Set default proposed rate based on job budget
        if (response.data.type === 'FIXED_PRICE' && response.data.budget) {
          setProposalData((prev) => ({ ...prev, proposedRate: response.data!.budget! }));
        } else if (response.data.hourlyRateMin) {
          setProposalData((prev) => ({ ...prev, proposedRate: response.data!.hourlyRateMin! }));
        }
      } else {
        toast.error('Job not found');
        router.push('/jobs');
      }
    } catch (error) {
      toast.error('Failed to load job');
    } finally {
      setLoading(false);
    }
  }, [jobId, router]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  const handleSubmitProposal = async () => {
    if (!proposalData.coverLetter.trim()) {
      toast.error('Please write a cover letter');
      return;
    }
    if (proposalData.coverLetter.length < 50) {
      toast.error('Cover letter must be at least 50 characters');
      return;
    }
    if (!proposalData.proposedRate || proposalData.proposedRate <= 0) {
      toast.error('Please enter a valid rate');
      return;
    }

    setSubmitting(true);
    try {
      const response = await proposalApi.createProposal(jobId, proposalData);
      if (response.success) {
        toast.success('Proposal submitted successfully!');
        setShowProposalForm(false);
        fetchJob(); // Refresh to show updated proposal status
      } else {
        toast.error(response.error?.message || 'Failed to submit proposal');
      }
    } catch (error) {
      toast.error('Failed to submit proposal');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <XCircle className="h-12 w-12 text-slate-300" />
        <h3 className="mt-4 text-lg font-semibold text-slate-900">Job not found</h3>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/jobs">Back to Jobs</Link>
        </Button>
      </div>
    );
  }

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
          {/* Job Header */}
          <Card className="border-slate-200 bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      className={cn(
                        'text-xs',
                        job.status === 'OPEN'
                          ? 'bg-emerald-100 text-emerald-700'
                          : job.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-700'
                      )}
                    >
                      {job.status.replace('_', ' ')}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs',
                        job.type === 'FIXED_PRICE'
                          ? 'border-blue-200 bg-blue-50 text-blue-700'
                          : 'border-purple-200 bg-purple-50 text-purple-700'
                      )}
                    >
                      {job.type === 'FIXED_PRICE' ? 'Fixed Price' : 'Hourly'}
                    </Badge>
                    {job.experienceLevel && (
                      <Badge variant="outline" className="border-slate-200 text-xs text-slate-600">
                        {job.experienceLevel.toLowerCase()}
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-2xl font-semibold text-slate-900">{job.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Posted {formatDate(job.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {job._count?.proposals || job.proposalCount || 0} proposals
                    </span>
                    {job.deadline && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Due {formatDate(job.deadline)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold text-slate-900">{formatBudget(job)}</div>
                  {job.estimatedHours && (
                    <div className="text-sm text-slate-500">~{job.estimatedHours} hours</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card className="border-slate-200 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                <FileText className="h-5 w-5 text-emerald-500" />
                Job Description
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p className="whitespace-pre-wrap text-slate-700">{job.description}</p>
            </CardContent>
          </Card>

          {/* Required Skills */}
          <Card className="border-slate-200 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                <Sparkles className="h-5 w-5 text-emerald-500" />
                Required Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((js) => (
                  <Badge
                    key={js.id}
                    variant="secondary"
                    className="bg-slate-100 px-3 py-1 text-slate-700"
                  >
                    {js.skill.name}
                    {js.isRequired && (
                      <span className="ml-1 text-emerald-600">*</span>
                    )}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Proposal Form (Freelancers Only) */}
          {isFreelancer && job.status === 'OPEN' && !hasSubmittedProposal && (
            <Card className="border-slate-200 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                  <Send className="h-5 w-5 text-emerald-500" />
                  Submit Your Proposal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!showProposalForm ? (
                  <div className="text-center">
                    <p className="mb-4 text-slate-600">
                      Interested in this job? Submit a proposal to apply.
                    </p>
                    <Button
                      onClick={() => setShowProposalForm(true)}
                      className="bg-emerald-500 text-white hover:bg-emerald-600"
                    >
                      Write Proposal
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Cover Letter */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Cover Letter *
                      </label>
                      <Textarea
                        value={proposalData.coverLetter}
                        onChange={(e) =>
                          setProposalData((prev) => ({ ...prev, coverLetter: e.target.value }))
                        }
                        placeholder="Introduce yourself and explain why you're a great fit for this job..."
                        rows={6}
                        className="border-slate-200"
                      />
                      <p className="mt-1 text-xs text-slate-500">
                        {proposalData.coverLetter.length}/50 characters minimum
                      </p>
                    </div>

                    {/* Proposed Rate */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Your {job.type === 'FIXED_PRICE' ? 'Bid' : 'Hourly Rate'} ($) *
                      </label>
                      <input
                        type="number"
                        value={proposalData.proposedRate || ''}
                        onChange={(e) =>
                          setProposalData((prev) => ({
                            ...prev,
                            proposedRate: Number(e.target.value),
                          }))
                        }
                        placeholder={job.type === 'FIXED_PRICE' ? 'Enter your bid' : 'Enter your hourly rate'}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2"
                      />
                    </div>

                    {/* Estimated Duration */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Estimated Duration
                      </label>
                      <input
                        type="text"
                        value={proposalData.estimatedDuration || ''}
                        onChange={(e) =>
                          setProposalData((prev) => ({
                            ...prev,
                            estimatedDuration: e.target.value,
                          }))
                        }
                        placeholder="e.g., 2 weeks, 1 month"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowProposalForm(false)}
                        className="border-slate-200"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSubmitProposal}
                        disabled={submitting}
                        className="bg-emerald-500 text-white hover:bg-emerald-600"
                      >
                        {submitting ? <Spinner size="sm" /> : 'Submit Proposal'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Already Submitted */}
          {isFreelancer && hasSubmittedProposal && (
            <Card className="border-emerald-200 bg-emerald-50">
              <CardContent className="flex items-center gap-3 p-4">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-medium text-emerald-900">Proposal Submitted</p>
                  <p className="text-sm text-emerald-700">
                    Status: {job.proposals?.[0]?.status}
                  </p>
                </div>
                <Button asChild variant="outline" className="ml-auto border-emerald-200">
                  <Link href="/proposals">View My Proposals</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Info */}
          <Card className="border-slate-200 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-base text-slate-900">About the Client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                  {job.client?.avatarUrl ? (
                    <Image
                      src={job.client.avatarUrl}
                      alt={job.client.name || 'Client'}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-slate-500">
                      {job.client?.name?.[0]?.toUpperCase() || 'C'}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-slate-900">
                    {job.client?.name || 'Anonymous Client'}
                  </p>
                  {job.client?.clientProfile?.companyName && (
                    <p className="text-sm text-slate-500">
                      {job.client.clientProfile.companyName}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Shield className="h-4 w-4 text-emerald-500" />
                    Trust Score
                  </span>
                  <span className="font-medium text-slate-900">
                    {job.client?.clientProfile?.trustScore || 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Jobs Posted</span>
                  <span className="font-medium text-slate-900">
                    {job.client?.clientProfile?.jobsPosted || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Hire Rate</span>
                  <span className="font-medium text-slate-900">
                    {job.client?.clientProfile?.hireRate || 0}%
                  </span>
                </div>
                {job.client?.clientProfile?.paymentVerified && (
                  <div className="flex items-center gap-1 text-sm text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                    Payment Verified
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Job Summary */}
          <Card className="border-slate-200 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-base text-slate-900">Job Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Category</span>
                <span className="font-medium text-slate-900">{job.category}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Job Type</span>
                <span className="font-medium text-slate-900">
                  {job.type === 'FIXED_PRICE' ? 'Fixed Price' : 'Hourly'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Budget</span>
                <span className="font-medium text-slate-900">{formatBudget(job)}</span>
              </div>
              {job.experienceLevel && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Experience</span>
                  <span className="font-medium capitalize text-slate-900">
                    {job.experienceLevel.toLowerCase()}
                  </span>
                </div>
              )}
              {job.deadline && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Deadline</span>
                  <span className="font-medium text-slate-900">{formatDate(job.deadline)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Owner Actions */}
          {isOwner && (
            <Card className="border-slate-200 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-base text-slate-900">Manage Job</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full bg-emerald-500 text-white hover:bg-emerald-600">
                  <Link href={`/jobs/${job.id}/proposals`}>
                    View Proposals ({job._count?.proposals || job.proposalCount || 0})
                  </Link>
                </Button>
                {job.status === 'DRAFT' && (
                  <Button asChild variant="outline" className="w-full border-slate-200">
                    <Link href={`/jobs/${job.id}/edit`}>Edit Job</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
