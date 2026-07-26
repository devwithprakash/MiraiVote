import { Router } from "express";
import { validate } from "../middleware/validate.middleware.js";
import { createPollSchema, updatePollSchema } from "../schemas/poll.schema.js";
import * as controller from "../controllers/poll.controller.js";

const router = Router();

router.post("/", validate(createPollSchema), controller.createPoll);
router.get("/", controller.fetchAllPolls);
router.patch("/:pollId", validate(updatePollSchema), controller.updatePoll);
router.get("/:id", controller.fetchPoll);
router.delete("/:id", controller.deletePoll);

router.get("/:pollId/analytics", controller.fetchAnalytics);
router.get("/public/:slug", controller.fetchPollBySlug);
router.post("/:slug/submit", controller.submitPoll);

export default router;
