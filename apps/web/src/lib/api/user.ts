import { api } from './client';

// User types
export interface User {
  id: string;
  email?: string;
  walletAddress?: string;
  name?: string;
  avatarUrl?: string;
  role: 'CLIENT' | 'FREELANCER' | 'ADMIN';
  status: string;
  createdAt: string;
  freelancerProfile?: FreelancerProfile;
  clientProfile?: ClientProfile;
}

export interface FreelancerProfile {
  id: string;
  title?: string;
  bio?: string;
  hourlyRate?: number;
  availability?: string;
  location?: string;
  timezone?: string;
  languages: string[];
  portfolioLinks: string[];
  resumeUrl?: string | null;
  trustScore: number;
  aiCapabilityScore: number;
  completedJobs: number;
  avgRating: number;
  totalReviews: number;
  completenessScore: number;
  profileComplete: boolean;
  skills: FreelancerSkill[];
  education?: EducationEntry[];
  certifications?: CertificationEntry[];
}

export interface FreelancerSkill {
  skillId: string;
  skill: {
    id: string;
    name: string;
    category: string;
  };
  yearsExperience?: number;
  proficiencyLevel?: number;
  verificationStatus: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  issueDate?: string | null;
  expiryDate?: string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface EducationPayload {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface ClientProfile {
  id: string;
  companyName?: string;
  companySize?: string;
  industry?: string;
  companyWebsite?: string;
  description?: string;
  location?: string;
  trustScore: number;
  jobsPosted: number;
  hireRate: number;
  avgRating: number;
  totalReviews: number;
  paymentVerified: boolean;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface FreelancerSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  skills?: string;
  minTrustScore?: number;
  minRating?: number;
  sort?: 'trustScore' | 'avgRating' | 'completedJobs' | 'createdAt';
  order?: 'asc' | 'desc';
}

// User API functions
export const userApi = {
  // Get current user
  getMe: () => 
    api.get<User>('/users/me'),
  
  // Update current user
  updateMe: (data: { name?: string; avatarUrl?: string }) => 
    api.patch<User>('/users/me', data),
  
  // Set role (onboarding)
  setRole: (role: 'CLIENT' | 'FREELANCER') => 
    api.post<User>('/users/me/role', { role }),
  
  // Get public profile
  getUser: (id: string) => 
    api.get<User>(`/users/${id}`),
  
  // Freelancer profile
  updateFreelancerProfile: (data: Partial<Omit<FreelancerProfile, 'id' | 'skills'>>) => 
    api.patch<FreelancerProfile>('/users/me/freelancer', data),
  
  addSkill: (skillId: string, yearsExperience?: number, proficiencyLevel?: number) => 
    api.post<FreelancerSkill>('/users/me/skills', { skillId, yearsExperience, proficiencyLevel }),
  
  removeSkill: (skillId: string) => 
    api.delete(`/users/me/skills/${skillId}`),

  addEducation: (data: EducationPayload) => 
    api.post<EducationEntry>('/users/me/education', data),

  removeEducation: (educationId: string) => 
    api.delete(`/users/me/education/${educationId}`),
  
  // Client profile
  updateClientProfile: (data: Partial<Omit<ClientProfile, 'id'>>) => 
    api.patch<ClientProfile>('/users/me/client', data),
  
  // Search
  searchFreelancers: (params?: FreelancerSearchParams) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return api.get<PaginatedResponse<User>>(`/users/freelancers${query ? `?${query}` : ''}`);
  },
};

export default userApi;
