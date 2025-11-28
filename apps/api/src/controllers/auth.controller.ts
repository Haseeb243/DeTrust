import { Request, Response, NextFunction } from 'express';
import { authService } from '../services';
import { AuthenticatedRequest } from '../middleware';

export class AuthController {
  /**
   * Register with email
   * POST /auth/register
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login with email
   * POST /auth/login
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      res.json({
        success: true,
        message: result.requires2FA ? '2FA required' : 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get nonce for wallet auth
   * POST /auth/wallet/nonce
   */
  async walletNonce(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.generateWalletNonce(req.body.address);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify wallet signature
   * POST /auth/wallet/verify
   */
  async walletVerify(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.verifyWallet(req.body);
      res.json({
        success: true,
        message: result.isNewUser ? 'Account created' : 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Setup 2FA
   * POST /auth/2fa/setup
   */
  async setup2FA(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await authService.setup2FA(req.userId!);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify 2FA setup
   * POST /auth/2fa/verify
   */
  async verify2FA(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await authService.verify2FA(req.userId!, req.body.code);
      res.json({
        success: true,
        message: '2FA enabled successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Forgot password
   * POST /auth/forgot-password
   */
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.forgotPassword(req.body.email);
      res.json({
        success: true,
        message: 'If the email exists, a reset link has been sent',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reset password
   * POST /auth/reset-password
   */
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.resetPassword(req.body);
      res.json({
        success: true,
        message: 'Password reset successful',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change password (authenticated)
   * POST /auth/change-password
   */
  async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await authService.changePassword(req.userId!, req.body);
      res.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user
   * GET /auth/me
   */
  async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      res.json({
        success: true,
        data: {
          userId: req.userId,
          userRole: req.userRole,
          email: req.userEmail,
          walletAddress: req.userWallet,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
export default authController;
