import api, { safeApiCall } from "../base.api";
import { IChat, IMessage } from "@/constants/Interfaces/Types/Chat.interface";

export const getAllChats = async () => {
  return safeApiCall<{ chats: IChat[] }>({
    apiCall: () => api.get("/chat/"),
    showToaster: false,
  });
};

export const getAllMessages = async ({
  chatId,
  params = {
    limit: 20,
    page: 1,
  },
}: {
  chatId: string;
  params?: {
    limit: string | number;
    page: string | number;
  };
}) => {
  return safeApiCall<{ messages: IMessage[] }>({
    apiCall: () =>
      api.get(`/message/chat/${chatId}`, {
        params, // pass query params here
      }),
    showToaster: false,
  });
};
