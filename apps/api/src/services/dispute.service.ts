import { prisma } from '../config/database';
import { NotFoundError, ForbiddenError, ValidationError } from '../middleware';
import { notificationService } from './notification.service';
import { emitDisputeOpened, emitDisputeResolved } from '../events/dispute.events';
import type {
  CreateDisputeInput,
  SubmitEvidenceInput,
  CastVoteInput,
  AdminResolveInput,
  GetDisputesQuery,
} from '../validators/dispute.validator';

// Voting window: 7 days (SRS)
const VOTING_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export class DisputeService {
  /**
   * Create a dispute on an active, funded contract.
   * Only client or freelancer of the contract can initiate.
   */
  async createDispute(initiatorId: string, input: CreateDisputeInput) {
    const contract = await prisma.contract.findUnique({
      where: { id: input.contractId },
      select: {
        id: true,
        status: true,
        clientId: true,
        freelancerId: true,
        title: true,
        totalAmount: true,
        fundingTxHash: true,
      },
    });

    if (!contract) {
      throw new NotFoundError('Contract not found');
    }

    const isClient = contract.clientId === initiatorId;
    const isFreelancer = contract.freelancerId === initiatorId;

    if (!isClient && !isFreelancer) {
      throw new ForbiddenError('Only contract parties can initiate a dispute');
    }

    if (contract.status !== 'ACTIVE') {
      throw new ValidationError('Disputes can only be raised on active contracts');
    }

    // Check for existing open dispute on the same contract
    const existing = await prisma.dispute.findFirst({
      where: {
        contractId: input.contractId,
        status: { in: ['OPEN', 'VOTING'] },
      },
    });

    if (existing) {
      throw new ValidationError('An active dispute already exists for this contract');
    }

    // Create dispute and update contract status
    const dispute = await prisma.$transaction(async (tx: any) => {
      const d = await tx.dispute.create({
        data: {
          contractId: input.contractId,
          initiatorId,
          reason: input.reason,
          description: input.description,
          evidence: input.evidence ?? [],
          status: 'OPEN',
          outcome: 'PENDING',
        },
        include: {
          contract: { select: { id: true, title: true, totalAmount: true } },
          initiator: { select: { id: true, name: true } },
        },
      });

      await tx.contract.update({
        where: { id: input.contractId },
        data: { status: 'DISPUTED' },
      });

      return d;
    });

    // Notify both parties
    const otherPartyId = isClient ? contract.freelancerId : contract.clientId;

    await notificationService.createNotification({
      userId: otherPartyId,
      type: 'DISPUTE_OPENED',
      title: 'Dispute Opened',
      message: `A dispute has been raised on "${contract.title}": ${input.reason}`,
      data: { disputeId: dispute.id, contractId: contract.id },
    });

    emitDisputeOpened(
      contract.clientId,
      contract.freelancerId,
      dispute.id,
      contract.title,
    );

    return dispute;
  }

  /**
   * Submit additional evidence to an open dispute.
   * Only contract parties can submit evidence.
   */
  async submitEvidence(
    userId: string,
    disputeId: string,
    input: SubmitEvidenceInput,
  ) {
    const dispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
      include: {
        contract: { select: { clientId: true, freelancerId: true } },
      },
    });

    if (!dispute) {
      throw new NotFoundError('Dispute not found');
    }

    if (dispute.status !== 'OPEN') {
      throw new ValidationError('Evidence can only be submitted to open disputes');
    }

    const { clientId, freelancerId } = dispute.contract;
    if (userId !== clientId && userId !== freelancerId) {
      throw new ForbiddenError('Only contract parties can submit evidence');
    }

    const updatedEvidence = [...dispute.evidence, ...input.files];

    const updated = await prisma.dispute.update({
      where: { id: disputeId },
      data: { evidence: updatedEvidence },
      include: {
        contract: { select: { id: true, title: true, totalAmount: true } },
        initiator: { select: { id: true, name: true } },
      },
    });

    return updated;
  }

  /**
   * Admin transitions dispute from OPEN → VOTING.
   * In the hybrid model, admin can either resolve directly or open voting.
   */
  async startVoting(adminId: string, disputeId: string) {
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (!admin || admin.role !== 'ADMIN') {
      throw new ForbiddenError('Only admins can start the voting phase');
    }

    const dispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
      include: {
        contract: { select: { clientId: true, freelancerId: true, title: true } },
      },
    });

    if (!dispute) {
      throw new NotFoundError('Dispute not found');
    }

    if (dispute.status !== 'OPEN') {
      throw new ValidationError('Only open disputes can move to voting');
    }

    const updated = await prisma.dispute.update({
      where: { id: disputeId },
      data: {
        status: 'VOTING',
        votingDeadline: new Date(Date.now() + VOTING_WINDOW_MS),
      },
      include: {
        contract: { select: { id: true, title: true, totalAmount: true } },
        initiator: { select: { id: true, name: true } },
        votes: true,
      },
    });

    // Notify both parties about voting phase
    const { clientId, freelancerId, title } = dispute.contract;
    for (const userId of [clientId, freelancerId]) {
      await notificationService.createNotification({
        userId,
        type: 'DISPUTE_VOTING',
        title: 'Dispute Voting Started',
        message: `Voting has started on the dispute for "${title}". Community jurors will now review the case.`,
        data: { disputeId: dispute.id, contractId: dispute.contractId },
      });
    }

    return updated;
  }

  /**
   * Cast a vote on a dispute in VOTING status.
   * Voters: admin or qualified jurors (trust score > 50, no prior work with parties).
   */
  async castVote(
    voterId: string,
    disputeId: string,
    input: CastVoteInput,
  ) {
    const dispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
      include: {
        contract: { select: { clientId: true, freelancerId: true } },
        votes: true,
      },
    });

    if (!dispute) {
      throw new NotFoundError('Dispute not found');
    }

    if (dispute.status !== 'VOTING') {
      throw new ValidationError('Votes can only be cast during the voting phase');
    }

    if (dispute.votingDeadline && new Date() > dispute.votingDeadline) {
      throw new ValidationError('The voting deadline has passed');
    }

    // Voter cannot be a party to the dispute
    const { clientId, freelancerId } = dispute.contract;
    if (voterId === clientId || voterId === freelancerId) {
      throw new ForbiddenError('Contract parties cannot vote on their own dispute');
    }

    // Check for duplicate vote
    const existingVote = dispute.votes.find((v: { jurorId: string }) => v.jurorId === voterId);
    if (existingVote) {
      throw new ValidationError('You have already voted on this dispute');
    }

    // Determine vote weight (default 1, could be trust-score-weighted)
    const voter = await prisma.user.findUnique({
      where: { id: voterId },
      select: { role: true, freelancerProfile: { select: { trustScore: true } } },
    });

    // Admin always has weight 10
    let weight = 1;
    if (voter?.role === 'ADMIN') {
      weight = 10;
    } else if (voter?.freelancerProfile?.trustScore) {
      weight = Math.max(1, Math.floor(Number(voter.freelancerProfile.trustScore) / 10));
    }

    const vote = await prisma.disputeVote.create({
      data: {
        disputeId,
        jurorId: voterId,
        vote: input.vote as any,
        weight,
        reasoning: input.reasoning ?? null,
      },
      include: {
        juror: { select: { id: true, name: true } },
      },
    });

    // Update vote tallies
    const allVotes = [...dispute.votes, { vote: input.vote, weight }] as Array<{ vote: string; weight: number }>;
    const clientVotes = allVotes
      .filter((v) => v.vote === 'CLIENT_WINS')
      .reduce((sum: number, v) => sum + v.weight, 0);
    const freelancerVotes = allVotes
      .filter((v) => v.vote === 'FREELANCER_WINS')
      .reduce((sum: number, v) => sum + v.weight, 0);

    await prisma.dispute.update({
      where: { id: disputeId },
      data: { clientVotes, freelancerVotes },
    });

    return vote;
  }

  /**
   * Admin directly resolves a dispute (hybrid model).
   * Bypasses full juror voting when no user-jurors are available.
   */
  async adminResolve(
    adminId: string,
    disputeId: string,
    input: AdminResolveInput,
  ) {
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (!admin || admin.role !== 'ADMIN') {
      throw new ForbiddenError('Only admins can directly resolve disputes');
    }

    const dispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
      include: {
        contract: { select: { clientId: true, freelancerId: true, title: true } },
      },
    });

    if (!dispute) {
      throw new NotFoundError('Dispute not found');
    }

    if (dispute.status === 'RESOLVED') {
      throw new ValidationError('Dispute is already resolved');
    }

    const updated = await prisma.dispute.update({
      where: { id: disputeId },
      data: {
        status: 'RESOLVED',
        outcome: input.outcome as any,
        resolution: input.resolution,
        resolvedAt: new Date(),
      },
      include: {
        contract: { select: { id: true, title: true, totalAmount: true } },
        initiator: { select: { id: true, name: true } },
        votes: { include: { juror: { select: { id: true, name: true } } } },
      },
    });

    const { clientId, freelancerId, title } = dispute.contract;

    // Notify both parties
    const outcomeText =
      input.outcome === 'CLIENT_WINS' ? 'in favor of the client'
      : input.outcome === 'FREELANCER_WINS' ? 'in favor of the freelancer'
      : 'as a split decision';

    for (const userId of [clientId, freelancerId]) {
      await notificationService.createNotification({
        userId,
        type: 'DISPUTE_RESOLVED',
        title: 'Dispute Resolved',
        message: `The dispute on "${title}" has been resolved ${outcomeText}.`,
        data: { disputeId: dispute.id, contractId: dispute.contractId, outcome: input.outcome },
      });
    }

    emitDisputeResolved(clientId, freelancerId, dispute.id, input.outcome);

    return updated;
  }

  /**
   * Get a single dispute by ID.
   */
  async getDispute(disputeId: string, userId: string) {
    const dispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
      include: {
        contract: {
          select: {
            id: true,
            title: true,
            totalAmount: true,
            clientId: true,
            freelancerId: true,
            client: { select: { id: true, name: true, avatarUrl: true } },
            freelancer: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
        initiator: { select: { id: true, name: true, avatarUrl: true } },
        votes: {
          include: { juror: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!dispute) {
      throw new NotFoundError('Dispute not found');
    }

    // Verify user is a party to the dispute or admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    const contract = dispute.contract;
    const isParty = contract.clientId === userId || contract.freelancerId === userId;
    const isAdmin = user?.role === 'ADMIN';

    if (!isParty && !isAdmin) {
      throw new ForbiddenError('You do not have access to this dispute');
    }

    return dispute;
  }

  /**
   * List disputes for a user (as party) or all disputes for admin.
   */
  async listDisputes(userId: string, query: GetDisputesQuery) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    const isAdmin = user?.role === 'ADMIN';

    const where: Record<string, unknown> = {};

    if (!isAdmin) {
      where.contract = {
        OR: [{ clientId: userId }, { freelancerId: userId }],
      };
    }

    if (query.status) {
      where.status = query.status;
    }

    const [items, total] = await Promise.all([
      prisma.dispute.findMany({
        where,
        include: {
          contract: {
            select: {
              id: true,
              title: true,
              totalAmount: true,
              client: { select: { id: true, name: true, avatarUrl: true } },
              freelancer: { select: { id: true, name: true, avatarUrl: true } },
            },
          },
          initiator: { select: { id: true, name: true } },
          _count: { select: { votes: true } },
        },
        orderBy: { [query.sort]: query.order },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.dispute.count({ where }),
    ]);

    return {
      items,
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
      hasNext: query.page * query.limit < total,
      hasPrev: query.page > 1,
    };
  }
}

export const disputeService = new DisputeService();
export default disputeService;
