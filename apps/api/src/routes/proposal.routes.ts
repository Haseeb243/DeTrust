import { Router } from 'express';

const router: Router = Router();

// TODO: Implement proposal routes
// GET /proposals - List proposals (filtered by user/job)
// POST /proposals - Submit proposal (freelancer only)
// GET /proposals/:id - Get proposal details
// PATCH /proposals/:id - Update proposal
// DELETE /proposals/:id - Withdraw proposal
// POST /proposals/:id/accept - Accept proposal (client only)
// POST /proposals/:id/reject - Reject proposal (client only)

router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Proposals API - Not implemented yet',
    data: { items: [], total: 0 },
  });
});

export default router;
