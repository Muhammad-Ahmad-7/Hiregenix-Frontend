// auth.api.ts

import api, { safeApiCall } from "../base.api";

export const getCandidateProfileApi = async () => {
  return safeApiCall({
    apiCall: () => api.get("/candidate/profile"),
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
