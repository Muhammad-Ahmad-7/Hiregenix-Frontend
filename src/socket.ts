// src/socket.js
import { io } from "socket.io-client";
import { getToken } from "./utils/token";

export const socket = io(process.env.NEXT_PUBLIC_BACKEND_WS_URL, {
  auth: {
    token: getToken(),
  },
  transports: ["websocket"],
  upgrade: false,
}); // your backend URL

const originalEmit = socket.emit;

socket.emit = function (event, ...args) {
  console.log("📤 Sent:", event, args);
  return originalEmit.apply(this, [event, ...args]);
};
