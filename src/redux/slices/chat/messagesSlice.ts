import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IMessage,
  MessageStatus,
} from "@/constants/Interfaces/Types/Chat.interface";

export type { IMessage, MessageStatus };

interface MessagesState {
  messages: IMessage[];
}

const initialState: MessagesState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    // 🔹 Replace entire message list (when loading chat)
    setMessages(state, action: PayloadAction<IMessage[]>) {
      if (state.messages.length === 0) {
        state.messages = action.payload;
      } else {
        state.messages = [...action.payload, ...state.messages];
      }
    },

    // 🔹 Push single message (real-time receive or send)
    addMessage(
      state,
      action: PayloadAction<{
        message: IMessage;
        selectedId: string | number | null | undefined;
        userId?: string | number;
        isUserOnline?: boolean;
      }>,
    ) {
      console.log("redux", action.payload);
      const { selectedId, message } = action.payload;

      if (selectedId != null && selectedId === message.chat) {
        state.messages.push(message);
      }
    },
    updateMessageStatus(
      state,
      action: PayloadAction<{ messageId: string; status: MessageStatus }>,
    ) {
      const message = state.messages.find(
        (msg) => msg._id === action.payload.messageId,
      );

      if (message && message.status != "seen") {
        message.status = action.payload.status;
      }
    },
    updateAllMessagesStatusToSeen: (
      state,
      action: PayloadAction<{ chatId: string; userId: string }>,
    ) => {
      const { chatId, userId } = action.payload;
      console.log("iamupdateAllMessagesStatusToSeen:", chatId);

      console.log("iamupdateAllMessagesStatusToSeen:", userId);
      state.messages.forEach((msg) => {
        if (
          msg.chat === chatId &&
          msg.sender !== userId &&
          msg.status !== "seen"
        ) {
          console.log("hang", msg.sender);
          msg.status = "seen";
        }
      });
    },
    updateAllMessagesStatusToDelivered: (
      state,
      action: PayloadAction<{ chatId: string; userId: string }>,
    ) => {
      const { chatId, userId } = action.payload;
      console.log("iamupdateAllMessagesStatusToSeen:", chatId);

      console.log("iamupdateAllMessagesStatusToSeen:", userId);
      state.messages.forEach((msg) => {
        if (
          msg.chat === chatId &&
          msg.sender !== userId &&
          msg.status !== "seen"
        ) {
          console.log("hang", msg.sender);
          msg.status = "delivered";
        }
      });
    },

    // 🔹 Update reaction
    updateReaction(
      state,
      action: PayloadAction<{ messageId: string; reaction: string | null }>,
    ) {
      const message = state.messages.find(
        (msg) => msg._id === action.payload.messageId,
      );

      if (message) {
        message.reaction = action.payload.reaction;
      }
    },

    // 🔹 Clear when switching chat
    clearMessages(state) {
      state.messages = [];
    },
  },
});

export const {
  setMessages,
  addMessage,
  updateMessageStatus,
  updateAllMessagesStatusToSeen,
  updateAllMessagesStatusToDelivered,
  updateReaction,
  clearMessages,
} = messagesSlice.actions;

export default messagesSlice.reducer;
