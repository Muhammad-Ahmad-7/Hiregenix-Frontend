// auth.api.ts

import { CompanyDashboardResponse } from "@/constants/Interfaces/Types/Dashboard.interface";
import api, { safeApiCall } from "../base.api";

export const getCompanyStatsApi = async () => {
  console.log("body");
  return safeApiCall<CompanyDashboardResponse>({
    apiCall: () => api.get("/company/get-dashboard-stats"),
    showToaster: true,
  });
};
// /company/profile
