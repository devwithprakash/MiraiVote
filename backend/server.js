import http from "http";
import dns from "dns";
import { Server } from "socket.io";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

import "dotenv/config";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

const server = http.createServer(app);

// socket io
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// socket connection
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // join poll room
  socket.on("join_poll", (pollId) => {
    socket.join(`poll:${pollId}`);

    console.log(`Socket ${socket.id} joined poll:${pollId}`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

async function main() {
  try {
    const PORT = process.env.PORT || 8000;

    const DB_URI = process.env.MONGO_URI;

    await connectDB(DB_URI);

    server.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
