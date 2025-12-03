// auth.api.ts

import api, { safeApiCall } from "../base.api";

export const getCompanyOpenJobsApi = async () => {
  return safeApiCall({
    apiCall: () => api.get("/job/get-company-jobs/open"),
    showToaster: true,
  });
};
export const getCompanyClosedJobsApi = async () => {
  return safeApiCall({
    apiCall: () => api.get("/job/get-company-jobs/closed"),
    showToaster: true,
  });
};
//
export const deleteJobApi = async (body: { jobId: string }) => {
  console.log(body);
  return safeApiCall({
    apiCall: () => api.delete("/job/delete-job", body),
    showToaster: true,
  });
};
export const updateCandidateProfileApi = async (body, candidateId) => {
  return safeApiCall({
    apiCall: () => api.patch(`/candidate/update-profile/${candidateId}`, body),
    showToaster: true,
  });
};

export const completeCompanyProfileApi = async (body) => {
  console.log("body", body);
  return safeApiCall({
    apiCall: () => api.post("/company/complete-profile", body),
    showToaster: true,
  });
};
