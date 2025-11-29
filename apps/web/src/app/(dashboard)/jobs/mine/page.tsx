'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Briefcase,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Eye,
  MoreVertical,
  PenLine,
  Plus,
  Send,
  Trash2,
  Users,
  XCircle,
} from 'lucide-react';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Spinner } from '@/components/ui/spinner';
import { jobApi, type Job, type GetJobsParams, type JobStatus } from '@/lib/api';
import { useAuthStore } from '@/store';
import { cn } from '@/lib/utils';

const STATUS_COLORS: Record<JobStatus, string> = {
  DRAFT: 'bg-slate-100 text-slate-700',
  OPEN: 'bg-emerald-100 text-emerald-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  DISPUTED: 'bg-amber-100 text-amber-700',
};

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
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString();
};

const TABS: { value: JobStatus | ''; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'DRAFT', label: 'Drafts' },
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default function MyJobsPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<JobStatus | ''>('');
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  const fetchJobs = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params: GetJobsParams = {
        page,
        limit: 10,
        sort: 'createdAt',
        order: 'desc',
      };
      if (activeTab) {
        params.status = activeTab;
      }

      const response = await jobApi.getMyJobs(params);

      if (response.success && response.data) {
        setJobs(response.data.items);
        setPagination({
          total: response.data.total,
          page: response.data.page,
          totalPages: response.data.totalPages,
          hasNext: response.data.hasNext,
          hasPrev: response.data.hasPrev,
        });
      }
    } catch (error) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (user?.role !== 'CLIENT') {
      toast.error('Only clients can access this page');
      router.push('/dashboard');
      return;
    }
    fetchJobs();
  }, [user?.role, router, fetchJobs]);

  const handlePublish = async (jobId: string) => {
    try {
      const response = await jobApi.publishJob(jobId);
      if (response.success) {
        toast.success('Job published successfully!');
        fetchJobs(pagination.page);
      } else {
        toast.error(response.error?.message || 'Failed to publish job');
      }
    } catch (error) {
      toast.error('Failed to publish job');
    }
  };

  const handleCancel = async (jobId: string) => {
    if (!confirm('Are you sure you want to cancel this job?')) return;

    try {
      const response = await jobApi.cancelJob(jobId);
      if (response.success) {
        toast.success('Job cancelled');
        fetchJobs(pagination.page);
      } else {
        toast.error(response.error?.message || 'Failed to cancel job');
      }
    } catch (error) {
      toast.error('Failed to cancel job');
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this draft?')) return;

    try {
      const response = await jobApi.deleteJob(jobId);
      if (response.success) {
        toast.success('Draft deleted');
        fetchJobs(pagination.page);
      } else {
        toast.error(response.error?.message || 'Failed to delete draft');
      }
    } catch (error) {
      toast.error('Failed to delete draft');
    }
  };

  if (user?.role !== 'CLIENT') {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">My Jobs</h1>
          <p className="text-slate-600">Manage your job postings and review proposals</p>
        </div>
        <Button asChild className="gap-2 bg-emerald-500 text-white hover:bg-emerald-600">
          <Link href="/jobs/new">
            <Plus className="h-4 w-4" />
            Post New Job
          </Link>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setActiveTab(tab.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className={cn(
              'whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition',
              activeTab === tab.value
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Job Listings */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : jobs.length === 0 ? (
        <Card className="border-slate-200 bg-white shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Briefcase className="h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              {activeTab ? `No ${activeTab.toLowerCase().replace('_', ' ')} jobs` : 'No jobs yet'}
            </h3>
            <p className="mt-2 text-slate-600">
              {activeTab === 'DRAFT'
                ? 'You have no draft jobs'
                : 'Post your first job to start finding talent'}
            </p>
            <Button asChild className="mt-4 bg-emerald-500 text-white hover:bg-emerald-600">
              <Link href="/jobs/new">Post a Job</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="border-slate-200 bg-white shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    {/* Title and Status */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="text-lg font-semibold text-slate-900 hover:text-emerald-600"
                      >
                        {job.title}
                      </Link>
                      <Badge className={STATUS_COLORS[job.status]}>
                        {job.status.replace('_', ' ')}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-xs',
                          job.type === 'FIXED_PRICE'
                            ? 'border-blue-200 text-blue-700'
                            : 'border-purple-200 text-purple-700'
                        )}
                      >
                        {job.type === 'FIXED_PRICE' ? 'Fixed' : 'Hourly'}
                      </Badge>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {formatBudget(job)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {job._count?.proposals || job.proposalCount || 0} proposals
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {job.viewCount || 0} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDate(job.createdAt)}
                      </span>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1">
                      {job.skills.slice(0, 4).map((js) => (
                        <Badge
                          key={js.id}
                          variant="secondary"
                          className="bg-slate-100 text-xs text-slate-600"
                        >
                          {js.skill.name}
                        </Badge>
                      ))}
                      {job.skills.length > 4 && (
                        <Badge variant="secondary" className="bg-slate-100 text-xs text-slate-500">
                          +{job.skills.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {job.status === 'DRAFT' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handlePublish(job.id)}
                          className="gap-1 bg-emerald-500 text-white hover:bg-emerald-600"
                        >
                          <Send className="h-3 w-3" />
                          Publish
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          className="gap-1 border-slate-200"
                        >
                          <Link href={`/jobs/${job.id}/edit`}>
                            <PenLine className="h-3 w-3" />
                            Edit
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(job.id)}
                          className="gap-1 border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                    {job.status === 'OPEN' && (
                      <>
                        <Button
                          size="sm"
                          asChild
                          className="gap-1 bg-emerald-500 text-white hover:bg-emerald-600"
                        >
                          <Link href={`/jobs/${job.id}/proposals`}>
                            <Users className="h-3 w-3" />
                            Proposals ({job._count?.proposals || job.proposalCount || 0})
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancel(job.id)}
                          className="gap-1 border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="h-3 w-3" />
                          Cancel
                        </Button>
                      </>
                    )}
                    {job.status === 'IN_PROGRESS' && (
                      <Button
                        size="sm"
                        asChild
                        className="gap-1 bg-blue-500 text-white hover:bg-blue-600"
                      >
                        <Link href={`/contracts/${job.id}`}>View Contract</Link>
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      asChild
                      className="text-slate-500"
                    >
                      <Link href={`/jobs/${job.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-slate-600">
                Showing {(pagination.page - 1) * 10 + 1} to{' '}
                {Math.min(pagination.page * 10, pagination.total)} of {pagination.total} jobs
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPrev}
                  onClick={() => fetchJobs(pagination.page - 1)}
                  className="border-slate-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNext}
                  onClick={() => fetchJobs(pagination.page + 1)}
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
