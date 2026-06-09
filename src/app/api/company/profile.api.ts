// auth.api.ts

import {
  CompanyResponse,
  CompleteCompanyProfile,
} from "@/constants/Interfaces/Types/Profile.interface";
import api, { safeApiCall } from "../base.api";

export const completeCompanyProfileApi = async (
  body: CompleteCompanyProfile
) => {
  return safeApiCall<{ company: CompanyResponse }>({
    apiCall: () => api.post("/company/complete-profile", body),
    showToaster: true,
  });
};
// /company/profile

export const getCompanyProfileApi = async () => {
  console.log("body");
  return safeApiCall<{ company: CompanyResponse }>({
    apiCall: () => api.get("/company/profile"),
    showToaster: true,
  });
};
export const updateCompanyProfileApi = async (body: CompleteCompanyProfile) => {
  return safeApiCall<{ company: CompanyResponse }>({
    apiCall: () => api.patch(`/company/update-profile`, body),
    showToaster: true,
  });
};
