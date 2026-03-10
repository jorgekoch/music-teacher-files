import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  createShareLink,
  getSharedFileInfo,
  openSharedFile,
} from "../controllers/sharedFileController";
import { validateParams } from "../middlewares/validateSchemaMiddleware";
import { idParamSchema } from "../schemas/paramsSchema";

const router = Router();

router.post("/:id/share", authMiddleware, validateParams(idParamSchema), createShareLink);
router.get("/:token/info", getSharedFileInfo);
router.get("/:token", openSharedFile);

export default router;