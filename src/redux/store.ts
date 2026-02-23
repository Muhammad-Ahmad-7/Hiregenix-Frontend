import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import companyJobReducer from "./slices/company/companyJobSlice";

import messagesReducer from "./slices/chat/messagesSlice";
import chatsReducers from "./slices/chat/chatsSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    companyJob: companyJobReducer,
    chats: chatsReducers,
    messages: messagesReducer,
  },
  // devTools: true,
});

// Type helpers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
