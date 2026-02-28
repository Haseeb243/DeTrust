import { Router } from 'express';

import { userController } from '../controllers';
import { authenticate, optionalAuth, validateBody, requireFreelancer, requireClient } from '../middleware';
import {
  updateUserSchema,
  updateFreelancerProfileSchema,
  updateClientProfileSchema,
  addSkillSchema,
  addEducationSchema,
  setRoleSchema,
  updateKycSchema,
} from '../validators';

const router: Router = Router();

// =============================================================================
// CURRENT USER
// =============================================================================

/**
 * @route   GET /users/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, userController.getMe);

/**
 * @route   PATCH /users/me
 * @desc    Update current user
 * @access  Private
 */
router.patch(
  '/me',
  authenticate,
  validateBody(updateUserSchema),
  userController.updateMe
);

/**
 * @route   POST /users/me/role
 * @desc    Set user role (during onboarding)
 * @access  Private
 */
router.post(
  '/me/role',
  authenticate,
  validateBody(setRoleSchema),
  userController.setRole
);

/**
 * @route   PATCH /users/me/kyc
 * @desc    Submit or update KYC data
 * @access  Private
 */
router.patch(
  '/me/kyc',
  authenticate,
  validateBody(updateKycSchema),
  userController.updateKyc
);

// =============================================================================
// FREELANCER PROFILE
// =============================================================================

/**
 * @route   PATCH /users/me/freelancer
 * @desc    Update freelancer profile
 * @access  Private (Freelancer)
 */
router.patch(
  '/me/freelancer',
  authenticate,
  requireFreelancer,
  validateBody(updateFreelancerProfileSchema),
  userController.updateFreelancerProfile
);

/**
 * @route   POST /users/me/skills
 * @desc    Add skill to freelancer profile
 * @access  Private (Freelancer)
 */
router.post(
  '/me/skills',
  authenticate,
  requireFreelancer,
  validateBody(addSkillSchema),
  userController.addSkill
);

/**
 * @route   DELETE /users/me/skills/:skillId
 * @desc    Remove skill from freelancer profile
 * @access  Private (Freelancer)
 */
router.delete(
  '/me/skills/:skillId',
  authenticate,
  requireFreelancer,
  userController.removeSkill
);

/**
 * @route   POST /users/me/education
 * @desc    Add education entry
 * @access  Private (Freelancer)
 */
router.post(
  '/me/education',
  authenticate,
  requireFreelancer,
  validateBody(addEducationSchema),
  userController.addEducation
);

/**
 * @route   DELETE /users/me/education/:educationId
 * @desc    Remove education entry
 * @access  Private (Freelancer)
 */
router.delete(
  '/me/education/:educationId',
  authenticate,
  requireFreelancer,
  userController.removeEducation
);

/**
 * @route   DELETE /users/me/certifications/:certificationId
 * @desc    Remove certification entry
 * @access  Private (Freelancer)
 */
router.delete(
  '/me/certifications/:certificationId',
  authenticate,
  requireFreelancer,
  userController.removeCertification
);

// =============================================================================
// CLIENT PROFILE
// =============================================================================

/**
 * @route   PATCH /users/me/client
 * @desc    Update client profile
 * @access  Private (Client)
 */
router.patch(
  '/me/client',
  authenticate,
  requireClient,
  validateBody(updateClientProfileSchema),
  userController.updateClientProfile
);

// =============================================================================
// PUBLIC PROFILES
// =============================================================================

/**
 * @route   GET /users/freelancers
 * @desc    Search freelancers
 * @access  Public
 */
router.get('/freelancers', optionalAuth, userController.searchFreelancers);

/**
 * @route   GET /users/clients/:id/profile
 * @desc    Get client public profile with work history
 * @access  Public
 */
router.get('/clients/:id/profile', optionalAuth, userController.getClientProfile);

/**
 * @route   GET /users/:id
 * @desc    Get public profile
 * @access  Public
 */
router.get('/:id', optionalAuth, userController.getUser);

export default router;
