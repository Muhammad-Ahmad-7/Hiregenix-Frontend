// /candidate/get-candidate-dashboard-stats

import { CandidateDashboardResponse } from "@/constants/Interfaces/Types/Dashboard.interface";
import api, { safeApiCall } from "../base.api";

export const getCandidateStatsApi = async () => {
  console.log("body");
  return safeApiCall<CandidateDashboardResponse>({
    apiCall: () => api.get("/candidate/get-candidate-dashboard-stats"),
    showToaster: true,
  });
};
// /company/profile
