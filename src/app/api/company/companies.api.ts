import api, { safeApiCall } from "../base.api";

export interface CompanyListItem {
  _id: string;
  companyName: string;
  logoUrl?: string | null;
  contactEmail?: string;
  userId: string; // user _id (used for chat creation)
}

export const getAllCompaniesApi = async () => {
  return safeApiCall<{ companies: CompanyListItem[] }>({
    apiCall: () => api.get("/company/all"),
    showToaster: false,
  });
};

