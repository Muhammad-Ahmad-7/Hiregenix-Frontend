// auth.api.ts

import api, { safeApiCall } from "../base.api";

export const createJobApi = async (body) => {
  console.log("body", body);
  return safeApiCall({
    apiCall: () => api.post("/company/create-job", body),
    showToaster: true,
  });
};
