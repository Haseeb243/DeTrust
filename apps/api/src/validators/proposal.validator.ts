import { z } from 'zod';

// =============================================================================
// PROPOSAL CREATION & UPDATE
// =============================================================================

export const createProposalSchema = z.object({
  coverLetter: z.string().min(50, 'Cover letter must be at least 50 characters').max(3000),
  proposedRate: z.number().positive('Proposed rate must be positive'),
  estimatedDuration: z.string().max(100).optional(),
  milestones: z.array(z.object({
    title: z.string().min(1).max(200),
    description: z.string().max(1000).optional(),
    amount: z.number().positive(),
    dueDate: z.string().datetime().optional(),
  })).optional(),
  attachments: z.array(z.string()).max(5).optional(),
});

export const updateProposalSchema = z.object({
  coverLetter: z.string().min(50).max(3000).optional(),
  proposedRate: z.number().positive().optional(),
  estimatedDuration: z.string().max(100).optional(),
  milestones: z.array(z.object({
    title: z.string().min(1).max(200),
    description: z.string().max(1000).optional(),
    amount: z.number().positive(),
    dueDate: z.string().datetime().optional(),
  })).optional(),
  attachments: z.array(z.string()).max(5).optional(),
});

// =============================================================================
// PROPOSAL STATUS TRANSITIONS (CLIENT ACTIONS)
// =============================================================================

export const acceptProposalSchema = z.object({
  // Additional fields for contract creation
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  milestones: z.array(z.object({
    title: z.string().min(1).max(200),
    description: z.string().max(1000).optional(),
    amount: z.number().positive(),
    dueDate: z.string().datetime().optional(),
  })).min(1, 'At least one milestone is required'),
});

export const rejectProposalSchema = z.object({
  reason: z.string().max(500).optional(),
});

// =============================================================================
// PROPOSAL QUERIES
// =============================================================================

export const getProposalsQuerySchema = z.object({
  jobId: z.string().optional(),
  freelancerId: z.string().optional(),
  status: z.enum(['PENDING', 'SHORTLISTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sort: z.enum(['createdAt', 'proposedRate']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export const getProposalByIdParamsSchema = z.object({
  id: z.string().min(1),
});

export const getJobProposalsParamsSchema = z.object({
  jobId: z.string().min(1),
});

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type CreateProposalInput = z.infer<typeof createProposalSchema>;
export type UpdateProposalInput = z.infer<typeof updateProposalSchema>;
export type AcceptProposalInput = z.infer<typeof acceptProposalSchema>;
export type RejectProposalInput = z.infer<typeof rejectProposalSchema>;
export type GetProposalsQuery = z.infer<typeof getProposalsQuerySchema>;
