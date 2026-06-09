import {
  Gender,
  HiringStatus,
  InterviewStatus,
  InterviewType,
} from "@/constants/enums";
import { Role } from "./Auth.interface";
import { AiResult, CompanyMini, JobResponse } from "./Jobs.interface";

export interface UserDetail {
  _id: string;
  email: string;
  role: Role;
}
export interface CompleteCompanyProfile {
  companyName: string;

  city: string;
  country: string;
  foundedYear: number;

  ntnNumber: string;

  logoUrl: string;
  website: string;

  description: string;
  contactEmail?: string;
  linkedInUrl: string;
  techStack: string[];

  hiringStatus: HiringStatus;
  knowledgeBaseUrl?: string;
}

export interface CompanyResponse extends CompleteCompanyProfile {
  _id: string;
  userId: UserDetail;

  isVerified: boolean;

  isDeleted: boolean | string; // backend inconsistency handled
  isProfileCompleted: boolean;

  createdAt: string; // ISO date
  updatedAt: string; // ISO date

  __v: number;
}
export interface CompleteCandidateProfile {
  fullName: string;
  dateOfBirth: string; // ISO
  gender: Gender;
  country: string;
  city: string;
  contactNumber: string;
  profilePictureUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  bio: string;
  tagline: string;
}
export interface CandidateProfileResponse extends CompleteCandidateProfile {
  _id?: string;
  userId: UserDetail;
  resumeId?: string;
  isProfileCompleted: boolean;
  isDeleted?: boolean | string;
  aiDescription?: string;
  embeddingSync?: boolean;
  profilePictureUrl: string;
  qdrantId?: string;
  resumeUrl?: string;
  //   userType?: "candidate";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface InterviewResponse {
  _id: string;

  aiResult: AiResult;

  candidateId: CandidateProfileResponse;
  companyId: CompanyMini;
  jobId: JobResponse;

  type: InterviewType;
  scheduledDate: string;

  status: InterviewStatus;

  createdAt: string;
  updatedAt: string;

  __v: number;
}
