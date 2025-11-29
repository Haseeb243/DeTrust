'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Eye,
  MessageSquare,
  Shield,
  Sparkles,
  Star,
  ThumbsDown,
  ThumbsUp,
  Users,
  XCircle,
} from 'lucide-react';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Textarea } from '@/components/ui';
import { Spinner } from '@/components/ui/spinner';
import { jobApi, proposalApi, type Job, type Proposal, type GetProposalsParams } from '@/lib/api';
import { useAuthStore } from '@/store';
import { cn } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  SHORTLISTED: 'bg-blue-100 text-blue-700',
  ACCEPTED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-700',
  WITHDRAWN: 'bg-slate-100 text-slate-700',
};

const formatDate = (date: string) => {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString();
};

export default function JobProposalsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  const [acceptingProposal, setAcceptingProposal] = useState<string | null>(null);
  const [milestones, setMilestones] = useState([
    { title: 'Project Completion', description: '', amount: 0, dueDate: '' },
  ]);

  const fetchJob = useCallback(async () => {
    try {
      const response = await jobApi.getJob(jobId);
      if (response.success && response.data) {
        setJob(response.data);
        // Set default milestone amount from budget
        if (response.data.budget) {
          setMilestones([{ title: 'Project Completion', description: '', amount: response.data.budget, dueDate: '' }]);
        }
      }
    } catch (error) {
      console.error('Failed to load job:', error);
    }
  }, [jobId]);

  const fetchProposals = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params: GetProposalsParams = {
        page,
        limit: 10,
        sort: 'createdAt',
        order: 'desc',
      };

      const response = await proposalApi.getJobProposals(jobId, params);

      if (response.success && response.data) {
        setProposals(response.data.items);
        setPagination({
          total: response.data.total,
          page: response.data.page,
          totalPages: response.data.totalPages,
          hasNext: response.data.hasNext,
          hasPrev: response.data.hasPrev,
        });
      }
    } catch (error) {
      toast.error('Failed to load proposals');
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    if (user?.role !== 'CLIENT') {
      toast.error('Only clients can access this page');
      router.push('/jobs');
      return;
    }
    fetchJob();
    fetchProposals();
  }, [user?.role, router, fetchJob, fetchProposals]);

  const handleShortlist = async (proposalId: string) => {
    setActionLoading(proposalId);
    try {
      const response = await proposalApi.shortlistProposal(proposalId);
      if (response.success) {
        toast.success('Proposal shortlisted');
        fetchProposals(pagination.page);
      } else {
        toast.error(response.error?.message || 'Failed to shortlist proposal');
      }
    } catch (error) {
      toast.error('Failed to shortlist proposal');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (proposalId: string) => {
    if (!confirm('Are you sure you want to reject this proposal?')) return;
    setActionLoading(proposalId);
    try {
      const response = await proposalApi.rejectProposal(proposalId);
      if (response.success) {
        toast.success('Proposal rejected');
        fetchProposals(pagination.page);
      } else {
        toast.error(response.error?.message || 'Failed to reject proposal');
      }
    } catch (error) {
      toast.error('Failed to reject proposal');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAccept = async (proposalId: string) => {
    if (milestones.length === 0 || milestones.some(m => !m.title || m.amount <= 0)) {
      toast.error('Please add at least one valid milestone');
      return;
    }

    setActionLoading(proposalId);
    try {
      const response = await proposalApi.acceptProposal(proposalId, {
        milestones: milestones.map(m => ({
          title: m.title,
          description: m.description,
          amount: m.amount,
          dueDate: m.dueDate ? new Date(m.dueDate).toISOString() : undefined,
        })),
      });
      if (response.success) {
        toast.success('Proposal accepted! Contract created.');
        router.push('/contracts');
      } else {
        toast.error(response.error?.message || 'Failed to accept proposal');
      }
    } catch (error) {
      toast.error('Failed to accept proposal');
    } finally {
      setActionLoading(null);
      setAcceptingProposal(null);
    }
  };

  if (user?.role !== 'CLIENT') {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Proposals for: {job?.title || 'Loading...'}
          </h1>
          <p className="text-slate-600">
            {pagination.total} proposal{pagination.total !== 1 ? 's' : ''} received
          </p>
        </div>
      </div>

      {/* Proposals List */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : proposals.length === 0 ? (
        <Card className="border-slate-200 bg-white shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No proposals yet</h3>
            <p className="mt-2 text-slate-600">
              Proposals will appear here when freelancers apply
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <Card key={proposal.id} className="border-slate-200 bg-white shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-start gap-6">
                  {/* Freelancer Info */}
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-emerald-100 bg-slate-100">
                      {proposal.freelancer?.avatarUrl ? (
                        <Image
                          src={proposal.freelancer.avatarUrl}
                          alt={proposal.freelancer.name || 'Freelancer'}
                          width={56}
                          height={56}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-slate-500">
                          {proposal.freelancer?.name?.[0]?.toUpperCase() || 'F'}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {proposal.freelancer?.name || 'Anonymous Freelancer'}
                        </h3>
                        <Badge className={STATUS_COLORS[proposal.status]}>
                          {proposal.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500">
                        {proposal.freelancer?.freelancerProfile?.title || 'Freelancer'}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Shield className="h-4 w-4 text-emerald-500" />
                          {proposal.freelancer?.freelancerProfile?.trustScore || 0}% trust
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500" />
                          {proposal.freelancer?.freelancerProfile?.avgRating?.toFixed(1) || '0.0'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {proposal.freelancer?.freelancerProfile?.completedJobs || 0} jobs
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Proposal Details */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 font-semibold text-slate-900">
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                        ${proposal.proposedRate}
                        {job?.type === 'HOURLY' ? '/hr' : ''}
                      </span>
                      {proposal.estimatedDuration && (
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock className="h-4 w-4" />
                          {proposal.estimatedDuration}
                        </span>
                      )}
                      <span className="text-slate-400">
                        Submitted {formatDate(proposal.createdAt)}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 line-clamp-3">
                      {proposal.coverLetter}
                    </p>

                    {/* Skills */}
                    {proposal.freelancer?.freelancerProfile?.skills && (
                      <div className="flex flex-wrap gap-1">
                        {proposal.freelancer.freelancerProfile.skills.slice(0, 5).map((s, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="bg-slate-100 text-xs text-slate-600"
                          >
                            {s.skill?.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {proposal.status === 'PENDING' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => setAcceptingProposal(proposal.id)}
                          disabled={!!actionLoading}
                          className="gap-1 bg-emerald-500 text-white hover:bg-emerald-600"
                        >
                          <ThumbsUp className="h-3 w-3" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleShortlist(proposal.id)}
                          disabled={!!actionLoading}
                          className="gap-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          <Sparkles className="h-3 w-3" />
                          Shortlist
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(proposal.id)}
                          disabled={!!actionLoading}
                          className="gap-1 border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <ThumbsDown className="h-3 w-3" />
                          Reject
                        </Button>
                      </>
                    )}
                    {proposal.status === 'SHORTLISTED' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => setAcceptingProposal(proposal.id)}
                          disabled={!!actionLoading}
                          className="gap-1 bg-emerald-500 text-white hover:bg-emerald-600"
                        >
                          <ThumbsUp className="h-3 w-3" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(proposal.id)}
                          disabled={!!actionLoading}
                          className="gap-1 border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <ThumbsDown className="h-3 w-3" />
                          Reject
                        </Button>
                      </>
                    )}
                    {proposal.status === 'ACCEPTED' && (
                      <Button
                        size="sm"
                        asChild
                        className="gap-1 bg-emerald-500 text-white hover:bg-emerald-600"
                      >
                        <Link href="/contracts">View Contract</Link>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Accept Modal/Form */}
                {acceptingProposal === proposal.id && (
                  <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <h4 className="mb-4 font-semibold text-emerald-900">
                      Create Contract with Milestones
                    </h4>
                    <div className="space-y-4">
                      {milestones.map((milestone, index) => (
                        <div key={index} className="grid gap-3 rounded-lg border border-emerald-100 bg-white p-3 md:grid-cols-4">
                          <input
                            type="text"
                            value={milestone.title}
                            onChange={(e) => {
                              const updated = [...milestones];
                              updated[index].title = e.target.value;
                              setMilestones(updated);
                            }}
                            placeholder="Milestone title"
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          />
                          <input
                            type="number"
                            value={milestone.amount || ''}
                            onChange={(e) => {
                              const updated = [...milestones];
                              updated[index].amount = Number(e.target.value);
                              setMilestones(updated);
                            }}
                            placeholder="Amount ($)"
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          />
                          <input
                            type="date"
                            value={milestone.dueDate}
                            onChange={(e) => {
                              const updated = [...milestones];
                              updated[index].dueDate = e.target.value;
                              setMilestones(updated);
                            }}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          />
                          {milestones.length > 1 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setMilestones(milestones.filter((_, i) => i !== index))}
                              className="text-red-500"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setMilestones([...milestones, { title: '', description: '', amount: 0, dueDate: '' }])}
                          className="border-emerald-200"
                        >
                          Add Milestone
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setAcceptingProposal(null)}
                          className="border-slate-200"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAccept(proposal.id)}
                          disabled={!!actionLoading}
                          className="bg-emerald-500 text-white hover:bg-emerald-600"
                        >
                          {actionLoading === proposal.id ? <Spinner size="sm" /> : 'Confirm & Create Contract'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-slate-600">
                Showing {(pagination.page - 1) * 10 + 1} to{' '}
                {Math.min(pagination.page * 10, pagination.total)} of {pagination.total} proposals
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPrev}
                  onClick={() => fetchProposals(pagination.page - 1)}
                  className="border-slate-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNext}
                  onClick={() => fetchProposals(pagination.page + 1)}
                  className="border-slate-200"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
