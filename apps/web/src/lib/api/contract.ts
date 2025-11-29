import { api } from './client';

// =============================================================================
// CONTRACT TYPES
// =============================================================================

export type ContractStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
export type MilestoneStatus = 'PENDING' | 'IN_PROGRESS' | 'SUBMITTED' | 'APPROVED' | 'PAID' | 'DISPUTED';

export interface ContractMilestone {
  id: string;
  contractId: string;
  title: string;
  description?: string;
  amount: number;
  orderIndex: number;
  status: MilestoneStatus;
  dueDate?: string;
  submittedAt?: string;
  approvedAt?: string;
  paidAt?: string;
  deliverableUrl?: string;
  deliverableHash?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contract {
  id: string;
  jobId: string;
  proposalId: string;
  clientId: string;
  freelancerId: string;
  title: string;
  description?: string;
  totalAmount: number;
  paidAmount: number;
  status: ContractStatus;
  escrowAddress?: string;
  blockchainJobId?: string;
  fundingTxHash?: string;
  startDate?: string;
  endDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  milestones: ContractMilestone[];
  job?: {
    id: string;
    title: string;
    type: string;
    category?: string;
  };
  client?: {
    id: string;
    name?: string;
    avatarUrl?: string;
    clientProfile?: {
      companyName?: string;
      trustScore: number;
      paymentVerified: boolean;
    };
  };
  freelancer?: {
    id: string;
    name?: string;
    avatarUrl?: string;
    freelancerProfile?: {
      title?: string;
      trustScore: number;
    };
  };
}

export interface GetContractsParams {
  status?: ContractStatus;
  role?: 'client' | 'freelancer';
  page?: number;
  limit?: number;
  sort?: 'createdAt' | 'totalAmount';
  order?: 'asc' | 'desc';
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
// CONTRACT API
// =============================================================================

export const contractApi = {
  // List contracts
  listContracts: (params?: GetContractsParams) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return api.get<PaginatedResponse<Contract>>(`/contracts${query ? `?${query}` : ''}`);
  },

  // Get a single contract
  getContract: (id: string) =>
    api.get<Contract>(`/contracts/${id}`),

  // Submit milestone deliverable (freelancer)
  submitMilestone: (contractId: string, milestoneId: string, data: { deliverableUrl?: string; deliverableHash?: string }) =>
    api.post<ContractMilestone>(`/contracts/${contractId}/milestones/${milestoneId}/submit`, data),

  // Approve milestone (client)
  approveMilestone: (contractId: string, milestoneId: string) =>
    api.post<ContractMilestone>(`/contracts/${contractId}/milestones/${milestoneId}/approve`),

  // Request revision (client)
  requestRevision: (contractId: string, milestoneId: string, reason: string) =>
    api.post<ContractMilestone>(`/contracts/${contractId}/milestones/${milestoneId}/revision`, { reason }),

  // Fund escrow (client)
  fundEscrow: (contractId: string, txHash: string) =>
    api.post<Contract>(`/contracts/${contractId}/fund`, { txHash }),

  // Complete contract
  completeContract: (contractId: string) =>
    api.post<Contract>(`/contracts/${contractId}/complete`),

  // Raise dispute
  raiseDispute: (contractId: string, reason: string) =>
    api.post<Contract>(`/contracts/${contractId}/dispute`, { reason }),
};

export default contractApi;
