import api, { safeApiCall } from "../base.api";
interface chatBotQueryApiBody {
  query: string;
  companyId: string | number;
}
export const chatBotQueryApi = async (body: chatBotQueryApiBody) => {
  console.log("body", body);
  return safeApiCall<{ answer: string }>({
    apiCall: () => api.post("/chatbot/company-chat", body),
    showToaster: true,
  });
};
