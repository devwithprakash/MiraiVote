import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const socket = io(BACKEND_URL, {
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("Frontend connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.log("Socket connection error:", err.message);
});
