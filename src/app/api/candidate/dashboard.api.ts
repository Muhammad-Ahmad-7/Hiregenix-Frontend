// /candidate/get-candidate-dashboard-stats

import api, { safeApiCall } from "../base.api";

export const getCandidateStatsApi = async () => {
  console.log("body");
  return safeApiCall({
    apiCall: () => api.get("/candidate/get-candidate-dashboard-stats"),
    showToaster: true,
  });
};
// /company/profile
