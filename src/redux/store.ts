import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import companyJobReducer from "./slices/company/companyJobSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    companyJob: companyJobReducer,
  },
});

// Type helpers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
