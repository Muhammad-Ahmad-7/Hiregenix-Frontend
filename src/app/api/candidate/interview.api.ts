//

// auth.api.ts

import {
  GetInterviewDataByIdApiResponse,
  InterviewQuestionResultApiResponse,
  InterviewVideoUploadSignedUrlApiResponse,
  ScheduledInterview,
  ScheduledInterviewSimple,
} from "@/constants/Interfaces/Types/Jobs.interface";
import api, { safeApiCall } from "../base.api";
import { toast } from "react-hot-toast";

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
  { interviewId, questionId, questionText, numberOfTabSwitch, file }:
    { interviewId: string, questionId: string, questionText: string, numberOfTabSwitch: number, file: File }
) => {

  // Api Call to generate the signed url
  const signedUrlRes = await safeApiCall<{ data: InterviewVideoUploadSignedUrlApiResponse }>({
    apiCall: () => api.post(`/upload/generate-signed-url`, { interviewId, questionId }),
  });

  if (!signedUrlRes || signedUrlRes.status !== "Success") {
    toast.error("Failed to get signed URL");
    return;
  }

  if (signedUrlRes.data === undefined) {
    toast.error("Failed to get signed URL2");
    return;
  }

  const { cloudName, apiKey, signature, timestamp, publicId } = signedUrlRes.data.data;

  // Upload video to Cloudinary using the signed URL
  const formData = new FormData();

  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('signature', signature);
  formData.append('timestamp', timestamp);
  formData.append('public_id', publicId);
  formData.append('folder', 'interviews');

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;
  const uploadRes = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  });

  const uploadResult = await uploadRes.json();

  if (!uploadResult.secure_url) {
    toast.error("Failed to upload video");
    return;
  }

  // Submit the answer with the uploaded video URL
  return safeApiCall<{ questionResult: InterviewQuestionResultApiResponse }>({
    apiCall: () => api.post(`${BASE_API}/submit-answer`, {
      interviewId,
      questionId,
      questionText,
      numberOfTabSwitch,
      videoUrl: uploadResult.secure_url,
    }),
  });
};



export const createInterviewQuestionResultForSkipQuestionApi = async (
  { interviewId, questionId, questionText }:
    { interviewId: string, questionId: string, questionText: string }
) => {
  // Submit the answer with the uploaded video URL
  return safeApiCall<{ questionResult: InterviewQuestionResultApiResponse }>({
    apiCall: () => api.post(`${BASE_API}/submit-skip-question`, {
      interviewId,
      questionId,
      questionText,
    }),
  });
};