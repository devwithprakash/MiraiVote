import http from "http";
import dns from "dns";
import { Server } from "socket.io";
import "dotenv/config";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const server = http.createServer(app);

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [process.env.CLIENT_URL]
    : ["http://localhost:5173"];

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("CLIENT_URL:", process.env.CLIENT_URL);
console.log("allowedOrigins:", allowedOrigins);

export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
  path: "/socket.io",
});

// When any client will connect to websocket server, callback will run
// when client connect a socket object will create for that user (socket)
io.on("connection", (socket) => {
  //socket = information of connected client
  console.log("Socket connected:", socket.id);

  // if client send this event run this callback
  // pollId: any data send by client

  // in socket server we can create multiple groups
  // every (pollId) will have separate group
  // clients who joined the room of "pollId" will see the live synced data
  socket.on("join_poll", async (pollId) => {
    console.log(`${pollId} joined the room`);

    // client come from join_poll event with "pollId" will join in the room acccording to that specific poll room
    await socket.join(`poll:${pollId}`);
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
