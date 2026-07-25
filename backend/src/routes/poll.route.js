import { Router } from "express";
import { validate } from "../middleware/validate.middleware.js";
import { createPollSchema, updatePollSchema } from "../schemas/poll.schema.js";
import * as controller from "../controllers/poll.controller.js";

const router = Router();

router.post("/", validate(createPollSchema), controller.createPoll);
router.get("/", controller.fetchAllPolls);
router.patch("/:pollId", validate(updatePollSchema),  controller.updatePoll);


// remaining routes
router.get("/analytics/:pollId", controller.fetchAnalytics);
router.get("/:id", controller.fetchPoll);
router.get("/public/:id", controller.fetchPoll);
router.post("/:id/submit", controller.submitPoll);
router.get("/:token/result", controller.pollResult);
router.delete("/:id", controller.deletePoll);

export default router;
