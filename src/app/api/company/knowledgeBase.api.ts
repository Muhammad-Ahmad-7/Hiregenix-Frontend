import api, { safeApiCall } from "../base.api";

export const uploadCompanyKnowledgeBasePdfApi = async (formData: FormData) => {
  return safeApiCall<{ pdfUrl: string; collectionName: string; taskId: string }>({
    apiCall: () =>
      api.post("/company/knowledge-base/pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    showToaster: true,
  });
};

