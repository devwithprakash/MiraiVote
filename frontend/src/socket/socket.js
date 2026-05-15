import { io } from "socket.io-client";

export const socket = io("https://pulse-board-7htj.onrender.com/api", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Frontend connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.log("Socket connection error:", err.message);
});
