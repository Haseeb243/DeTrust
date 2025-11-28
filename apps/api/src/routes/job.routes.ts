import { Router } from 'express';

const router: Router = Router();

// TODO: Implement job routes
// GET /jobs - List jobs (with filters)
// POST /jobs - Create job (client only)
// GET /jobs/:id - Get job details
// PATCH /jobs/:id - Update job (client only)
// DELETE /jobs/:id - Delete job (client only)
// POST /jobs/:id/publish - Publish job
// POST /jobs/:id/close - Close job

router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Jobs API - Not implemented yet',
    data: { items: [], total: 0 },
  });
});

export default router;
