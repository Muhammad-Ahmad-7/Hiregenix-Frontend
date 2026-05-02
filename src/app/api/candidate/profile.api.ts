// auth.api.ts

import {
  CandidateProfileResponse,
  CompleteCandidateProfile,
} from "@/constants/Interfaces/Types/Profile.interface";
import api, { safeApiCall } from "../base.api";
import { CandidateResume, ResumeAddDataResponse } from "@/constants/Interfaces/Types/Resume.interface";

export const getCandidateProfileApi = async () => {
  return safeApiCall<{ candidate: CandidateProfileResponse }>({
    apiCall: () => api.get("/candidate/profile"),
    showToaster: true,
  });
};
// export const updateCandidateProfileApi = async (body, candidateId) => {
//   return safeApiCall({
//     apiCall: () => api.patch(`/candidate/update-profile/${candidateId}`, body),
//     showToaster: true,
//   });
// };

export const completeProfileApi = async (body: CompleteCandidateProfile) => {
  return safeApiCall<{ candidate: CandidateProfileResponse }>({
    apiCall: () => api.post("/candidate/complete-profile", body),
    showToaster: true,
  });
};
// /candidate/update-profile
export const updateProfileApi = async (body: CompleteCandidateProfile) => {
  return safeApiCall<{ candidate: CandidateProfileResponse }>({
    apiCall: () => api.patch("/candidate/update-profile", body),
    showToaster: true,
  });
};
export const uploadResumeApi = async (formData: FormData) => {
  console.log("Uploading resume:", formData.get("file"));
  return safeApiCall<{ taskId: string }>({
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
  return safeApiCall<{ resume: CandidateResume }>({
    apiCall: () => api.get("/candidate/get-resume-parsed-data"),
    showToaster: true,
  });
};
// 
export const getResumeDataByIdApi = async (id: string) => {
  return safeApiCall<{ resume: CandidateResume }>({
    apiCall: () => api.get(`/candidate/get-resume-parsed-data/${id}`),
    showToaster: true,
  });
};

export const addResumeData = async ({ type, data }: { type: string, data: ExperienceType | Projects | Certifications | Education }) => {
  return safeApiCall<{ resume: ResumeAddDataResponse }>({
    apiCall: () => api.post("/candidate/add-resume-data", { type, data }),
    showToaster: true,
  });
}

export const editResumeData = async ({ type, _id, data }: { type: string, _id: string, data: ExperienceType | Projects | Certifications | Education }) => {
  return safeApiCall<{ resume: ResumeAddDataResponse }>({
    apiCall: () => api.patch("/candidate/edit-resume-data", { type, _id, data }),
    showToaster: true,
  });
}

export const deleteResumeData = async ({ type, _id }: { type: string, _id: string }) => {
  return safeApiCall<{ resume: ResumeAddDataResponse }>({
    apiCall: () => api.delete("/candidate/delete-resume-data", { data: { type, _id } }),
    showToaster: true,
  });
}