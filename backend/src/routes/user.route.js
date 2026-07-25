import { Router } from "express";
import { validate } from "../middleware/validate.middleware.js";
import { syncUser } from "../controllers/user.controller.js";
import { requireAuth } from "@clerk/express";

const router = Router();

router.post("/sync", syncUser);

export default router;
