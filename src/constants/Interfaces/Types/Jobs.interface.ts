import {
  ExperienceLevel,
  InterviewStatus,
  InterviewType,
  JobStatus,
  WorkMode,
} from "@/constants/enums";
import { CompanyResponse } from "./Profile.interface";

export interface JobResponse extends JobPosting {
  _id: string;
  companyId: CompanyMini;
  aiSummary: string;
  embeddingSynced: boolean;
  qdrantId: string | null;
  isDeleted: boolean;
  //these at used at the candidate side
  company?: CompanyResponse;
  isSaved?: boolean;
  ////////
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface JobPosting {
  title: string;
  role: string;
  interviewGuideline?: string;
  experienceLevel?: ExperienceLevel;
  description: string;
  requiredSkills: string[];
  requirements: string[];
  workMode?: WorkMode;
  location: Location;
  salaryRange: SalaryRange;
  deadline?: string; // ISO date string
  status: JobStatus;
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
  jobId: { title: string };
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
  companyId: CompanyMini;
  jobId: JobMini;
  type: "live" | "recorded";
  scheduledDate: string; // ISO string
  status: "scheduled" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  aiResult: AiResult;
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
  candidateId: CandidateMini;
  companyId: string; // just ID
  jobId: string; // just ID
  type: InterviewType;
  scheduledDate: string; // ISO string
  status: InterviewStatus;
  aiResult: AiResult;
  createdAt: string;
  updatedAt: string;
  __v: number;
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