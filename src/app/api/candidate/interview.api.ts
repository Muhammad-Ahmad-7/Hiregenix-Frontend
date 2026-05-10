//

// auth.api.ts

import {
  GetInterviewDataByIdApiResponse,
  InterviewOverallAnalysis,
  InterviewQuestionResult,
  InterviewQuestionResultApiResponse,
  InterviewVideoUploadSignedUrlApiResponse,
  ScheduledInterview,
  ScheduledInterviewSimple,
  TodayInterviews,
} from "@/constants/Interfaces/Types/Jobs.interface";
import api, { safeApiCall } from "../base.api";
import { toast } from "react-hot-toast";

const BASE_API = "/interview";

export const getAllTodaysInterviewsApi = async () => {
  return safeApiCall<{ interviews: TodayInterviews[] }>({
    apiCall: () => api.get(`${BASE_API}/candidate-interviews/today`),
    showToaster: true,
  });
};
export const getAllInterviewsApi = async (params: {
  page: number;
  limit: number;
  status: string | undefined;
  withInLastOneWeek?: boolean;
  withInLastOneMonth?: boolean;
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
      api.post(`${BASE_API}/schedule-interview/${jobId}`, { scheduledDate: scheduledDate }),
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

// export const livenessCheckApi = async (file: File, interviewId: string) => {
//   // Api Call to generate the signed url
//   const signedUrlRes = await safeApiCall<{ data: InterviewVideoUploadSignedUrlApiResponse }>({
//     apiCall: () => api.post(`/upload/generate-signed-url`),
//   });

//   if (!signedUrlRes || signedUrlRes.status !== "Success") {
//     toast.error("Failed to get signed URL");
//     return;
//   }

//   if (signedUrlRes.data === undefined) {
//     toast.error("Failed to get signed URL2");
//     return;
//   }

//   const { cloudName, apiKey, signature, timestamp, publicId } = signedUrlRes.data.data;

//   // Upload video to Cloudinary using the signed URL
//   const formData = new FormData();

//   formData.append('file', file);
//   formData.append('api_key', apiKey);
//   formData.append('signature', signature);
//   formData.append('timestamp', timestamp);
//   formData.append('public_id', publicId);
//   formData.append('folder', 'interviews');

//   const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;
//   const uploadRes = await fetch(uploadUrl, {
//     method: 'POST',
//     body: formData,
//   });

//   const uploadResult = await uploadRes.json();

//   if (!uploadResult.secure_url) {
//     toast.error("Failed to upload video");
//     return;
//   }
//   console.log("SECURE URL", uploadResult.secure_url);

//   // Call liveness check API with the uploaded video URL
//   return safeApiCall<{ taskId: string, interviewId: string }>({
//     apiCall: () => api.post(`${BASE_API}/liveness-check`, {
//       videoUrl: uploadResult.secure_url,
//       interviewId: interviewId
//     }),
//   });
// }


export const livenessCheckApi = async (file: File, interviewId: string) => {
  return {
    taskId: "mock-task-id",
    interviewId: interviewId,
    status: "Success",
    data: {
      livenessCheckStarted: true,
    }
  }
}

export const verifyCandidateIdentityApi = async (file: File) => {
  return safeApiCall<{ verificationResult: { similarity: number } }>({
    apiCall: () => {
      const formData = new FormData();
      formData.append('file', file);
      return api.post(`${BASE_API}/face-verification`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
  });
};

export const endInterviewApi = async (interviewId: string) => {
  return safeApiCall<null>({
    apiCall: () => api.post(`${BASE_API}/end-interview`, { interviewId }),
    showToaster: true,
  });
}

export const markInterviewAsInProcessApi = async (interviewId: string) => {
  return safeApiCall<null>({
    apiCall: () => api.post(`${BASE_API}/mark-in-process`, { interviewId }),
    showToaster: true,
  });
}

export const fetchQuestionsResultForInterview = async (interviewId: string) => {
  return safeApiCall<{ questionResults: InterviewQuestionResult[], report: InterviewOverallAnalysis }>({
    apiCall: () => api.get(`${BASE_API}/interview-question-results/${interviewId}`),
    showToaster: true,
  });
}