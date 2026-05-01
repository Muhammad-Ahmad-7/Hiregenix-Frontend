"use client";

import { store } from "@/redux/store";
import { Provider } from "react-redux";
import ThemeSync from "./ThemeSync";

export function ReduxProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeSync />
      {children}
    </Provider>
  );
}
