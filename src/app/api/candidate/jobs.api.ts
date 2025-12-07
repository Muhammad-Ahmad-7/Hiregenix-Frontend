//

// auth.api.ts

import api, { safeApiCall } from "../base.api";

export const getRecommendedJobsApi = async () => {
  return safeApiCall({
    apiCall: () => api.get("/job/recommended-jobs"),
    showToaster: true,
  });
};

//   params: {
//     page: 1,
//     limit: 5,
//   }
export const getAllJobsWithPagePaginationApi = async (params: {
  page: number;
  limit: number;
}) => {
  return safeApiCall({
    apiCall: () =>
      api.get("/job/all", {
        params: params,
      }),
    showToaster: true,
  });
};
//
export const getAllActiveJobsApi = async (params: {
  page: number;
  limit: number;
}) => {
  return safeApiCall({
    apiCall: () =>
      api.get("/job/all-applied-jobs", {
        params: params,
      }),
    showToaster: true,
  });
};
//

export const getAllJobsWithScrollingApi = async (params: {
  limit: number;
  lastId?: string;
}) => {
  return safeApiCall({
    apiCall: () =>
      api.get("/job/get-all-jobs", {
        params: params,
      }),
    showToaster: true,
  });
};

export const saveJobApi = async (jobId: string) => {
  return safeApiCall({
    apiCall: () => api.post(`/job/save/${jobId}`),
    showToaster: true,
  });
};
export const unSaveJobApi = async (savedJobId: string) => {
  return safeApiCall({
    apiCall: () => api.delete(`/job/unsave/${savedJobId}`),
    showToaster: true,
  });
};
// /job/save

export const getAllSaveJobsApi = async (params: {
  limit: number;
  page?: number;
}) => {
  return safeApiCall({
    apiCall: () =>
      api.get("/job/save", {
        params,
      }),
    showToaster: true,
  });
};
