import { CandidateProfileResponse, CompleteCompanyProfile } from "@/constants/Interfaces/Types/Profile.interface";
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
export const getCandidateProfileWithIdApi = async (
  candidateId: string | number) => {
  console.log("candidateId:::", candidateId);
  return safeApiCall<{ candidate: CandidateProfileResponse }>({
    apiCall: () => api.get(`/candidate/profile/${candidateId}`),
    showToaster: true,
  });
};
