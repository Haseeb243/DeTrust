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
            skills: {
              where: { verificationStatus: 'VERIFIED' },
              include: { skill: true },
            },
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
    
    // Calculate profile completeness
    await this.updateProfileCompleteness(userId);
    
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
      role: 'FREELANCER',
      status: 'ACTIVE',
      freelancerProfile: {
        is: profileFilter,
      },
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { freelancerProfile: { title: { contains: search, mode: 'insensitive' } } },
          { freelancerProfile: { bio: { contains: search, mode: 'insensitive' } } },
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
      bio: 15,
      hourlyRate: 10,
      skills: 20, // At least 3 skills
      portfolioLinks: 15,
      location: 5,
      education: 10,
      experience: 15,
    };
    
    if (profile.title) score += weights.title;
    if (profile.bio && profile.bio.length >= 100) score += weights.bio;
    if (profile.hourlyRate) score += weights.hourlyRate;
    if (profile.skills.length >= 3) score += weights.skills;
    if (profile.portfolioLinks.length > 0) score += weights.portfolioLinks;
    if (profile.location) score += weights.location;
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

  private extractSecureFileId(url?: string | null) {
    if (!url) return null;
    const match = url.match(/\/uploads\/([^/?#]+)/i);
    return match ? match[1] : null;
  }
}

export const userService = new UserService();
export default userService;
