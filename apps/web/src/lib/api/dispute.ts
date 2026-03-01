import { api } from './client';
import type { Dispute, DisputeVote } from '@detrust/types';

// =============================================================================
// DISPUTE TYPES
// =============================================================================

export type { Dispute, DisputeVote };

export type DisputeStatus = 'OPEN' | 'VOTING' | 'RESOLVED' | 'APPEALED';

export interface GetDisputesParams {
  status?: DisputeStatus;
  page?: number;
  limit?: number;
  sort?: 'createdAt' | 'updatedAt';
  order?: 'asc' | 'desc';
}

export interface CreateDisputeInput {
  contractId: string;
  reason: string;
  description: string;
  evidence?: string[];
}

export interface CastVoteInput {
  vote: 'CLIENT_WINS' | 'FREELANCER_WINS';
  reasoning?: string;
}

export interface AdminResolveInput {
  outcome: 'CLIENT_WINS' | 'FREELANCER_WINS' | 'SPLIT';
  resolution: string;
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

// =============================================================================
// DISPUTE API
// =============================================================================

export const disputeApi = {
  // List disputes
  listDisputes: (params?: GetDisputesParams) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return api.get<PaginatedResponse<Dispute>>(`/disputes${query ? `?${query}` : ''}`);
  },

  // Get a single dispute
  getDispute: (id: string) =>
    api.get<Dispute>(`/disputes/${id}`),

  // Create a dispute
  createDispute: (input: CreateDisputeInput) =>
    api.post<Dispute>('/disputes', input),

  // Submit additional evidence
  submitEvidence: (disputeId: string, data: { description: string; files: string[] }) =>
    api.post<Dispute>(`/disputes/${disputeId}/evidence`, data),

  // Start voting (admin)
  startVoting: (disputeId: string) =>
    api.post<Dispute>(`/disputes/${disputeId}/start-voting`),

  // Cast vote
  castVote: (disputeId: string, input: CastVoteInput) =>
    api.post<DisputeVote>(`/disputes/${disputeId}/vote`, input),

  // Admin resolve
  adminResolve: (disputeId: string, input: AdminResolveInput) =>
    api.post<Dispute>(`/disputes/${disputeId}/resolve`, input),
};

export default disputeApi;
