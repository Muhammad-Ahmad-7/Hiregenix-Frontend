"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setThemeHydrated, setThemeMode } from "@/redux/slices/themeSlice";

export default function ThemeSync() {
    const dispatch = useDispatch();
    const { mode, hydrated } = useSelector((state: RootState) => state.theme);

    useEffect(() => {
        if (hydrated) return;
        const stored =
            localStorage.getItem("theme") || localStorage.getItem("themeMode");
        if (stored === "dark" || stored === "light") {
            dispatch(setThemeMode(stored));
        }
        dispatch(setThemeHydrated(true));
    }, [dispatch, hydrated]);

    useEffect(() => {
        if (!hydrated) return;
        document.documentElement.setAttribute("data-theme", mode);
        localStorage.setItem("theme", mode);
        localStorage.setItem("themeMode", mode);
    }, [mode, hydrated]);

    return null;
}
