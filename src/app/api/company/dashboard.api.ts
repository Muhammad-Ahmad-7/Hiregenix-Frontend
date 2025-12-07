// auth.api.ts

import api, { safeApiCall } from "../base.api";

export const getCompanyStatsApi = async () => {
  console.log("body");
  return safeApiCall({
    apiCall: () => api.get("/company/get-dashboard-stats"),
    showToaster: true,
  });
};
// /company/profile
