import { Router } from "express";
import {
  forgotPassword,
  login,
  resetPassword,
  verifyEmailController
} from "../controllers/authController";
import { validateBody } from "../middlewares/validateSchemaMiddleware";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
} from "../schemas/authSchema";

const router = Router();

router.get("/verify-email/:token", verifyEmailController);
router.post("/login", validateBody(loginSchema), login);
router.post(
  "/forgot-password",
  validateBody(forgotPasswordSchema),
  forgotPassword
);
router.post(
  "/reset-password",
  validateBody(resetPasswordSchema),
  resetPassword
);


export default router;