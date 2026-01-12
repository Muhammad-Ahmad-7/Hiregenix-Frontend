// auth.api.ts

import { ScheduledInterviewWithCandidate } from "@/constants/Interfaces/Types/Jobs.interface";
import api, { safeApiCall } from "../base.api";

export const getAllJobsApplicationsApi = async () => {
  console.log("body");
  return safeApiCall<{ jobs: ScheduledInterviewWithCandidate[] }>({
    apiCall: () => api.get("/job/get-company-jobs"),
    showToaster: true,
  });
};

// /job/interview-applications/
export const getSpecificJobApplicationsApi = async (
  jobId: string,
  params: { page: number; limit: number }
) => {
  return safeApiCall<{ interviews: ScheduledInterviewWithCandidate[] }>({
    apiCall: () =>
      api.get(`/job/interview-applications/${jobId}`, {
        params,
      }),
    showToaster: true,
  });
};

// /company/profile
