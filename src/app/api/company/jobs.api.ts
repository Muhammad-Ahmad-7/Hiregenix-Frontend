// auth.api.ts

import {
  JobPostingAI,
  JobResponse,
} from "@/constants/Interfaces/Types/Jobs.interface";
import api, { safeApiCall } from "../base.api";
import {
  CompanyResponse,
  CompleteCompanyProfile,
} from "@/constants/Interfaces/Types/Profile.interface";

export const getCompanyOpenJobsApi = async (page: number) => {
  return safeApiCall<{ findActiveJobs: JobResponse[] }>({
    apiCall: () =>
      api.get("/job/get-company-jobs/open", {
        params: {
          page: page,
        },
      }),
    showToaster: true,
  });
};
export const getCompanyClosedJobsApi = async (page: number) => {
  return safeApiCall<{ findClosedJobs: JobResponse[] }>({
    apiCall: () =>
      api.get("/job/get-company-jobs/closed", {
        params: {
          page: page,
        },
      }),
    showToaster: true,
  });
};
//
export const deleteJobApi = async (jobId: string) => {
  return safeApiCall<null>({
    apiCall: () =>
      api.delete("/job/delete-job", {
        data: { jobId },
      }),
    showToaster: true,
  });
};
export const updateJobApi = async ({
  jobId,
  body,
}: {
  jobId: string;
  body: { deadline: string };
}) => {
  console.log("first");
  return safeApiCall<{ updatedJob: JobResponse }>({
    apiCall: () => api.patch(`/job/update-job-by-id/${jobId}`, body),
    showToaster: true,
  });
};
// export const updateCandidateProfileApi = async (body, candidateId) => {
//   return safeApiCall({
//     apiCall: () => api.patch(`/candidate/update-profile/${candidateId}`, body),
//     showToaster: true,
//   });
// };

export const completeCompanyProfileApi = async (
  body: CompleteCompanyProfile
) => {
  console.log("body", body);
  return safeApiCall<{ company: CompanyResponse }>({
    apiCall: () => api.post("/company/complete-profile", body),
    showToaster: true,
  });
};


export const generateJobDataUsingAIApi = async ({ jobTitle, jobRole, experienceLevel, workMode, skills, type }: {
  jobTitle: string;
  jobRole: string;
  experienceLevel: string;
  workMode: string;
  skills: string[];
  type: "requirements" | "interviewGuideline" | "description";
}) => {
  return safeApiCall<{ jobData: JobPostingAI }>({
    apiCall: () => api.post(`/job/generate-job-ai`, {
      jobTitle,
      jobRole,
      experienceLevel,
      workMode,
      skills,
      type
    }),
  });
};


export const generateJobDescriptionUsingAI = async ({ jobTitle, jobRole, experienceLevel, workMode, skills }: {
  jobTitle: string;
  jobRole: string;
  experienceLevel: string;
  workMode: string;
  skills: string[];
}) => {
  return safeApiCall<{ jobData: { description: string } }>({
    apiCall: () => api.post(`/job/generate-job-ai/`, {
      jobTitle,
      jobRole,
      experienceLevel,
      workMode,
      skills
    }),
  });
};


export const sendHiringEmailApi = async (interviewId: string, emailQuery: string) => {
  return safeApiCall<{ taskId: string }>({
    apiCall: () => api.post(`/interview/send-hiring-email`, { interviewId, emailQuery }),
    showToaster: true,
  });
}

export const sendRejectionEmailApi = async (interviewId: string) => {
  return safeApiCall<{ taskId: string }>({
    apiCall: () => api.post(`/interview/send-rejection-email`, { interviewId }),
    showToaster: true,
  });
}