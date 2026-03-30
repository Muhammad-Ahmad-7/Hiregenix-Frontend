import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";

export default function useReduxDispatch() {
  return useDispatch<AppDispatch>();
}
