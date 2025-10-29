// auth.api.ts

import api, { safeApiCall } from "../base.api";

interface LoginApiBody {
  email: string;
  password: string;
}
interface SignUpApiBody {
  email: string;
  password: string;
  role: "candidate" | "company";
}
export const getCandidateProfileApi = async () => {
  return safeApiCall({
    apiCall: () => api.get("/candidate/profile"),
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
