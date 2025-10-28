// auth.api.ts

import api, { safeApiCall } from "./base.api";

interface LoginApiBody {
  email: string;
  password: string;
}
interface SignUpApiBody {
  email: string;
  password: string;
  role: "candidate" | "company";
}
export const loginApi = async (body: LoginApiBody) => {
  return safeApiCall({
    apiCall: () => api.post("/auth/login", body),
    showToaster: true,
  });
};
export const signUpApi = async (body: SignUpApiBody) => {
  return safeApiCall({
    apiCall: () => api.post("/auth/signup", body),
    showToaster: true,
  });
};
export const verifyEmailApi = async (token: string) => {
  console.log(token);
  return safeApiCall({
    apiCall: () => api.post(`/auth/verify-email/${token}`),
    showToaster: true,
  });
};
