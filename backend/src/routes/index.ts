import { Router } from "express";
import authRoutes from "./authRoutes";
import usersRoutes from "./usersRoutes";
import foldersRoutes from "./foldersRoutes";
import filesRoutes from "./filesRoutes";
import profileRoutes from "./profileRoutes";
import waitlistRoutes from "./waitlistRoutes";
import storageRoutes from "./storageRoutes";
import supportRoutes from "./supportRoutes";
import sharedFileRoutes from "./sharedFileRoutes";
import dashboardRoutes from "./dashboardRoutes";
import billingRouter from "./billingRoutes";
import folderShareRoutes from "./folderShareRoutes";
import emailVerificationRoutes from "./emailVerificationRoutes"

const router = Router();

router.get("/health", (req, res) => {
  res.send("API OK");
});

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/folders", foldersRoutes);
router.use("/files", filesRoutes);
router.use("/profile", profileRoutes);
router.use("/waitlist", waitlistRoutes);
router.use("/storage", storageRoutes);
router.use("/support", supportRoutes);
router.use("/shared", sharedFileRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/billing", billingRouter);
router.use("/folder-shares", folderShareRoutes);
router.use("/email-verification", emailVerificationRoutes);

export default router;