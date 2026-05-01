import api, { safeApiCall } from "../base.api";

export interface CandidateListItem {
  _id: string;
  fullName: string;
  profilePictureUrl?: string | null;
  userId: string; // user _id (used for chat creation)
}

export const getAllCandidatesApi = async () => {
  return safeApiCall<{ candidates: CandidateListItem[] }>({
    apiCall: () => api.get("/candidate/all"),
    showToaster: false,
  });
};
