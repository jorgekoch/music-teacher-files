import { Router } from "express";
import {
  createUploadUrl,
  completeUpload,
  listFiles,
  updateFile,
  deleteFile,
  getFileDownloadUrl,
  moveFile,
} from "../controllers/filesController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateParams } from "../middlewares/validateSchemaMiddleware";
import { folderIdParamSchema, idParamSchema } from "../schemas/paramsSchema";

const router = Router();

router.post("/upload-url", authMiddleware, createUploadUrl);
router.post("/complete-upload", authMiddleware, completeUpload);

router.get(
  "/folder/:folderId",
  authMiddleware,
  validateParams(folderIdParamSchema),
  listFiles
);

router.get(
  "/:id/download",
  authMiddleware,
  validateParams(idParamSchema),
  getFileDownloadUrl
);

router.patch(
  "/:id/move",
  authMiddleware,
  validateParams(idParamSchema),
  moveFile
);

router.patch(
  "/:id",
  authMiddleware,
  validateParams(idParamSchema),
  updateFile
);

router.delete(
  "/:id",
  authMiddleware,
  validateParams(idParamSchema),
  deleteFile
);

export default router;