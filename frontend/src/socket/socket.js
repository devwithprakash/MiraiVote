import { io } from "socket.io-client";

export const socket = io("http://localhost:8000", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Frontend connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.log("Socket connection error:", err.message);
});
