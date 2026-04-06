import { CompleteCompanyProfile } from "@/constants/Interfaces/Types/Profile.interface";
import api, { safeApiCall } from "../base.api";

export const getCompanyProfileWithIdApi = async (body: {
  companyId: string | number;
}) => {
  console.log("body", body);
  return safeApiCall<{ company: CompleteCompanyProfile }>({
    apiCall: () => api.post("general/companyProfileWithId", body),
    showToaster: true,
  });
};
