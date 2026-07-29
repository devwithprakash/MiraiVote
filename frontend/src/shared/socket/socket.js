import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";


export const socket = io(BACKEND_URL, { withCredentials: true });

// After connection established, callback will execute
socket.on("connect", () => {
  console.log("Frontend connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.log(err);
  console.log("Socket connection error:", err.message);
});
