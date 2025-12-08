// auth.api.ts

import api, { safeApiCall } from "../base.api";

export const completeCompanyProfileApi = async (body) => {
  console.log("body", body);
  return safeApiCall({
    apiCall: () => api.post("/company/complete-profile", body),
    showToaster: true,
  });
};
// /company/profile

export const getCompanyProfileApi = async () => {
  console.log("body");
  return safeApiCall({
    apiCall: () => api.get("/company/profile"),
    showToaster: true,
  });
};
export const updateCompanyProfileApi = async (body) => {
  return safeApiCall({
    apiCall: () => api.patch(`/company/update-profile`, body),
    showToaster: true,
  });
};
