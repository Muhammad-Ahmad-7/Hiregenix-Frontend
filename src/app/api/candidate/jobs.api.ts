//

// auth.api.ts

import { JobResponse } from "@/constants/Interfaces/Types/Jobs.interface";
import api, { safeApiCall } from "../base.api";

export const getRecommendedJobsApi = async () => {
  return safeApiCall<{ recommendedJobs: RecommendedJobsResponse }>({
    apiCall: () => api.get("/job/recommended-jobs"),
    showToaster: true,
  });
};

//   params: {
//     page: 1,
//     limit: 5,
//   }
// export const getAllJobsWithPagePaginationApi = async (params: {
//   page: number;
//   limit: number;
// }) => {
//   return safeApiCall({
//     apiCall: () =>
//       api.get("/job/all", {
//         params: params,
//       }),
//     showToaster: true,
//   });
// };
//
// export const getAllActiveJobsApi = async (params: {
//   page: number;
//   limit: number;
// }) => {
//   return safeApiCall({
//     apiCall: () =>
//       api.get("/job/all-applied-jobs", {
//         params: params,
//       }),
//     showToaster: true,
//   });
// };
//

export const getAllJobsWithScrollingApi = async (params: {
  limit: number;
  lastId?: string;
}) => {
  return safeApiCall<{ jobs: JobResponse[] }>({
    apiCall: () =>
      api.get("/job/get-all-jobs", {
        params: params,
      }),
    showToaster: true,
  });
};
interface saveApi {
  jobId: string;
  candidateId: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: 0;
}
export const saveJobApi = async (jobId: string) => {
  return safeApiCall<{ savedJob: saveApi }>({
    apiCall: () => api.post(`/job/save/${jobId}`),
    showToaster: true,
  });
};
export const unSaveJobApi = async (savedJobId: string) => {
  return safeApiCall<{ unSavedJob: saveApi }>({
    apiCall: () => api.delete(`/job/unsave/${savedJobId}`),
    showToaster: true,
  });
};
// /job/save
export interface SavedJobs {
  _id: string;
  jobId: JobResponse;
  candidateId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface RecommendedJobsResponse {
  _id: string;
  candidateId: string;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  recommendedJobs: RecommendedJob[];
}
export interface RecommendedJob {
  _id: string;
  jobId: string;
  title: string;
  role: string;
  companyName: string;
  companyLogo: string;
  workMode: "remote" | "onsite" | "hybrid";
  aiSummary: string;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export const getAllSaveJobsApi = async (params: {
  limit: number;
  page?: number;
}) => {
  return safeApiCall<{ savedJobs: SavedJobs[] }>({
    apiCall: () =>
      api.get("/job/save", {
        params,
      }),
    showToaster: true,
  });
};
