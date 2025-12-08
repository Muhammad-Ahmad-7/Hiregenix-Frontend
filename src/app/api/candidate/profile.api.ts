// auth.api.ts

import api, { safeApiCall } from "../base.api";

export const getCandidateProfileApi = async () => {
  return safeApiCall({
    apiCall: () => api.get("/candidate/profile/692fdedc6b8f39c9bcfe2fac"),
    showToaster: true,
  });
};
export const updateCandidateProfileApi = async (body, candidateId) => {
  return safeApiCall({
    apiCall: () => api.patch(`/candidate/update-profile/${candidateId}`, body),
    showToaster: true,
  });
};

export const completeProfileApi = async (body) => {
  return safeApiCall({
    apiCall: () => api.post("/candidate/complete-profile", body),
    showToaster: true,
  });
};
// /candidate/update-profile
export const updateProfileApi = async (body) => {
  return safeApiCall({
    apiCall: () => api.patch("/candidate/update-profile", body),
    showToaster: true,
  });
};
export const uploadResumeApi = async (formData: FormData) => {
  console.log("Uploading resume:", formData.get("file"));
  return safeApiCall({
    apiCall: () =>
      api.post("/candidate/resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    showToaster: true,
  });
};
export const getResumeDataApi = async () => {
  return safeApiCall({
    apiCall: () => api.get("/candidate/get-resume-parsed-data"),
    showToaster: true,
  });
};
