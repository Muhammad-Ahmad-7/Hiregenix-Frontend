// auth.api.ts

import api, { safeApiCall } from "../base.api";

export const getAllJobsApplicationsApi = async () => {
  console.log("body");
  return safeApiCall({
    apiCall: () => api.get("/job/get-company-jobs"),
    showToaster: true,
  });
};
// /job/interview-applications/
export const getSpecificJobApplicationsApi = async (
  jobId: string,
  params: { page: number; limit: number }
) => {
  return safeApiCall({
    apiCall: () =>
      api.get(`/job/interview-applications/${jobId}`, {
        params,
      }),
    showToaster: true,
  });
};

// /company/profile
