//

// auth.api.ts

import {
  ScheduledInterview,
  ScheduledInterviewSimple,
} from "@/constants/Interfaces/Types/Jobs.interface";
import api, { safeApiCall } from "../base.api";

export const getAllTodaysInterviewsApi = async () => {
  return safeApiCall<{ interviews: ScheduledInterview[] }>({
    apiCall: () => api.get("/interview/candidate-interviews/today"),
    showToaster: true,
  });
};
export const getAllInterviewsApi = async (params: {
  page: number;
  limit: number;
}) => {
  return safeApiCall<{ interviews: ScheduledInterview[] }>({
    apiCall: () =>
      api.get("/interview/candidate-interviews", {
        params,
      }),
    showToaster: true,
  });
};

export const scheduleInterviewApi = async ({
  jobId,
  scheduledDate,
}: {
  jobId: string;
  scheduledDate: string;
}) => {
  return safeApiCall<{ interview: ScheduledInterviewSimple }>({
    apiCall: () =>
      api.post(`/interview/schedule-interview/${jobId}`, { scheduledDate }),
    showToaster: true,
  });
};
