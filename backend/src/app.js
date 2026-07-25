import express from "express";
import userRoute from "./routes/user.route.js";
import pollRoute from "./routes/poll.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorHandler from "./middleware/error.middleware.js";
import { clerkMiddleware } from "@clerk/express";

const app = express();

app.use(clerkMiddleware());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["https://miraivote.vercel.app", "http://localhost:5173"],
    credentials: true,
  }),
);


app.get("/", (req, res) => console.log("Hello from Server"));

app.get("/health", (req, res) => {
  res.json({ healthy: true });
});

app.use("/api/user", userRoute);
app.use("/api/poll", pollRoute);

app.use(errorHandler);

export default app;
