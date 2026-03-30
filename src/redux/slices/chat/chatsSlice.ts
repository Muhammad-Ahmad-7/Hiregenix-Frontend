import { IChat } from "@/constants/Interfaces/Types/Chat.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addMessage, MessageStatus } from "./messagesSlice";

interface ChatSliceState {
  chats: IChat[] | null;
  loading: boolean;
}

const initialState: ChatSliceState = {
  chats: null,
  loading: false,
};
const chatSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setChats(state, action: PayloadAction<IChat[]>) {
      state.chats = action.payload;
    },

    updateUnreadCount(
      state,
      action: PayloadAction<{ chatId: string; unReadCount: number }>,
    ) {
      const chat = state.chats?.find((c) => c._id === action.payload.chatId);

      if (chat) {
        if (action.payload.unReadCount === -1) {
          chat.unReadCount = 0;
        } else {
          chat.unReadCount = chat.unReadCount + action.payload.unReadCount;
        }
      }
    },
    updateOnlineStatus(
      state,
      action: PayloadAction<{
        userId: string | number;
        onlineStatus: "online" | "offline";
      }>,
    ) {
      const chat = state.chats?.find(
        (c) => c.participant._id === action.payload.userId,
      );
      if (chat) {
        chat.onlineStatus = action.payload.onlineStatus;
      }
    },
    updateLastMessageStatus(
      state,
      action: PayloadAction<{ status: MessageStatus; chatId: string }>,
    ) {
      console.log("bsyar:", action.payload);
      const chat = state.chats?.find((c) => action.payload.chatId === c._id);
      if (chat) {
        console.log("chatbhimilgai");
        chat.lastMessage.status = action.payload.status;
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },

  // 👇 THIS IS THE IMPORTANT PART
  extraReducers: (builder) => {
    builder.addCase(addMessage, (state, action) => {
      const { message, userId } = action.payload;
      const { sender } = message;
      const chat = state.chats?.find((c) => c._id === message.chat);

      if (chat) {
        console.log("heloooooooo:", message);

        // Update last message details
        chat.lastMessage.text = message.text;
        chat.lastMessage.sender = message.sender;
        // chat.lastMessage.status = message.status;
        chat.lastMessageAt = message.updatedAt;
        chat.updatedAt = message.updatedAt;

        // ✅ ONLY increment unread count if message is from OTHER user
        if (userId != null && sender !== userId) {
          console.log("unReadCount before:", chat.unReadCount);
          chat.unReadCount = (chat.unReadCount || 0) + 1;
          console.log("unReadCount after:", chat.unReadCount);
        }
      }
    });
  },
});

export const {
  setChats,
  // updateLastMessage,
  updateOnlineStatus,
  updateLastMessageStatus,
  updateUnreadCount,
  setLoading,
} = chatSlice.actions;

export default chatSlice.reducer;
