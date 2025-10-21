"use client";

const storeToken = (token: string) => {
  localStorage.setItem("token", token);
};
const getToken = (): string | null => {
  return localStorage.getItem("token");
};
const removeToken = () => {
  localStorage.removeItem("token");
};
export { storeToken, getToken, removeToken };
