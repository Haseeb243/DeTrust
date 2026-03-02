import { api } from './client';

// =============================================================================
// ADMIN TYPES
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

export interface MonthlyTrend {
  month: string;
  users: number;
  jobs: number;
  contracts: number;
  revenue: number;
}

export interface AdminUser {
  id: string;
  name: string | null;
  email: string | null;
  walletAddress: string | null;
  role: string;
  status: string;
  emailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  freelancerProfile?: { trustScore: number; completedJobs: number } | null;
  clientProfile?: { trustScore: number; totalSpent: number } | null;
  _count: { reviewsReceived: number; disputesInitiated: number; contracts: number };
}

export interface AdminJob {
  id: string;
  title: string;
  status: string;
  type: string;
  budgetMin: number | null;
  budgetMax: number | null;
  createdAt: string;
  client: { id: string; name: string | null };
  _count: { proposals: number; contracts: number };
}

export interface ActivityItem {
  type: 'user' | 'job' | 'dispute' | 'contract';
  id: string;
  title: string;
  status: string;
  createdAt: string;
}

export interface AdminUserListParams {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
  sort?: string;
  order?: string;
}

export interface AdminJobListParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sort?: string;
  order?: string;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface FlaggedUser {
  id: string;
  name: string | null;
  email: string | null;
  walletAddress: string | null;
  role: string;
  status: string;
  createdAt: string;
  trustScore: number;
  contracts: number;
  disputes: number;
  reviews: number;
  riskFlags: string[];
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface FlaggedAccountsResponse {
  items: FlaggedUser[];
  total: number;
  page: number;
  limit: number;
  riskSummary: {
    high: number;
    medium: number;
    low: number;
  };
}

// =============================================================================
// ADMIN API
// =============================================================================

function buildQuery(params?: Record<string, unknown>): string {
  if (!params) return '';
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      sp.append(key, String(value));
    }
  });
  const qs = sp.toString();
  return qs ? `?${qs}` : '';
}

export const adminApi = {
  getStats: () =>
    api.get<PlatformStats>('/admin/stats'),

  getTrends: () =>
    api.get<MonthlyTrend[]>('/admin/trends'),

  getActivity: (limit?: number) =>
    api.get<ActivityItem[]>(`/admin/activity${limit ? `?limit=${limit}` : ''}`),

  listUsers: (params?: AdminUserListParams) =>
    api.get<PaginatedResponse<AdminUser>>(`/admin/users${buildQuery(params as Record<string, unknown>)}`),

  updateUserStatus: (userId: string, status: 'ACTIVE' | 'SUSPENDED') =>
    api.patch<AdminUser>(`/admin/users/${userId}/status`, { status }),

  listJobs: (params?: AdminJobListParams) =>
    api.get<PaginatedResponse<AdminJob>>(`/admin/jobs${buildQuery(params as Record<string, unknown>)}`),

  getFlaggedAccounts: (params?: { page?: number; limit?: number }) =>
    api.get<FlaggedAccountsResponse>(`/admin/flagged${buildQuery(params as Record<string, unknown>)}`),
};

export default adminApi;
