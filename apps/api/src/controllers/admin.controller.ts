import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware';
import { adminService } from '../services/admin.service';

/**
 * GET /api/admin/stats
 */
const getStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const stats = await adminService.getPlatformStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/trends
 */
const getTrends = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const trends = await adminService.getMonthlyTrends();
    res.json({ success: true, data: trends });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/activity
 */
const getActivity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string, 10) || 15, 50);
    const activity = await adminService.getRecentActivity(limit);
    res.json({ success: true, data: activity });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/users
 */
const listUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const params = {
      page: parseInt(req.query.page as string, 10) || 1,
      limit: Math.min(parseInt(req.query.limit as string, 10) || 20, 100),
      role: req.query.role as string | undefined,
      status: req.query.status as string | undefined,
      search: req.query.search as string | undefined,
      sort: (req.query.sort as string) || 'createdAt',
      order: (req.query.order as string) || 'desc',
    };
    const result = await adminService.listUsers(params);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/users/:userId/status
 */
const updateUserStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.params;
    const { status } = req.body;
    if (!['ACTIVE', 'SUSPENDED'].includes(status)) {
      res.status(400).json({ success: false, error: { code: 'INVALID_STATUS', message: 'Status must be ACTIVE or SUSPENDED' } });
      return;
    }
    const user = await adminService.updateUserStatus(userId, status);
    res.json({ success: true, data: user, message: `User ${status === 'SUSPENDED' ? 'suspended' : 'activated'}` });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/jobs
 */
const listJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const params = {
      page: parseInt(req.query.page as string, 10) || 1,
      limit: Math.min(parseInt(req.query.limit as string, 10) || 20, 100),
      status: req.query.status as string | undefined,
      search: req.query.search as string | undefined,
      sort: (req.query.sort as string) || 'createdAt',
      order: (req.query.order as string) || 'desc',
    };
    const result = await adminService.listJobs(params);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const adminController = {
  getStats,
  getTrends,
  getActivity,
  listUsers,
  updateUserStatus,
  listJobs,
};
