import { Router } from "express";
import {
  forgotPassword,
  login,
  resetPassword,
} from "../controllers/authController";
import { validateBody } from "../middlewares/validateSchemaMiddleware";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
} from "../schemas/authSchema";

const router = Router();

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