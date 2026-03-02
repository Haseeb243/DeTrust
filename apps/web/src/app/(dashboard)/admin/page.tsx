'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import {
  Users,
  Briefcase,
  FileText,
  Shield,
  Star,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  ArrowUpRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
  User,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Spinner } from '@/components/ui/spinner';
import { useAdminStats, useAdminTrends, useAdminActivity } from '@/hooks/queries/use-admin';
import { cn } from '@/lib/utils';
import type { PlatformStats, MonthlyTrend, ActivityItem } from '@/lib/api/admin';

// =============================================================================
// CHART TOOLTIP
// =============================================================================

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-dt-border bg-dt-surface px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-dt-text">{label}</p>
      {payload.map((item) => (
        <p key={item.name} className="text-xs" style={{ color: item.color }}>
          {item.name}: {typeof item.value === 'number' && item.name.toLowerCase().includes('revenue')
            ? `$${item.value.toLocaleString()}`
            : item.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

// =============================================================================
// KPI CARD
// =============================================================================

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  href?: string;
  color?: string;
}

function KpiCard({ title, value, subtitle, icon, trend, trendLabel, href, color = 'emerald' }: KpiCardProps) {
  const colorMap: Record<string, string> = {
    emerald: 'from-emerald-500 to-emerald-600',
    blue: 'from-blue-500 to-blue-600',
    violet: 'from-violet-500 to-violet-600',
    amber: 'from-amber-500 to-amber-600',
    rose: 'from-rose-500 to-rose-600',
    cyan: 'from-cyan-500 to-cyan-600',
  };

  const content = (
    <Card className="group relative overflow-hidden border-dt-border bg-dt-surface transition-all hover:shadow-lg dark:hover:shadow-slate-900/50">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-dt-text-muted">{title}</p>
            <p className="mt-2 text-2xl font-bold text-dt-text">{typeof value === 'number' ? value.toLocaleString() : value}</p>
            {subtitle && <p className="mt-0.5 text-xs text-dt-text-muted">{subtitle}</p>}
            {trend !== undefined && (
              <div className="mt-2 flex items-center gap-1">
                {trend >= 0 ? (
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
                )}
                <span className={cn('text-xs font-medium', trend >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')}>
                  {trend > 0 ? '+' : ''}{trend}%
                </span>
                {trendLabel && <span className="text-xs text-dt-text-muted">{trendLabel}</span>}
              </div>
            )}
          </div>
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg', colorMap[color])}>
            {icon}
          </div>
        </div>
        {href && (
          <div className="mt-3 flex items-center gap-1 text-xs font-medium text-emerald-600 opacity-0 transition group-hover:opacity-100 dark:text-emerald-400">
            View details <ArrowUpRight className="h-3 w-3" />
          </div>
        )}
      </CardContent>
    </Card>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

// =============================================================================
// PIE CHART COLORS
// =============================================================================

const JOB_COLORS = ['#22c55e', '#3b82f6', '#eab308', '#f43f5e', '#8b5cf6', '#64748b'];
const USER_COLORS = ['#3b82f6', '#22c55e', '#f59e0b'];

// =============================================================================
// ACTIVITY ITEM
// =============================================================================

const activityIcons: Record<string, React.ReactNode> = {
  user: <User className="h-4 w-4" />,
  job: <Briefcase className="h-4 w-4" />,
  dispute: <Shield className="h-4 w-4" />,
  contract: <FileText className="h-4 w-4" />,
};

const activityColors: Record<string, string> = {
  user: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  job: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  dispute: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  contract: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
};

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// =============================================================================
// PAGE
// =============================================================================

export default function AdminDashboard() {
  const { data: stats, isLoading: loadingStats } = useAdminStats();
  const { data: trends, isLoading: loadingTrends } = useAdminTrends();
  const { data: activity, isLoading: loadingActivity } = useAdminActivity(12);

  const userGrowth = useMemo(() => {
    if (!stats) return 0;
    const prev = stats.users.newLastMonth || 1;
    return Math.round(((stats.users.newThisMonth - prev) / prev) * 100);
  }, [stats]);

  const jobStatusData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: 'Open', value: stats.jobs.open },
      { name: 'In Progress', value: stats.jobs.inProgress },
      { name: 'Completed', value: stats.jobs.completed },
      { name: 'Cancelled', value: stats.jobs.cancelled },
      { name: 'Disputed', value: stats.jobs.disputed },
    ].filter((d) => d.value > 0);
  }, [stats]);

  const userRoleData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: 'Freelancers', value: stats.users.freelancers },
      { name: 'Clients', value: stats.users.clients },
      { name: 'Admins', value: stats.users.admins },
    ].filter((d) => d.value > 0);
  }, [stats]);

  if (loadingStats) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <AlertTriangle className="mb-4 h-12 w-12 text-dt-text-muted opacity-40" />
        <h2 className="text-lg font-medium text-dt-text">Failed to load dashboard</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-dt-text">
            <Activity className="h-6 w-6 text-emerald-500" />
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-dt-text-muted">
            Platform overview and key metrics
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-dt-border bg-dt-surface px-3 py-1.5 text-xs text-dt-text-muted">
          <Clock className="h-3.5 w-3.5" /> Auto-refreshes every minute
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <KpiCard
          title="Total Users"
          value={stats.users.total}
          subtitle={`${stats.users.active} active · ${stats.users.suspended} suspended`}
          icon={<Users className="h-5 w-5" />}
          trend={userGrowth}
          trendLabel="vs last month"
          href="/admin/users"
          color="blue"
        />
        <KpiCard
          title="Total Jobs"
          value={stats.jobs.total}
          subtitle={`${stats.jobs.open} open · ${stats.jobs.inProgress} in progress`}
          icon={<Briefcase className="h-5 w-5" />}
          href="/admin/jobs"
          color="emerald"
        />
        <KpiCard
          title="Contracts Value"
          value={`$${stats.contracts.totalValue.toLocaleString()}`}
          subtitle={`${stats.contracts.total} contracts · avg $${Math.round(stats.contracts.avgValue).toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5" />}
          href="/admin/contracts"
          color="violet"
        />
        <KpiCard
          title="Active Disputes"
          value={stats.disputes.open + stats.disputes.voting}
          subtitle={`${stats.disputes.resolved} resolved · ${stats.disputes.total} total`}
          icon={<Shield className="h-5 w-5" />}
          href="/admin/disputes"
          color="amber"
        />
        <KpiCard
          title="Reviews"
          value={stats.reviews.total}
          subtitle={`Avg ${stats.reviews.avgRating.toFixed(1)} ★ · ${stats.reviews.thisMonth} this month`}
          icon={<Star className="h-5 w-5" />}
          href="/admin/reviews"
          color="cyan"
        />
        <KpiCard
          title="Messages"
          value={stats.messages.total}
          subtitle={`${stats.messages.thisMonth} this month`}
          icon={<MessageSquare className="h-5 w-5" />}
          href="/admin/messages"
          color="rose"
        />
        <KpiCard
          title="New Users (Month)"
          value={stats.users.newThisMonth}
          subtitle={`${stats.users.freelancers} freelancers · ${stats.users.clients} clients`}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={userGrowth}
          trendLabel="growth"
          color="emerald"
        />
        <KpiCard
          title="Completed (Month)"
          value={stats.contracts.completedThisMonth}
          subtitle={`${stats.jobs.completed} jobs completed total`}
          icon={<CheckCircle2 className="h-5 w-5" />}
          color="blue"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Monthly Trends - Area Chart */}
        <Card className="border-dt-border bg-dt-surface shadow-lg lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-dt-text">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              Monthly Trends (6 months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingTrends ? (
              <div className="flex h-[280px] items-center justify-center"><Spinner size="md" /></div>
            ) : trends && trends.length > 0 ? (
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorContracts" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} className="fill-dt-text-muted" />
                    <YAxis tick={{ fontSize: 11 }} className="fill-dt-text-muted" />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="users" name="Users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={2} />
                    <Area type="monotone" dataKey="jobs" name="Jobs" stroke="#22c55e" fillOpacity={1} fill="url(#colorJobs)" strokeWidth={2} />
                    <Area type="monotone" dataKey="contracts" name="Contracts" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorContracts)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-[280px] items-center justify-center text-sm text-dt-text-muted">No trend data available</div>
            )}
          </CardContent>
        </Card>

        {/* User Distribution - Pie Chart */}
        <Card className="border-dt-border bg-dt-surface shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-dt-text">
              <Users className="h-5 w-5 text-blue-500" />
              User Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userRoleData.length > 0 ? (
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userRoleData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {userRoleData.map((_, index) => (
                        <Cell key={index} fill={USER_COLORS[index % USER_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-[280px] items-center justify-center text-sm text-dt-text-muted">No users yet</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Second Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="border-dt-border bg-dt-surface shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-dt-text">
              <DollarSign className="h-5 w-5 text-violet-500" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingTrends ? (
              <div className="flex h-[240px] items-center justify-center"><Spinner size="md" /></div>
            ) : trends && trends.length > 0 ? (
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} className="fill-dt-text-muted" />
                    <YAxis tick={{ fontSize: 11 }} className="fill-dt-text-muted" />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="revenue" name="Revenue ($)" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={36} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-[240px] items-center justify-center text-sm text-dt-text-muted">No revenue data</div>
            )}
          </CardContent>
        </Card>

        {/* Job Status Distribution */}
        <Card className="border-dt-border bg-dt-surface shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-dt-text">
              <Briefcase className="h-5 w-5 text-emerald-500" />
              Job Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {jobStatusData.length > 0 ? (
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={jobStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {jobStatusData.map((_, index) => (
                        <Cell key={index} fill={JOB_COLORS[index % JOB_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-[240px] items-center justify-center text-sm text-dt-text-muted">No jobs yet</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity + Quick Stats */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="border-dt-border bg-dt-surface shadow-lg lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-dt-text">
              <Activity className="h-5 w-5 text-emerald-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingActivity ? (
              <div className="flex h-[300px] items-center justify-center"><Spinner size="md" /></div>
            ) : activity && activity.length > 0 ? (
              <div className="space-y-2">
                {activity.map((item: ActivityItem, idx: number) => (
                  <div
                    key={`${item.type}-${item.id}-${idx}`}
                    className="flex items-center gap-3 rounded-xl border border-dt-border p-3 transition hover:bg-dt-surface-alt"
                  >
                    <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', activityColors[item.type])}>
                      {activityIcons[item.type]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-dt-text">{item.title}</p>
                      <p className="text-xs text-dt-text-muted">
                        <span className="capitalize">{item.type}</span> · {item.status}
                      </p>
                    </div>
                    <span className="whitespace-nowrap text-xs text-dt-text-muted">{timeAgo(item.createdAt)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-sm text-dt-text-muted">
                No recent activity
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats Sidebar */}
        <Card className="border-dt-border bg-dt-surface shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-dt-text">Platform Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/30">
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Dispute Rate</p>
              <p className="mt-1 text-2xl font-bold text-emerald-800 dark:text-emerald-300">
                {stats.contracts.total > 0
                  ? `${((stats.disputes.total / stats.contracts.total) * 100).toFixed(1)}%`
                  : '0%'}
              </p>
              <p className="mt-0.5 text-xs text-emerald-600 dark:text-emerald-500">
                {stats.disputes.total} disputes / {stats.contracts.total} contracts
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-950/30">
              <p className="text-xs font-medium text-blue-700 dark:text-blue-400">Completion Rate</p>
              <p className="mt-1 text-2xl font-bold text-blue-800 dark:text-blue-300">
                {stats.contracts.total > 0
                  ? `${((stats.contracts.completed / stats.contracts.total) * 100).toFixed(1)}%`
                  : '0%'}
              </p>
              <p className="mt-0.5 text-xs text-blue-600 dark:text-blue-500">
                {stats.contracts.completed} / {stats.contracts.total} contracts
              </p>
            </div>

            <div className="rounded-xl bg-violet-50 p-4 dark:bg-violet-950/30">
              <p className="text-xs font-medium text-violet-700 dark:text-violet-400">Avg Rating</p>
              <p className="mt-1 text-2xl font-bold text-violet-800 dark:text-violet-300">
                {stats.reviews.avgRating.toFixed(1)} <span className="text-lg">★</span>
              </p>
              <p className="mt-0.5 text-xs text-violet-600 dark:text-violet-500">
                From {stats.reviews.total} reviews
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-4 dark:bg-amber-950/30">
              <p className="text-xs font-medium text-amber-700 dark:text-amber-400">Active Disputes</p>
              <p className="mt-1 text-2xl font-bold text-amber-800 dark:text-amber-300">
                {stats.disputes.open + stats.disputes.voting}
              </p>
              <p className="mt-0.5 text-xs text-amber-600 dark:text-amber-500">
                {stats.disputes.open} open · {stats.disputes.voting} voting
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
