import { prisma } from '../config/database';

// =============================================================================
// TYPES
// =============================================================================

export interface PlatformStats {
  users: {
    total: number;
    freelancers: number;
    clients: number;
    admins: number;
    active: number;
    suspended: number;
    newThisMonth: number;
    newLastMonth: number;
  };
  jobs: {
    total: number;
    open: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    disputed: number;
    newThisMonth: number;
  };
  contracts: {
    total: number;
    active: number;
    completed: number;
    disputed: number;
    totalValue: number;
    avgValue: number;
    completedThisMonth: number;
  };
  disputes: {
    total: number;
    open: number;
    voting: number;
    resolved: number;
    appealed: number;
    avgResolutionDays: number;
  };
  reviews: {
    total: number;
    avgRating: number;
    thisMonth: number;
  };
  messages: {
    total: number;
    thisMonth: number;
  };
}

export interface UserListParams {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
  sort?: string;
  order?: string;
}

export interface JobListParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sort?: string;
  order?: string;
}

export interface MonthlyTrend {
  month: string;
  users: number;
  jobs: number;
  contracts: number;
  revenue: number;
}

// =============================================================================
// SERVICE
// =============================================================================

export class AdminService {
  /**
   * Get comprehensive platform statistics for the admin dashboard.
   */
  async getPlatformStats(): Promise<PlatformStats> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalUsers,
      freelancerCount,
      clientCount,
      adminCount,
      activeUsers,
      suspendedUsers,
      newUsersThisMonth,
      newUsersLastMonth,
      totalJobs,
      openJobs,
      inProgressJobs,
      completedJobs,
      cancelledJobs,
      disputedJobs,
      newJobsThisMonth,
      totalContracts,
      activeContracts,
      completedContracts,
      disputedContracts,
      contractStats,
      completedContractsThisMonth,
      totalDisputes,
      openDisputes,
      votingDisputes,
      resolvedDisputes,
      appealedDisputes,
      totalReviews,
      avgRatingResult,
      reviewsThisMonth,
      totalMessages,
      messagesThisMonth,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'FREELANCER' } }),
      prisma.user.count({ where: { role: 'CLIENT' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count({ where: { status: 'SUSPENDED' } }),
      prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.user.count({ where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } } }),
      prisma.job.count(),
      prisma.job.count({ where: { status: 'OPEN' } }),
      prisma.job.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.job.count({ where: { status: 'COMPLETED' } }),
      prisma.job.count({ where: { status: 'CANCELLED' } }),
      prisma.job.count({ where: { status: 'DISPUTED' } }),
      prisma.job.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.contract.count(),
      prisma.contract.count({ where: { status: 'ACTIVE' } }),
      prisma.contract.count({ where: { status: 'COMPLETED' } }),
      prisma.contract.count({ where: { status: 'DISPUTED' } }),
      prisma.contract.aggregate({ _sum: { totalAmount: true }, _avg: { totalAmount: true } }),
      prisma.contract.count({ where: { status: 'COMPLETED', completedAt: { gte: startOfMonth } } }),
      prisma.dispute.count(),
      prisma.dispute.count({ where: { status: 'OPEN' } }),
      prisma.dispute.count({ where: { status: 'VOTING' } }),
      prisma.dispute.count({ where: { status: 'RESOLVED' } }),
      prisma.dispute.count({ where: { status: 'APPEALED' } }),
      prisma.review.count(),
      prisma.review.aggregate({ _avg: { overallRating: true } }),
      prisma.review.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.message.count(),
      prisma.message.count({ where: { createdAt: { gte: startOfMonth } } }),
    ]);

    return {
      users: {
        total: totalUsers,
        freelancers: freelancerCount,
        clients: clientCount,
        admins: adminCount,
        active: activeUsers,
        suspended: suspendedUsers,
        newThisMonth: newUsersThisMonth,
        newLastMonth: newUsersLastMonth,
      },
      jobs: {
        total: totalJobs,
        open: openJobs,
        inProgress: inProgressJobs,
        completed: completedJobs,
        cancelled: cancelledJobs,
        disputed: disputedJobs,
        newThisMonth: newJobsThisMonth,
      },
      contracts: {
        total: totalContracts,
        active: activeContracts,
        completed: completedContracts,
        disputed: disputedContracts,
        totalValue: Number(contractStats._sum.totalAmount ?? 0),
        avgValue: Number(contractStats._avg.totalAmount ?? 0),
        completedThisMonth: completedContractsThisMonth,
      },
      disputes: {
        total: totalDisputes,
        open: openDisputes,
        voting: votingDisputes,
        resolved: resolvedDisputes,
        appealed: appealedDisputes,
        avgResolutionDays: 0,
      },
      reviews: {
        total: totalReviews,
        avgRating: Number(avgRatingResult._avg.overallRating ?? 0),
        thisMonth: reviewsThisMonth,
      },
      messages: {
        total: totalMessages,
        thisMonth: messagesThisMonth,
      },
    };
  }

  /**
   * Get monthly trends for the last 6 months.
   */
  async getMonthlyTrends(): Promise<MonthlyTrend[]> {
    const trends: MonthlyTrend[] = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthLabel = start.toLocaleString('en-US', { month: 'short', year: '2-digit' });

      const [users, jobs, contracts, revenue] = await Promise.all([
        prisma.user.count({ where: { createdAt: { gte: start, lt: end } } }),
        prisma.job.count({ where: { createdAt: { gte: start, lt: end } } }),
        prisma.contract.count({ where: { createdAt: { gte: start, lt: end } } }),
        prisma.contract.aggregate({
          where: { status: 'COMPLETED', completedAt: { gte: start, lt: end } },
          _sum: { totalAmount: true },
        }),
      ]);

      trends.push({
        month: monthLabel,
        users,
        jobs,
        contracts,
        revenue: Number(revenue._sum.totalAmount ?? 0),
      });
    }

    return trends;
  }

  /**
   * List users with filters for admin management.
   */
  async listUsers(params: UserListParams) {
    const { page = 1, limit = 20, role, status, search, sort = 'createdAt', order = 'desc' } = params;

    const where: Record<string, unknown> = {};
    if (role) where.role = role;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { walletAddress: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          walletAddress: true,
          role: true,
          status: true,
          emailVerified: true,
          lastLoginAt: true,
          createdAt: true,
          freelancerProfile: { select: { trustScore: true, completedJobs: true } },
          clientProfile: { select: { trustScore: true, totalSpent: true } },
          _count: { select: { reviewsReceived: true, disputesInitiated: true, contracts: true } },
        },
        orderBy: { [sort]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    };
  }

  /**
   * Suspend or activate a user (admin action).
   */
  async updateUserStatus(userId: string, newStatus: 'ACTIVE' | 'SUSPENDED') {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, role: true } });

    if (!user) throw new Error('User not found');
    if (user.role === 'ADMIN') throw new Error('Cannot change admin status');

    return prisma.user.update({
      where: { id: userId },
      data: { status: newStatus },
      select: { id: true, name: true, email: true, role: true, status: true },
    });
  }

  /**
   * List jobs for admin overview.
   */
  async listJobs(params: JobListParams) {
    const { page = 1, limit = 20, status, search, sort = 'createdAt', order = 'desc' } = params;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.job.findMany({
        where,
        select: {
          id: true,
          title: true,
          status: true,
          type: true,
          budgetMin: true,
          budgetMax: true,
          createdAt: true,
          client: { select: { id: true, name: true } },
          _count: { select: { proposals: true, contracts: true } },
        },
        orderBy: { [sort]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.job.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    };
  }

  /**
   * Get recent platform activity (latest events across the platform).
   */
  async getRecentActivity(limit: number = 15) {
    const [recentUsers, recentJobs, recentDisputes, recentContracts] = await Promise.all([
      prisma.user.findMany({
        select: { id: true, name: true, role: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: Math.ceil(limit / 4),
      }),
      prisma.job.findMany({
        select: { id: true, title: true, status: true, createdAt: true, client: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: Math.ceil(limit / 4),
      }),
      prisma.dispute.findMany({
        select: { id: true, reason: true, status: true, createdAt: true, initiator: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: Math.ceil(limit / 4),
      }),
      prisma.contract.findMany({
        select: { id: true, title: true, status: true, totalAmount: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: Math.ceil(limit / 4),
      }),
    ]);

    const activities = [
      ...recentUsers.map((u) => ({
        type: 'user' as const,
        id: u.id,
        title: `${u.name ?? 'Unknown'} joined as ${u.role.toLowerCase()}`,
        status: u.role,
        createdAt: u.createdAt,
      })),
      ...recentJobs.map((j) => ({
        type: 'job' as const,
        id: j.id,
        title: j.title,
        status: j.status,
        createdAt: j.createdAt,
      })),
      ...recentDisputes.map((d) => ({
        type: 'dispute' as const,
        id: d.id,
        title: `Dispute: ${d.reason}`,
        status: d.status,
        createdAt: d.createdAt,
      })),
      ...recentContracts.map((c) => ({
        type: 'contract' as const,
        id: c.id,
        title: c.title,
        status: c.status,
        createdAt: c.createdAt,
      })),
    ];

    activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return activities.slice(0, limit);
  }
}

export const adminService = new AdminService();
export default adminService;
