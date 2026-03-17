// auth.api.ts

import {
  JobPosting,
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
  body: JobPosting;
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


export const generateJobDataUsingAIApi = async (jobTitle: string) => {
  return safeApiCall<{ jobData: JobPostingAI }>({
    apiCall: () => api.get(`/job/generate-job-ai/${jobTitle}`),
  });
};