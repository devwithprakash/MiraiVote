import { Router } from "express";
import { validate } from "../middleware/validate.middleware.js";
import { createPollSchema } from "../schemas/poll.schema.js";
import * as controller from "../controllers/poll.controller.js";
import { requireAuth } from "@clerk/express";

const router = Router();

router.post("/", requireAuth(), validate(createPollSchema), controller.createPoll);


router.get("/analytics/:pollId", requireAuth(), controller.fetchAnalytics);
router.get("/", requireAuth(), controller.fetchAllPolls);
router.get("/:id", requireAuth(), controller.fetchPoll);
router.get("/public/:id", requireAuth(), controller.fetchPoll);
router.post("/:id/submit", requireAuth(), controller.submitPoll);
router.get("/:token/result", requireAuth(), controller.pollResult);
router.delete("/:id", requireAuth(), controller.deletePoll);

export default router;
