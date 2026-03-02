import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware';
import { adminController } from '../controllers/admin.controller';

const router: Router = Router();

// All admin routes require authentication + ADMIN role
router.use(authenticate, requireAdmin);

// Platform statistics dashboard
router.get('/stats', adminController.getStats);

// Monthly trends (6 months)
router.get('/trends', adminController.getTrends);

// Recent activity feed
router.get('/activity', adminController.getActivity);

// User management
router.get('/users', adminController.listUsers);
router.patch('/users/:userId/status', adminController.updateUserStatus);

// Job oversight
router.get('/jobs', adminController.listJobs);

// Flagged accounts
router.get('/flagged', adminController.getFlaggedAccounts);

export default router;
