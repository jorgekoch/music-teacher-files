import { Router } from "express";
import { createFolder, getFolders } from "../controllers/folderController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createFolder);
router.get("/", authMiddleware, getFolders);

export default router;