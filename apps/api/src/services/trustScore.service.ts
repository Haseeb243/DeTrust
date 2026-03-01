import { prisma } from '../config/database';

/**
 * Trust Score Formulas (SRS Module 4):
 *
 * Freelancer: (0.4 × AvgRating) + (0.3 × CompletionRate) + (0.2 × DisputeWinRate) + (0.1 × Experience)
 * Client:     (0.4 × AvgRating) + (0.3 × PaymentPunctuality) + (0.2 × HireRate) + (0.1 × JobClarityRating)
 *
 * All components are normalized to 0–100 scale before weighting.
 *
 * Inactivity Decay (M4-I6):
 * If user has no contract activity for > 90 days, apply a gradual decay:
 * decayFactor = max(0.5, 1 - (inactiveDays - 90) / 365)
 * Final score = rawScore × decayFactor
 */

const INACTIVITY_THRESHOLD_DAYS = 90;
const MAX_DECAY_DAYS = 365;
const MIN_DECAY_FACTOR = 0.5;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

export interface TrustScoreBreakdown {
  totalScore: number;
  components: Array<{
    label: string;
    weight: number;
    rawValue: number;
    normalizedValue: number;
    weightedValue: number;
  }>;
}

export class TrustScoreService {
  /**
   * Recalculate and persist the freelancer trust score.
   * Called after each completed contract / review submission.
   */
  async computeFreelancerTrustScore(userId: string): Promise<TrustScoreBreakdown> {
    const profile = await prisma.freelancerProfile.findUnique({
      where: { userId },
      select: { avgRating: true, completedJobs: true, totalReviews: true },
    });

    if (!profile) {
      return this.emptyBreakdown();
    }

    // 1. Average Rating (0-5 → 0-100)
    const avgRating = Number(profile.avgRating ?? 0);
    const normalizedRating = (avgRating / 5) * 100;

    // 2. Completion Rate: completed / total contracts (as percentage)
    const totalContracts = await prisma.contract.count({
      where: { freelancerId: userId },
    });
    const completedContracts = await prisma.contract.count({
      where: { freelancerId: userId, status: 'COMPLETED' },
    });
    const completionRate = totalContracts > 0 ? (completedContracts / totalContracts) * 100 : 0;

    // 3. Dispute Win Rate: disputes resolved in their favor / total disputes
    //    Default to 50 (neutral) when no disputes exist — a new freelancer
    //    without any disputes should not be penalized or rewarded.
    const totalDisputes = await prisma.dispute.count({
      where: {
        contract: { freelancerId: userId },
      },
    });
    const wonDisputes = await prisma.dispute.count({
      where: {
        contract: { freelancerId: userId },
        outcome: 'FREELANCER_WINS',
      },
    });
    const NEUTRAL_DISPUTE_SCORE = 50;
    const disputeWinRate = totalDisputes > 0 ? (wonDisputes / totalDisputes) * 100 : NEUTRAL_DISPUTE_SCORE;

    // 4. Experience: normalize completed jobs (cap at 50 for 100%)
    const experienceScore = Math.min((completedContracts / 50) * 100, 100);

    const components = [
      { label: 'Average Rating', weight: 0.4, rawValue: avgRating, normalizedValue: normalizedRating },
      { label: 'Completion Rate', weight: 0.3, rawValue: completionRate, normalizedValue: completionRate },
      { label: 'Dispute Win Rate', weight: 0.2, rawValue: disputeWinRate, normalizedValue: disputeWinRate },
      { label: 'Experience', weight: 0.1, rawValue: completedContracts, normalizedValue: experienceScore },
    ].map((c) => ({
      ...c,
      weightedValue: Math.round((c.normalizedValue * c.weight) * 100) / 100,
    }));

    const rawScore = Math.round(components.reduce((sum, c) => sum + c.weightedValue, 0) * 100) / 100;

    // Apply inactivity decay (M4-I6)
    const decayFactor = await this.getInactivityDecayFactor(userId);
    const totalScore = Math.round(rawScore * decayFactor * 100) / 100;

    // Persist
    await prisma.freelancerProfile.update({
      where: { userId },
      data: {
        trustScore: totalScore,
        completedJobs: completedContracts,
        successRate: Math.round(completionRate * 100) / 100,
      },
    });

    return { totalScore, components };
  }

  /**
   * Recalculate and persist the client trust score.
   * Called after each completed contract / review submission.
   */
  async computeClientTrustScore(userId: string): Promise<TrustScoreBreakdown> {
    const profile = await prisma.clientProfile.findUnique({
      where: { userId },
      select: { avgRating: true, hireRate: true, jobsPosted: true, totalReviews: true },
    });

    if (!profile) {
      return this.emptyBreakdown();
    }

    // 1. Average Rating (0-5 → 0-100)
    const avgRating = Number(profile.avgRating ?? 0);
    const normalizedRating = (avgRating / 5) * 100;

    // 2. Payment Punctuality: percentage of milestones approved without delay
    //    Approximate via completed contracts / total contracts
    const totalContracts = await prisma.contract.count({
      where: { clientId: userId },
    });
    const completedContracts = await prisma.contract.count({
      where: { clientId: userId, status: 'COMPLETED' },
    });
    const paymentPunctuality = totalContracts > 0 ? (completedContracts / totalContracts) * 100 : 0;

    // 3. Hire Rate: contracts created / jobs posted
    const jobsPosted = Number(profile.jobsPosted ?? 0);
    const hireRate = jobsPosted > 0 ? (totalContracts / jobsPosted) * 100 : 0;
    const normalizedHireRate = Math.min(hireRate, 100);

    // 4. Job Clarity Rating: average qualityRating from freelancer reviews
    //    (qualityRating is remapped to "Job Clarity" for freelancer→client reviews)
    const clarityAgg = await prisma.review.aggregate({
      where: {
        subjectId: userId,
        isPublic: true,
        qualityRating: { not: null },
      },
      _avg: { qualityRating: true },
    });
    const jobClarityRating = Number(clarityAgg._avg.qualityRating ?? 0);
    const normalizedClarity = (jobClarityRating / 5) * 100;

    const components = [
      { label: 'Average Rating', weight: 0.4, rawValue: avgRating, normalizedValue: normalizedRating },
      { label: 'Payment Punctuality', weight: 0.3, rawValue: paymentPunctuality, normalizedValue: paymentPunctuality },
      { label: 'Hire Rate', weight: 0.2, rawValue: hireRate, normalizedValue: normalizedHireRate },
      { label: 'Job Clarity Rating', weight: 0.1, rawValue: jobClarityRating, normalizedValue: normalizedClarity },
    ].map((c) => ({
      ...c,
      weightedValue: Math.round((c.normalizedValue * c.weight) * 100) / 100,
    }));

    const rawScore = Math.round(components.reduce((sum, c) => sum + c.weightedValue, 0) * 100) / 100;

    // Apply inactivity decay (M4-I6)
    const decayFactor = await this.getInactivityDecayFactor(userId);
    const totalScore = Math.round(rawScore * decayFactor * 100) / 100;

    // Persist
    await prisma.clientProfile.update({
      where: { userId },
      data: {
        trustScore: totalScore,
        hireRate: Math.round(normalizedHireRate * 100) / 100,
      },
    });

    return { totalScore, components };
  }

  /**
   * Get the breakdown by computing fresh values.
   */
  async getTrustScoreBreakdown(userId: string): Promise<TrustScoreBreakdown> {
    // Determine role by checking which profile exists
    const freelancer = await prisma.freelancerProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (freelancer) {
      return this.computeFreelancerTrustScore(userId);
    }

    const client = await prisma.clientProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (client) {
      return this.computeClientTrustScore(userId);
    }

    return this.emptyBreakdown();
  }

  private emptyBreakdown(): TrustScoreBreakdown {
    return { totalScore: 0, components: [] };
  }

  /**
   * Calculate inactivity decay factor (M4-I6).
   * Returns 1.0 for active users, gradually decreasing to MIN_DECAY_FACTOR
   * for users inactive > 90 days.
   */
  private async getInactivityDecayFactor(userId: string): Promise<number> {
    // Find most recent contract activity (created, updated, or completed)
    const latestContract = await prisma.contract.findFirst({
      where: {
        OR: [{ clientId: userId }, { freelancerId: userId }],
      },
      orderBy: { updatedAt: 'desc' },
      select: { updatedAt: true },
    });

    if (!latestContract) return 1.0; // New user, no decay

    const daysSinceActivity = Math.floor(
      (Date.now() - new Date(latestContract.updatedAt).getTime()) / MS_PER_DAY,
    );

    if (daysSinceActivity <= INACTIVITY_THRESHOLD_DAYS) return 1.0;

    const excessDays = daysSinceActivity - INACTIVITY_THRESHOLD_DAYS;
    return Math.max(MIN_DECAY_FACTOR, 1 - excessDays / MAX_DECAY_DAYS);
  }
}

export const trustScoreService = new TrustScoreService();
export default trustScoreService;
