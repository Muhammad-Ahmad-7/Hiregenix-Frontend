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
