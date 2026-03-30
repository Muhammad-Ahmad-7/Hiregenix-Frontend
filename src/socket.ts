// src/socket.js
import { io } from "socket.io-client";
import { getToken } from "./utils/token";

export const socket = io("http://localhost:5000", {
  auth: {
    token: getToken(),
  },
}); // your backend URL

const originalEmit = socket.emit;

socket.emit = function (event, ...args) {
  console.log("📤 Sent:", event, args);
  return originalEmit.apply(this, [event, ...args]);
};
