import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware';
import { disputeService } from '../services/dispute.service';
import type {
  CreateDisputeInput,
  SubmitEvidenceInput,
  CastVoteInput,
  AdminResolveInput,
  GetDisputesQuery,
} from '../validators/dispute.validator';

/**
 * Create a dispute on a contract
 * POST /api/disputes
 */
const createDispute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const initiatorId = authReq.userId!;
    const input = req.body as CreateDisputeInput;

    const dispute = await disputeService.createDispute(initiatorId, input);
    res.status(201).json({ success: true, data: dispute, message: 'Dispute created successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit additional evidence
 * POST /api/disputes/:disputeId/evidence
 */
const submitEvidence = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.userId!;
    const { disputeId } = req.params;
    const input = req.body as SubmitEvidenceInput;

    const dispute = await disputeService.submitEvidence(userId, disputeId, input);
    res.json({ success: true, data: dispute, message: 'Evidence submitted' });
  } catch (error) {
    next(error);
  }
};

/**
 * Start voting phase (admin only)
 * POST /api/disputes/:disputeId/start-voting
 */
const startVoting = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const adminId = authReq.userId!;
    const { disputeId } = req.params;

    const dispute = await disputeService.startVoting(adminId, disputeId);
    res.json({ success: true, data: dispute, message: 'Voting phase started' });
  } catch (error) {
    next(error);
  }
};

/**
 * Cast a vote on a dispute
 * POST /api/disputes/:disputeId/vote
 */
const castVote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const voterId = authReq.userId!;
    const { disputeId } = req.params;
    const input = req.body as CastVoteInput;

    const vote = await disputeService.castVote(voterId, disputeId, input);
    res.status(201).json({ success: true, data: vote, message: 'Vote cast successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin directly resolves a dispute
 * POST /api/disputes/:disputeId/resolve
 */
const adminResolve = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const adminId = authReq.userId!;
    const { disputeId } = req.params;
    const input = req.body as AdminResolveInput;

    const dispute = await disputeService.adminResolve(adminId, disputeId, input);
    res.json({ success: true, data: dispute, message: 'Dispute resolved' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single dispute by ID
 * GET /api/disputes/:disputeId
 */
const getDispute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.userId!;
    const { disputeId } = req.params;

    const dispute = await disputeService.getDispute(disputeId, userId);
    res.json({ success: true, data: dispute });
  } catch (error) {
    next(error);
  }
};

/**
 * List disputes for the authenticated user (or all for admin)
 * GET /api/disputes
 */
const listDisputes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.userId!;

    const query: GetDisputesQuery = {
      status: req.query.status as GetDisputesQuery['status'],
      page: parseInt(req.query.page as string, 10) || 1,
      limit: Math.min(parseInt(req.query.limit as string, 10) || 20, 100),
      sort: (req.query.sort as GetDisputesQuery['sort']) || 'createdAt',
      order: (req.query.order as GetDisputesQuery['order']) || 'desc',
    };

    const result = await disputeService.listDisputes(userId, query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const disputeController = {
  createDispute,
  submitEvidence,
  startVoting,
  castVote,
  adminResolve,
  getDispute,
  listDisputes,
};
