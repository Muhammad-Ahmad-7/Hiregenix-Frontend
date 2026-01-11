// auth.api.ts

import {
  AccessToken,
  LoginBody,
  LoginResponse,
  SignUpBody,
} from "@/constants/Interfaces/Types/Auth.interface";
import api, { safeApiCall } from "./base.api";

export const loginApi = async (body: LoginBody) => {
  return safeApiCall<LoginResponse>({
    apiCall: () => api.post("/auth/login", body),
    showToaster: true,
  });
};
export const signUpApi = async (body: SignUpBody) => {
  return safeApiCall<null>({
    apiCall: () => api.post("/auth/signup", body),
    showToaster: true,
  });
};
export const verifyEmailApi = async (token: string) => {
  console.log(token);
  return safeApiCall<AccessToken>({
    apiCall: () => api.post(`/auth/verify-email/${token}`),
    showToaster: true,
  });
};

export const uploadFileApi = async (formData: FormData) => {
  console.log("Uploading resume:", formData.get("file"));
  return safeApiCall<{ url: string }>({
    apiCall: () =>
      api.post("/upload/file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    showToaster: true,
  });
};
