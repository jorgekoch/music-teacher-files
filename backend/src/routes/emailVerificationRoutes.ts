import { Router } from "express";
import { confirmEmailController } from "../controllers/emailVerificationController";

const router = Router();

router.get("/:token",
    confirmEmailController
);

export default router;