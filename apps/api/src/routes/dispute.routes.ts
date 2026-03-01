import { Router } from 'express';
import { authenticate, requireAdmin, validateBody } from '../middleware';
import { disputeController } from '../controllers/dispute.controller';
import {
  createDisputeSchema,
  submitEvidenceSchema,
  castVoteSchema,
  adminResolveSchema,
} from '../validators/dispute.validator';

const router: Router = Router();

// List disputes (authenticated — shows own disputes; admin sees all)
router.get('/', authenticate, disputeController.listDisputes);

// Get a single dispute by ID
router.get('/:disputeId', authenticate, disputeController.getDispute);

// Create a new dispute (M5-I1)
router.post('/', authenticate, validateBody(createDisputeSchema), disputeController.createDispute);

// Submit additional evidence (M5-I3)
router.post('/:disputeId/evidence', authenticate, validateBody(submitEvidenceSchema), disputeController.submitEvidence);

// Admin: start voting phase (M5-I4)
router.post('/:disputeId/start-voting', authenticate, requireAdmin, disputeController.startVoting);

// Cast a vote (juror or admin) (M5-I5)
router.post('/:disputeId/vote', authenticate, validateBody(castVoteSchema), disputeController.castVote);

// Admin: directly resolve a dispute (hybrid model)
router.post('/:disputeId/resolve', authenticate, requireAdmin, validateBody(adminResolveSchema), disputeController.adminResolve);

export default router;
