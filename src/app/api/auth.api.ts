// auth.api.ts

import api, { safeApiCall } from "./base.api";

interface SignUpApiBody {
  email: string;
  password: string;
  role: "candidate" | "company";
}
export const signUpApi = async (body: SignUpApiBody) => {
  return safeApiCall({
    apiCall: () => api.post("/auth/signup", body),
  });
  // try {
  //   const response = ;
  //   console.log("response", response.data);
  //   return response.data; // ✅ return the data here
  // } catch (error: any) {
  //   console.error("Signup error:", error.response?.data || error.message);
  //   throw error; // ✅ rethrow so you can catch it in component
  // }
};
