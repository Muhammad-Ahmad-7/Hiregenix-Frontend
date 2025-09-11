//this is used for api routes

export const API = {
  BASE_URL: process.env.BACKEND_API_URL || "http://localhost:5000/api",
  AUTH: {
    LOGIN: "/auth/login",
  },
  USER: {
    GET_ALL: "/users",
    GET_BY_ID: (id: string | number) => `/users/${id}`,
    PROFILE: "/users/profile",
  },
};

//usage
// fetch(`${API.BASE_URL}${API.USERS.LIST}`);
