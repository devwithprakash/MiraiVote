import express from "express";
import userRoute from "./routes/user.route.js";
import pollRoute from "./routes/poll.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.get("/", (req, res) => console.log("Hello from Server"));

app.get("/health", (req, res) => {
  res.json({ healthy: true });
});

app.use("/api/users", userRoute);
app.use("/api/polls", pollRoute);

export default app;
