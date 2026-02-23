import api, { safeApiCall } from "../base.api";
import { IChat, IMessage } from "@/constants/Interfaces/Types/Chat.interface";

export const getAllChats = async () => {
  return safeApiCall<{ chats: IChat[] }>({
    apiCall: () => api.get("/chat/"),
    showToaster: false,
  });
};

export const getAllMessages = async (chatId: string) => {
  return safeApiCall<{ messages: IMessage[] }>({
    apiCall: () => api.get(`/message/chat/${chatId}`),
    showToaster: false,
  });
};
