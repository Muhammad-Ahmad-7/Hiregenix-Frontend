import { getToken } from "@/utils/token";
import axios from "axios";
import toast from "react-hot-toast";

// Create Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});
// ✅ Add request interceptor (Attach token automatically)
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Define API response and helper types
export interface Meta {
  totalitems: number;
  itemsperpage: number;
  currentpage: number;
  totalpage: number;
  hasMore?: boolean;
  nextCursor?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  meta?: Meta | null;
}

type ApiCall<T> = () => Promise<ApiResponse<T>>;

interface SafeApiCallProps<T> {
  apiCall: ApiCall<T>;
  returnDataOnly?: boolean;
  showToaster?: "default" | boolean;
}

// // Safe API call wrapper function
export const safeApiCall = async <T>({
  apiCall,
  showToaster = "default",
  returnDataOnly = false,
}: SafeApiCallProps<T>): Promise<T | ApiResponse<T> | null> => {
  try {
    console.log("first");
    const response = await apiCall();

    console.log("first2");
    console.log(
      "✅ API Called:",
      response.config?.url,
      "| Method:",
      response.config?.method
    );
    console.log("response", response);
    const { data } = response;
    console.log("data", data);
    if (showToaster && data.status == "Success") {
      console.log("i am working ");
      toast.success(data.message);
      return response.data;
    }
    return returnDataOnly ? response.data.data : response.data;
  } catch (error) {
    const errorMsg = error?.response?.data.message ?? "Something went wrong";
    console.log(errorMsg);
    toast.error(errorMsg, {
      duration: 3000,
    });

    return null;
  }
};

export default api;
