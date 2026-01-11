import { AppliedJob, JobResponse } from "./Jobs.interface";
import { InterviewResponse } from "./Profile.interface";

export interface CompanyDashboardResponse {
  postedJobsCount: number;
  activeJobsCount: number;
  appliedJobsCount: number;
  closedJobsCount: number;
  activeJobs: JobResponse[];
  recentApplications: InterviewResponse[];
}

export interface CandidateDashboardResponse {
  userAppliedJobsCount: number;
  resumeScore: number;
  userActiveJobsCount: number;
  matchedJobsCounts: number;
  recentAppliedJobs: AppliedJob[];
  getTodaysInterview: InterviewResponse[];
}
