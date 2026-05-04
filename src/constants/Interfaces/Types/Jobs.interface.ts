import {
  ExperienceLevel,
  InterviewStatus,
  InterviewType,
  JobStatus,
  WorkMode,
} from "@/constants/enums";
import { CompanyResponse } from "./Profile.interface";

export interface JobResponse {
  _id: string;
  title: string;
  companyId: CompanyMini;
  aiSummary: string;
  embeddingSynced: boolean;
  qdrantId: string | null;
  isDeleted: boolean;
  //these at used at the candidate side
  company?: CompanyResponse;
  isSaved?: boolean;
  isApplied?: boolean;
  deadline: Date; // ISO date string
  createdAt: string;
  updatedAt: string;
  status: "open" | "closed";
  workMode: WorkMode;
  experienceLevel: ExperienceLevel;
  location: {
    city: string;
    country: string;
  };
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  role: string;
  requiredSkills: string[];
  requirements: string[];
  interviewGuideline: string;
  __v: number;
  totalInterviews: number
}

export interface JobPosting {
  _id: string;
  title: string;
  role: string;
  interviewGuideline?: string;
  experienceLevel?: ExperienceLevel;
  description: string;
  requiredSkills: string[];
  requirements: string[];
  workMode: WorkMode;
  location: Location;
  salaryRange: SalaryRange;
  deadline: string; // ISO date string
  status: "scheduled" | "completed" | "rejected" | "cancelled";
}

export interface JobUpdate {
  title: string;
  role: string;
  interviewGuideline?: string;
  experienceLevel?: ExperienceLevel;
  description: string;
  requiredSkills: string[];
  requirements: string[];
  workMode: WorkMode;
  location: Location;
  salaryRange: SalaryRange;
  deadline: string; // ISO date string
  status: "open" | "closed";
}

export interface JobPostingCompany {
  title: string;
  role: string;
  interviewGuideline?: string;
  experienceLevel?: ExperienceLevel;
  description: string;
  requiredSkills: string[];
  requirements: string[];
  workMode: WorkMode;
  location: Location;
  salaryRange: SalaryRange;
  deadline: string; // ISO date string
  status: JobStatus;
}


export interface JobPostingAI {
  jobTitle: string;
  jobRole: string;
  status: JobStatus;
  workMode: WorkMode;
  applicationDeadline: string; // ISO date string
  city: string;
  country: string;
  minSalary: number;
  maxSalary: number;
  currency: string;
  jobDescription: string;
  interviewGuideline: string;
  skills: string[];
  experienceLevel: ExperienceLevel;
  requirements: string[];
}

export interface Location {
  city: string;
  country: string;
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
}
export interface AiResult {
  strengths: string[];
  improvements: string[];
}

export interface AppliedJob {
  _id: string;
  candidateId: string;
  companyId: string;
  jobId: { title: string, role: string, workMode: WorkMode, deadline: string };
  type: "live" | "recorded";
  scheduledDate: string; // ISO Date
  status: "scheduled" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  aiResult: AiResult;

  __v: number;
}
export interface ScheduledInterview {
  _id: string;
  candidateId: string;
  company: CompanyMini;
  job: JobPosting;
  type: "live" | "recorded";
  scheduledDate: string; // ISO string
  status: "scheduled" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  report: {
    topStrengths: string[];
    topWeaknesses: string[];
    overallImprovementSuggestions: string[];
  }
  __v: number;
  _raw: ScheduledInterview;
  rank: number;
  totalApplicants: number;
}

export interface TodayInterviews {
  _id: string;
  candidateId: string;
  companyId: CompanyMini;
  jobId: JobMini;
  type: "live" | "recorded";
  scheduledDate: string; // ISO string
  status: "scheduled" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  report: {
    topStrengths: string[];
    topWeaknesses: string[];
    overallImprovementSuggestions: string[];
  }
  __v: number;
}

export interface ScheduledInterviewSimple {
  _id: string;
  candidateId: string;
  companyId: string; // just the ID
  jobId: string; // just the ID
  type: InterviewType;
  scheduledDate: string; // ISO string
  status: InterviewStatus;
  aiResult: AiResult;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CompanyMini {
  _id: string;
  companyName: string;
  logoUrl: string;
}
export interface JobMini {
  _id: string;
  title: string;
  role: string;
  workMode: "remote" | "onsite" | "hybrid";
  deadline: string; // ISO string
}

export interface ScheduledInterviewWithCandidate {
  _id: string;
  candidate: CandidateMini;
  companyId: string; // just ID
  jobId: string; // just ID
  type: InterviewType;
  scheduledDate: string; // ISO string
  status: InterviewStatus;
  aiResult: AiResult;
  createdAt: string;
  updatedAt: string;
  totalInterviews: number; // total interviews for this job
  __v: number;
  rank: number; // candidate's rank among all applicants for this job
}
export interface CandidateMini {
  _id: string;
  fullName: string;
  profilePictureUrl: string;
}


export interface GetInterviewDataByIdApiResponse {
  _id: string;
  candidateId: string;
  companyId: CompanyMini;
  jobId: JobMini;
  type: "live";
  questions: string[];
  createdAt: string;
  updatedAt: string;
  scheduledDate: string;
  status: "scheduled" | "completed" | "cancelled";
  aiResult: AiResult;
  __v: number;
}

export interface InterviewVideoUploadSignedUrlApiResponse {
  cloudName: string;
  apiKey: string;
  signature: string;
  timestamp: string;
  publicId: string;
}

export interface InterviewQuestionResultApiResponse {
  _id: string;
  status: 'PROCESSING' | 'DONE' | 'FAILED';
  stages: {
    uploaded: boolean;
  }
}