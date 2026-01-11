import { getToken } from "@/utils/token";
import axios, {
  // Axios, AxiosError,
  Method,
} from "axios";
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
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore?: boolean;
  nextCursor?: string;
}
export interface AxiosResponse<T> {
  data: ApiResponse<T>;
  config: {
    url?: string;
    method?: Method;
  };
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  statusCode: number;
  data?: T;
  meta?: Meta;
}

type ApiCall<T> = () => Promise<AxiosResponse<T>>;

interface SafeApiCallProps<T> {
  apiCall: ApiCall<T>;
  returnDataOnly?: boolean;
  showToaster?: "default" | boolean;
}

// // Safe API call wrapper function
// export const safeApiCall = async ({
//   apiCall,
//   showToaster = false,
//   returnDataOnly = false,
// }: SafeApiCallProps<"any">) => {
//   try {
//     console.log("first");

//     // ✅ Temporarily cast response as any to avoid TS errors
//     const response = await apiCall();

//     console.log("first2");
//     console.log(
//       "✅ API Called:",
//       response.config?.url,
//       "| Method:",
//       response.config?.method
//     );

//     console.log("response", response);
//     const { data } = response;
//     console.log("data", data);

//     if (!data || data?.status == null || data?.message == null) return;

//     if (!showToaster && data?.status === "Success") {
//       toast.success(data.message);
//       return response.data;
//     }

//     return returnDataOnly ? response.data.data : response.data;
//   } catch (error: unknown) {
//     // Type guard to check if error is an Axios error
//     let errorMsg = "Something went wrong";

//     if (axios.isAxiosError(error)) {
//       // Now TypeScript knows this is an AxiosError
//       errorMsg = error.response?.data?.message || error.message || errorMsg;
//     } else if (error instanceof Error) {
//       // Regular Error object
//       errorMsg = error.message;
//     }

//     console.log(errorMsg);
//     toast.error(errorMsg, { duration: 3000 });
//     return null;
//   }
// };

export const safeApiCall = async <T>({
  apiCall,
  showToaster = "default",
  returnDataOnly = false,
}: SafeApiCallProps<T>): Promise<ApiResponse<T> | null> => {
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
    if (!showToaster && data.status == "Success") {
      console.log("i am working ");
      toast.success(data.message);
      return response.data;
    }
    return returnDataOnly ? response.data : response.data;
  } catch (error: unknown) {
    // Type guard to check if error is an Axios error
    let errorMsg = "Something went wrong";

    if (axios.isAxiosError(error)) {
      // Now TypeScript knows this is an AxiosError
      errorMsg = error.response?.data?.message || error.message || errorMsg;
    } else if (error instanceof Error) {
      // Regular Error object
      errorMsg = error.message;
    }

    console.log(errorMsg);
    toast.error(errorMsg, {
      duration: 3000,
    });

    return null;
  }
};
export default api;
