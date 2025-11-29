'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Filter,
  MapPin,
  Search,
  Shield,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';

import { SecureAvatar } from '@/components/secure-avatar';
import { Badge, Button, Card, CardContent, Input } from '@/components/ui';
import { Spinner } from '@/components/ui/spinner';
import { userApi, skillApi, type User, type SkillSummary } from '@/lib/api';
import { useAuthStore } from '@/store';
import { cn } from '@/lib/utils';

const SORT_OPTIONS = [
  { value: 'trustScore', label: 'Trust Score' },
  { value: 'avgRating', label: 'Rating' },
  { value: 'completedJobs', label: 'Jobs Completed' },
  { value: 'createdAt', label: 'Newest' },
];

export default function TalentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();

  const [freelancers, setFreelancers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<SkillSummary[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  const [filters, setFilters] = useState({
    page: Number(searchParams.get('page')) || 1,
    limit: 12,
    search: searchParams.get('search') || '',
    skills: searchParams.get('skills') || '',
    minTrustScore: searchParams.get('minTrustScore') ? Number(searchParams.get('minTrustScore')) : undefined,
    minRating: searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined,
    sort: (searchParams.get('sort') as 'trustScore' | 'avgRating' | 'completedJobs' | 'createdAt') || 'trustScore',
    order: (searchParams.get('order') as 'asc' | 'desc') || 'desc',
  });

  const fetchFreelancers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userApi.searchFreelancers(filters);

      if (response.success && response.data) {
        setFreelancers(response.data.items);
        setPagination({
          total: response.data.total,
          page: response.data.page,
          totalPages: response.data.totalPages,
          hasNext: response.data.hasNext,
          hasPrev: response.data.hasPrev,
        });
      }
    } catch (error) {
      toast.error('Failed to load freelancers');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchSkills = useCallback(async () => {
    try {
      const response = await skillApi.list({ limit: 100 });
      if (response.success && response.data) {
        setSkills(response.data.items || []);
      }
    } catch (error) {
      console.error('Failed to load skills:', error);
    }
  }, []);

  useEffect(() => {
    fetchFreelancers();
  }, [fetchFreelancers]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const updated = { ...filters, ...newFilters, page: 1 };
    setFilters(updated);

    // Update URL params
    const params = new URLSearchParams();
    Object.entries(updated).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && key !== 'limit') {
        params.set(key, String(value));
      }
    });
    router.push(`/talent?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Find Talent</h1>
          <p className="text-slate-600">
            Discover verified freelancers with proven track records
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="border-slate-200 bg-white shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="search"
                placeholder="Search by name, title, or skills..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="pl-10 border-slate-200"
              />
            </div>

            {/* Sort */}
            <select
              value={filters.sort}
              onChange={(e) => updateFilters({ sort: e.target.value as typeof filters.sort })}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Sort by {opt.label}
                </option>
              ))}
            </select>

            {/* Toggle Filters */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2 border-slate-200"
            >
              <Filter className="h-4 w-4" />
              Filters
              {(filters.skills || filters.minTrustScore || filters.minRating) && (
                <Badge className="ml-1 bg-emerald-100 text-emerald-700">Active</Badge>
              )}
            </Button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 grid gap-4 border-t border-slate-100 pt-4 md:grid-cols-3">
              {/* Skills */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Skills
                </label>
                <select
                  value={filters.skills}
                  onChange={(e) => updateFilters({ skills: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  <option value="">All Skills</option>
                  {skills.map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      {skill.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Min Trust Score */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Min Trust Score
                </label>
                <select
                  value={filters.minTrustScore || ''}
                  onChange={(e) =>
                    updateFilters({
                      minTrustScore: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  <option value="">Any</option>
                  <option value="50">50%+</option>
                  <option value="70">70%+</option>
                  <option value="80">80%+</option>
                  <option value="90">90%+</option>
                </select>
              </div>

              {/* Min Rating */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Min Rating
                </label>
                <select
                  value={filters.minRating || ''}
                  onChange={(e) =>
                    updateFilters({
                      minRating: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  <option value="">Any</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                </select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Freelancer Grid */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : freelancers.length === 0 ? (
        <Card className="border-slate-200 bg-white shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No freelancers found</h3>
            <p className="mt-2 text-slate-600">Try adjusting your filters or search terms</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {freelancers.map((freelancer) => (
              <Link key={freelancer.id} href={`/talent/${freelancer.id}`}>
                <Card className="h-full border-slate-200 bg-white shadow-md transition-all hover:border-emerald-200 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <SecureAvatar
                        src={freelancer.avatarUrl}
                        alt={freelancer.name || 'Freelancer'}
                        size={64}
                        fallbackInitial={freelancer.name?.[0] || 'F'}
                        containerClassName="h-16 w-16 overflow-hidden rounded-full border-2 border-emerald-100 bg-slate-100"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">
                          {freelancer.name || 'Anonymous'}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {freelancer.freelancerProfile?.title || 'Freelancer'}
                        </p>
                        {freelancer.freelancerProfile?.location && (
                          <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                            <MapPin className="h-3 w-3" />
                            {freelancer.freelancerProfile.location}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-sm font-semibold text-slate-900">
                          <Shield className="h-4 w-4 text-emerald-500" />
                          {freelancer.freelancerProfile?.trustScore || 0}%
                        </div>
                        <p className="text-xs text-slate-500">Trust</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-sm font-semibold text-slate-900">
                          <Star className="h-4 w-4 text-amber-500" />
                          {Number(freelancer.freelancerProfile?.avgRating || 0).toFixed(1)}
                        </div>
                        <p className="text-xs text-slate-500">Rating</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-sm font-semibold text-slate-900">
                          <Briefcase className="h-4 w-4 text-blue-500" />
                          {freelancer.freelancerProfile?.completedJobs || 0}
                        </div>
                        <p className="text-xs text-slate-500">Jobs</p>
                      </div>
                    </div>

                    {/* Skills */}
                    {freelancer.freelancerProfile?.skills && freelancer.freelancerProfile.skills.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1">
                        {freelancer.freelancerProfile.skills.slice(0, 3).map((s, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="bg-slate-100 text-xs text-slate-600"
                          >
                            {s.skill?.name}
                          </Badge>
                        ))}
                        {freelancer.freelancerProfile.skills.length > 3 && (
                          <Badge variant="secondary" className="bg-slate-100 text-xs text-slate-500">
                            +{freelancer.freelancerProfile.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Rate */}
                    {freelancer.freelancerProfile?.hourlyRate && (
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-slate-500">Hourly Rate</span>
                        <span className="font-semibold text-slate-900">
                          ${freelancer.freelancerProfile.hourlyRate}/hr
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-slate-600">
                Showing {(pagination.page - 1) * 12 + 1} to{' '}
                {Math.min(pagination.page * 12, pagination.total)} of {pagination.total} freelancers
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPrev}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  className="border-slate-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNext}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  className="border-slate-200"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
