import api, { safeApiCall } from "../base.api";

interface TaskApiResponse {
    _id: string;
    payload: object;
    status: "pending" | "completed" | "failed";
    error: string | null;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export const getTask = async (taskId: string) => {
    return safeApiCall<{ task: TaskApiResponse }>({
        apiCall: () => api.get(`/task/${taskId}`),
        showToaster: true,
    });
};