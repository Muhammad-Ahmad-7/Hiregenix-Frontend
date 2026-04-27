// auth.api.ts

import {
  JobPostingCompany,
  JobResponse,
} from "@/constants/Interfaces/Types/Jobs.interface";
import api, { safeApiCall } from "../base.api";

export const createJobApi = async (body: JobPostingCompany) => {
  console.log("body", body);
  return safeApiCall<{ job: JobResponse }>({
    apiCall: () => api.post("/job/create-job", body),
    showToaster: true,
  });
};
// export const getAllJobsApi = async (params = {}) => {
//   console.log("params", params);
//   return safeApiCall({
//     apiCall: () => api.get(`/job/get-all-jobs`, { params }),
//   });
// };
