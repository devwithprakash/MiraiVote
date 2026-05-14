import { Router } from "express";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema, registerSchema, resetPasswordSchema } from "../schemas/user.schema.js";
import * as controller from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), controller.register);
router.post("/login", controller.login);
router.post("/logout", authMiddleware, controller.logout);

router.post("/verify-email/:token", controller.verifyEmail);
router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password/:token", validate(resetPasswordSchema), controller.resetPassword);

router.get("/refresh", controller.refresh);

export default router;
