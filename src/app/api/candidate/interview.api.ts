//

// auth.api.ts

import {
  GetInterviewDataByIdApiResponse,
  InterviewQuestionResultApiResponse,
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

export const createInterviewQuestionResultApi = async (
  { interviewId, questionId, questionText, file }:
    { interviewId: string, questionId: string, questionText: string, file: File }
) => {
  const formData = new FormData();
  formData.append('questionId', questionId);
  formData.append('file', file);
  formData.append('interviewId', interviewId);
  formData.append('questionText', questionText);

  return safeApiCall<{ questionResult: InterviewQuestionResultApiResponse }>({
    apiCall: () => api.post(`${BASE_API}/submit-answer`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  });
};