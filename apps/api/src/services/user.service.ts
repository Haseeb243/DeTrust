import { prisma } from '../config/database';
import { NotFoundError, ForbiddenError } from '../middleware';
import { 
  UpdateUserInput, 
  UpdateFreelancerProfileInput, 
  UpdateClientProfileInput,
  GetUsersQuery,
  AddEducationInput,
} from '../validators';

export class UserService {
  /**
   * Get user by ID with profile
   */
  async getUserById(id: string, includeProfile = true) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: includeProfile ? {
        freelancerProfile: {
          include: {
            skills: {
              include: { skill: true },
            },
            certifications: true,
            education: true,
            experience: true,
          },
        },
        clientProfile: true,
      } : undefined,
    });
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    // Remove sensitive fields
    const { passwordHash, twoFactorSecret, nonce, ...safeUser } = user;
    
    return safeUser;
  }
  
  /**
   * Get public profile (for viewing other users)
   */
  async getPublicProfile(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        freelancerProfile: {
          select: {
            title: true,
            bio: true,
            hourlyRate: true,
            location: true,
            trustScore: true,
            aiCapabilityScore: true,
            completedJobs: true,
            avgRating: true,
            totalReviews: true,
            availability: true,
            timezone: true,
            languages: true,
            portfolioLinks: true,
            resumeUrl: true,
            profileComplete: true,
            skills: {
              include: { skill: true },
            },
            certifications: true,
            education: true,
            experience: true,
          },
        },
        clientProfile: {
          select: {
            companyName: true,
            industry: true,
            location: true,
            trustScore: true,
            jobsPosted: true,
            hireRate: true,
            avgRating: true,
            totalReviews: true,
            paymentVerified: true,
            profileComplete: true,
            completenessScore: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  /**
   * Get client public profile with recent work history
   */
  async getClientPublicProfile(clientId: string) {
    const user = await prisma.user.findUnique({
      where: { id: clientId },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        clientProfile: {
          select: {
            companyName: true,
            companySize: true,
            companyWebsite: true,
            description: true,
            industry: true,
            location: true,
            trustScore: true,
            jobsPosted: true,
            hireRate: true,
            avgRating: true,
            totalReviews: true,
            totalSpent: true,
            paymentVerified: true,
            profileComplete: true,
            completenessScore: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const recentContracts = await prisma.contract.findMany({
      where: {
        clientId,
        status: 'COMPLETED',
      },
      select: {
        id: true,
        title: true,
        totalAmount: true,
        completedAt: true,
        freelancer: {
          select: { name: true },
        },
      },
      orderBy: { completedAt: 'desc' },
      take: 5,
    });

    return { user, recentContracts };
  }

  /**
   * Update user basic info
   */
  async updateUser(userId: string, data: UpdateUserInput) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      include: {
        freelancerProfile: true,
        clientProfile: true,
      },
    });

    // Auto-verify payment when wallet is linked for clients
    if (data.walletAddress && user.role === 'CLIENT' && user.clientProfile && !user.clientProfile.paymentVerified) {
      await prisma.clientProfile.update({
        where: { userId },
        data: { paymentVerified: true },
      });
      user.clientProfile.paymentVerified = true;
    }

    const { passwordHash, twoFactorSecret, nonce, ...safeUser } = user;
    return safeUser;
  }
  
  /**
   * Update freelancer profile
   */
  async updateFreelancerProfile(userId: string, data: UpdateFreelancerProfileInput) {
    // Verify user is a freelancer
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { freelancerProfile: true },
    });
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    if (user.role !== 'FREELANCER') {
      throw new ForbiddenError('Only freelancers can update freelancer profile');
    }
    
    // Create profile if doesn't exist
    if (!user.freelancerProfile) {
      await prisma.freelancerProfile.create({
        data: { userId },
      });
    }
    
    // Update profile
    const profile = await prisma.freelancerProfile.update({
      where: { userId },
      data: {
        ...data,
        hourlyRate: data.hourlyRate ?? undefined,
      },
      include: {
        skills: { include: { skill: true } },
        certifications: true,
        education: true,
        experience: true,
      },
    });
    
    // Calculate profile completeness and AI capability score
    await this.updateProfileCompleteness(userId);
    await this.calculateAiCapabilityScore(userId);

    return profile;
  }
  
  /**
   * Update client profile
   */
  async updateClientProfile(userId: string, data: UpdateClientProfileInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { clientProfile: true },
    });
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    if (user.role !== 'CLIENT') {
      throw new ForbiddenError('Only clients can update client profile');
    }
    
    // Create profile if doesn't exist
    if (!user.clientProfile) {
      await prisma.clientProfile.create({
        data: { userId },
      });
    }
    
    const profile = await prisma.clientProfile.update({
      where: { userId },
      data,
    });

    // Calculate client profile completeness
    await this.updateClientProfileCompleteness(userId);

    return profile;
  }

  /**
   * Add skill to freelancer profile
   */
  async addSkill(userId: string, skillId: string, yearsExperience?: number, proficiencyLevel?: number) {
    const profile = await prisma.freelancerProfile.findUnique({
      where: { userId },
    });
    
    if (!profile) {
      throw new NotFoundError('Freelancer profile not found');
    }
    
    // Check if skill exists
    const skill = await prisma.skill.findUnique({
      where: { id: skillId },
    });
    
    if (!skill) {
      throw new NotFoundError('Skill not found');
    }
    
    // Add skill
    const freelancerSkill = await prisma.freelancerSkill.upsert({
      where: {
        freelancerProfileId_skillId: {
          freelancerProfileId: profile.id,
          skillId,
        },
      },
      update: {
        yearsExperience,
        proficiencyLevel,
      },
      create: {
        freelancerProfileId: profile.id,
        skillId,
        yearsExperience,
        proficiencyLevel,
      },
      include: { skill: true },
    });
    
    await this.updateProfileCompleteness(userId);
    await this.calculateAiCapabilityScore(userId);

    return freelancerSkill;
  }
  
  /**
   * Remove skill from freelancer profile
   */
  async removeSkill(userId: string, skillId: string) {
    const profile = await prisma.freelancerProfile.findUnique({
      where: { userId },
    });
    
    if (!profile) {
      throw new NotFoundError('Freelancer profile not found');
    }
    
    await prisma.freelancerSkill.delete({
      where: {
        freelancerProfileId_skillId: {
          freelancerProfileId: profile.id,
          skillId,
        },
      },
    });
    
    await this.updateProfileCompleteness(userId);
    await this.calculateAiCapabilityScore(userId);

    return { success: true };
  }

  /**
   * Add education entry to freelancer profile
   */
  async addEducation(userId: string, data: AddEducationInput) {
    const profile = await prisma.freelancerProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundError('Freelancer profile not found');
    }

    const education = await prisma.education.create({
      data: {
        freelancerProfileId: profile.id,
        institution: data.institution,
        degree: data.degree,
        fieldOfStudy: data.fieldOfStudy,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        description: data.description,
      },
    });

    await this.updateProfileCompleteness(userId);
    await this.calculateAiCapabilityScore(userId);
    return education;
  }

  /**
   * Remove education entry
   */
  async removeEducation(userId: string, educationId: string) {
    const profile = await prisma.freelancerProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundError('Freelancer profile not found');
    }

    const deleted = await prisma.education.deleteMany({
      where: {
        id: educationId,
        freelancerProfileId: profile.id,
      },
    });

    if (deleted.count === 0) {
      throw new NotFoundError('Education entry not found');
    }

    await this.updateProfileCompleteness(userId);
    await this.calculateAiCapabilityScore(userId);
    return { success: true };
  }

  /**
   * Remove certification entry and associated secure file if present
   */
  async removeCertification(userId: string, certificationId: string) {
    const profile = await prisma.freelancerProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundError('Freelancer profile not found');
    }

    const certification = await prisma.certification.findFirst({
      where: {
        id: certificationId,
        freelancerProfileId: profile.id,
      },
    });

    if (!certification) {
      throw new NotFoundError('Certification not found');
    }

    await prisma.certification.delete({ where: { id: certification.id } });

    const fileId = this.extractSecureFileId(certification.credentialUrl);
    if (fileId) {
      await prisma.secureFile.deleteMany({
        where: {
          id: fileId,
          userId,
        },
      });
    }

    await this.updateProfileCompleteness(userId);
    await this.calculateAiCapabilityScore(userId);
    return { success: true };
  }

  /**
   * Search freelancers
   */
  async searchFreelancers(query: GetUsersQuery) {
    const { page, limit, sort, order, search, skills, minTrustScore, minRating } = query;
    
    const profileFilter = {
      ...(minTrustScore && { trustScore: { gte: minTrustScore } }),
      ...(minRating && { avgRating: { gte: minRating } }),
      ...(skills && {
        skills: {
          some: {
            skillId: { in: skills.split(',') },
          },
        },
      }),
    };
    
    const where = {
      role: 'FREELANCER' as const,
      status: 'ACTIVE' as const,
      freelancerProfile: {
        is: profileFilter,
      },
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { freelancerProfile: { title: { contains: search, mode: 'insensitive' as const } } },
          { freelancerProfile: { bio: { contains: search, mode: 'insensitive' as const } } },
        ],
      }),
    };
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          freelancerProfile: {
            include: {
              skills: { include: { skill: true } },
            },
          },
        },
        orderBy: sort === 'createdAt' 
          ? { createdAt: order }
          : { freelancerProfile: { [sort]: order } },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);
    type UserResult = Awaited<ReturnType<typeof prisma.user.findMany>>[number];
    const sanitizedUsers = users.map((user: UserResult) => {
      const { passwordHash, twoFactorSecret, nonce, ...safeUser } = user;
      return safeUser;
    });
    
    return {
      items: sanitizedUsers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    };
  }
  
  /**
   * Set user role (for onboarding)
   */
  async setRole(userId: string, role: 'CLIENT' | 'FREELANCER') {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });
    
    // Create appropriate profile
    if (role === 'FREELANCER') {
      await prisma.freelancerProfile.upsert({
        where: { userId },
        update: {},
        create: { userId },
      });
    } else if (role === 'CLIENT') {
      await prisma.clientProfile.upsert({
        where: { userId },
        update: {},
        create: { userId },
      });
    }
    
    return user;
  }

  /**
   * Update KYC data for a user
   */
  async updateKyc(userId: string, data: { documentType: string; idNumber: string; country: string }) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        kycDocumentType: data.documentType,
        kycIdNumber: data.idNumber,
        kycCountry: data.country,
        kycStatus: 'PENDING',
      },
      select: {
        id: true,
        kycStatus: true,
        kycDocumentType: true,
        kycCountry: true,
      },
    });
  }

  /**
   * Calculate and update profile completeness
   */
  private async updateProfileCompleteness(userId: string) {
    const profile = await prisma.freelancerProfile.findUnique({
      where: { userId },
      include: {
        skills: true,
        certifications: true,
        education: true,
        experience: true,
      },
    });
    
    if (!profile) return;
    
    let score = 0;
    const weights = {
      title: 10,
      bio: 12,
      hourlyRate: 8,
      skills: 20, // At least 3 skills
      portfolioLinks: 12,
      location: 5,
      languages: 5,
      timezone: 3,
      education: 10,
      experience: 15,
    };

    if (profile.title) score += weights.title;
    if (profile.bio && profile.bio.length >= 120) score += weights.bio;
    if (profile.hourlyRate) score += weights.hourlyRate;
    if (profile.skills.length >= 3) score += weights.skills;
    if (profile.portfolioLinks.length > 0) score += weights.portfolioLinks;
    if (profile.location) score += weights.location;
    if (profile.languages.length > 0) score += weights.languages;
    if (profile.timezone) score += weights.timezone;
    if (profile.education.length > 0) score += weights.education;
    if (profile.experience.length > 0) score += weights.experience;
    
    await prisma.freelancerProfile.update({
      where: { userId },
      data: {
        completenessScore: score,
        profileComplete: score >= 70,
      },
    });
  }

  /**
   * Calculate and update client profile completeness
   */
  private async updateClientProfileCompleteness(userId: string) {
    const profile = await prisma.clientProfile.findUnique({
      where: { userId },
    });

    if (!profile) return;

    let score = 0;
    const weights = {
      companyName: 25,
      description: 25,
      industry: 15,
      companySize: 10,
      companyWebsite: 15,
      location: 10,
    };

    if (profile.companyName) score += weights.companyName;
    if (profile.description && profile.description.length >= 50) score += weights.description;
    if (profile.industry) score += weights.industry;
    if (profile.companySize) score += weights.companySize;
    if (profile.companyWebsite) score += weights.companyWebsite;
    if (profile.location) score += weights.location;

    await prisma.clientProfile.update({
      where: { userId },
      data: {
        completenessScore: score,
        profileComplete: score >= 70,
      },
    });
  }

  /**
   * Calculate and update AI capability score (0-100) for a freelancer
   */
  async calculateAiCapabilityScore(userId: string): Promise<number> {
    const profile = await prisma.freelancerProfile.findUnique({
      where: { userId },
      include: {
        skills: true,
        certifications: true,
      },
    });

    if (!profile) return 0;

    // Query contract counts for this freelancer
    const [totalContracts, completedContracts] = await Promise.all([
      prisma.contract.count({
        where: { freelancerId: userId },
      }),
      prisma.contract.count({
        where: { freelancerId: userId, status: 'COMPLETED' },
      }),
    ]);

    // Query average rating from reviews received
    const reviewAgg = await prisma.review.aggregate({
      where: { subjectId: userId },
      _avg: { overallRating: true },
    });

    // Skills breadth (25 points): up to 5 skills = max
    const skillPoints = Math.min(25, profile.skills.length * 5);

    // Completed jobs (25 points): up to 5 jobs = max
    const completedJobPoints = Math.min(25, completedContracts * 5);

    // Success rate (20 points): successfulJobs / totalJobs * 20 (0 if no jobs)
    const successRatePoints = totalContracts > 0
      ? (completedContracts / totalContracts) * 20
      : 0;

    // Average rating (15 points): avgRating / 5 * 15 (0 if no reviews)
    const avgRating = reviewAgg._avg.overallRating
      ? Number(reviewAgg._avg.overallRating)
      : 0;
    const ratingPoints = avgRating > 0 ? (avgRating / 5) * 15 : 0;

    // Certifications (10 points): up to 2 certs = max
    const certPoints = Math.min(10, profile.certifications.length * 5);

    // Profile completeness (5 points): completenessScore / 100 * 5
    const completenessPoints = (profile.completenessScore / 100) * 5;

    const totalScore = Math.round(
      skillPoints + completedJobPoints + successRatePoints + ratingPoints + certPoints + completenessPoints
    );

    // Clamp to 0-100
    const finalScore = Math.min(100, Math.max(0, totalScore));

    // Update the freelancer profile
    await prisma.freelancerProfile.update({
      where: { userId },
      data: { aiCapabilityScore: finalScore },
    });

    return finalScore;
  }

  private extractSecureFileId(url?: string | null) {
    if (!url) return null;
    const match = url.match(/\/uploads\/([^/?#]+)/i);
    return match ? match[1] : null;
  }
}

export const userService = new UserService();
export default userService;
