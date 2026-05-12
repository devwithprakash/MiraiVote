import { Router } from "express";
import { validate } from "../middleware/validate.middleware.js";
import { pollSchema } from "../schemas/poll.schema.js";
import * as controller from "../controllers/poll.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authOptional } from "../middleware/auth-optional.middleware.js";

const router = Router();

router.post("/", authMiddleware, validate(pollSchema), controller.createPoll);
router.get("/:token", controller.fetchPoll);
router.post("/:token/submit", authOptional, controller.submitPoll);
router.get("/:token/result", authOptional, controller.pollResult);

export default router;
