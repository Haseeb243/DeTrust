import { z } from 'zod';

const stripHtml = (val: string) => val.replace(/<[^>]*>/g, '').trim();
const safeText = (schema: z.ZodString) => schema.transform(stripHtml);

// =============================================================================
// CREATE DISPUTE
// =============================================================================

export const createDisputeSchema = z.object({
  contractId: z.string().min(1, 'Contract ID is required'),
  reason: z.string().min(1, 'Reason is required').max(100),
  description: safeText(z.string().min(50, 'Description must be at least 50 characters').max(5000)),
  evidence: z.array(z.string().url()).max(5).optional(),
});

// =============================================================================
// SUBMIT EVIDENCE
// =============================================================================

export const submitEvidenceSchema = z.object({
  description: safeText(z.string().min(10, 'Description must be at least 10 characters').max(2000)),
  files: z.array(z.string().url()).min(1, 'At least one file required').max(5),
});

// =============================================================================
// CAST VOTE (Juror / Admin)
// =============================================================================

export const castVoteSchema = z.object({
  vote: z.enum(['CLIENT_WINS', 'FREELANCER_WINS']),
  reasoning: safeText(z.string().min(10).max(2000)).optional(),
});

// =============================================================================
// ADMIN RESOLVE
// =============================================================================

export const adminResolveSchema = z.object({
  outcome: z.enum(['CLIENT_WINS', 'FREELANCER_WINS', 'SPLIT']),
  resolution: safeText(z.string().min(10).max(5000)),
});

// =============================================================================
// QUERY DISPUTES
// =============================================================================

export const getDisputesQuerySchema = z.object({
  status: z.enum(['OPEN', 'VOTING', 'RESOLVED', 'APPEALED']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sort: z.enum(['createdAt', 'updatedAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type CreateDisputeInput = z.infer<typeof createDisputeSchema>;
export type SubmitEvidenceInput = z.infer<typeof submitEvidenceSchema>;
export type CastVoteInput = z.infer<typeof castVoteSchema>;
export type AdminResolveInput = z.infer<typeof adminResolveSchema>;
export type GetDisputesQuery = z.infer<typeof getDisputesQuerySchema>;
