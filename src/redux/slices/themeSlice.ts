import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ThemeMode = "light" | "dark";

interface ThemeState {
    mode: ThemeMode;
    hydrated: boolean;
}

const initialState: ThemeState = {
    mode: "light",
    hydrated: false,
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setThemeMode(state, action: PayloadAction<ThemeMode>) {
            state.mode = action.payload;
        },
        setThemeHydrated(state, action: PayloadAction<boolean>) {
            state.hydrated = action.payload;
        },
    },
});

export const { setThemeMode, setThemeHydrated } = themeSlice.actions;
export default themeSlice.reducer;
