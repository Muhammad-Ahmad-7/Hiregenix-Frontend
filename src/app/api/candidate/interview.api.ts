//

// auth.api.ts

import api, { safeApiCall } from "../base.api";

export const getAllTodaysInterviewsApi = async () => {
  return safeApiCall({
    apiCall: () => api.get("/interview/candidate-interviews/today"),
    showToaster: true,
  });
};
export const getAllInterviewsApi = async (params: {
  page: number;
  limit: number;
}) => {
  return safeApiCall({
    apiCall: () =>
      api.get("/interview/candidate-interviews", {
        params,
      }),
    showToaster: true,
  });
};

export const scheduleInterviewApi = async ({ jobId, scheduledDate }) => {
  return safeApiCall({
    apiCall: () =>
      api.post(`/interview/schedule-interview/${jobId}`, { scheduledDate }),
    showToaster: true,
  });
};
