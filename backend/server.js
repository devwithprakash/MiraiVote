import http from "http";
import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

import "dotenv/config";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

async function main(param) {
  const PORT = process.env.PORT || 8000;
  const DB_URI = process.env.MONGO_URI;

  const server = http.createServer(app);
  connectDB(DB_URI);
  server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
}

main();
