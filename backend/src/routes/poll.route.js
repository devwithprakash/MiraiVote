import { Router } from "express";
import { validate } from "../middleware/validate.middleware.js";
import { pollSchema } from "../schemas/poll.schema.js";
import * as controller from "../controllers/poll.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authOptional } from "../middleware/auth-optional.middleware.js";

const router = Router();

router.post("/", authMiddleware, validate(pollSchema), controller.createPoll);
router.get("/analytics/:pollId", authMiddleware, controller.fetchAnalytics);
router.get("/", authMiddleware, controller.fetchAllPolls);
router.get("/:id", authMiddleware, controller.fetchPoll);
router.get("/public/:id", authOptional, controller.fetchPoll);
router.post("/:id/submit", authOptional, controller.submitPoll);
router.get("/:token/result", authOptional, controller.pollResult);

export default router;
