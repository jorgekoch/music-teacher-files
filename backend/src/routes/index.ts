import { Router } from "express";
import authRoutes from "./authRoutes";
import foldersRoutes from "./foldersRoutes";

const router = Router();

router.get("/health", (req, res) => {
  res.send("API OK");
});

router.use("/auth", authRoutes);
router.use("/folders", foldersRoutes);

export default router;