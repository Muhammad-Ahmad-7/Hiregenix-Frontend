//

// auth.api.ts

import {
  GetInterviewDataByIdApiResponse,
  ScheduledInterview,
  ScheduledInterviewSimple,
} from "@/constants/Interfaces/Types/Jobs.interface";
import api, { safeApiCall } from "../base.api";

const BASE_API = "/interview";

export const getAllTodaysInterviewsApi = async () => {
  return safeApiCall<{ interviews: ScheduledInterview[] }>({
    apiCall: () => api.get(`${BASE_API}/candidate-interviews/today`),
    showToaster: true,
  });
};
export const getAllInterviewsApi = async (params: {
  page: number;
  limit: number;
}) => {
  return safeApiCall<{ interviews: ScheduledInterview[] }>({
    apiCall: () =>
      api.get(`${BASE_API}/candidate-interviews`, {
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
      api.post(`${BASE_API}/schedule-interview/${jobId}`, { scheduledDate }),
    showToaster: true,
  });
};

export const getInterviewByIdApi = async (
  interviewId: string
) => {
  return safeApiCall<{ interview: GetInterviewDataByIdApiResponse }>({
    apiCall: () => api.get(`${BASE_API}/candidate-interviews/${interviewId}`),
  });
}