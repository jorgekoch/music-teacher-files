import { Router } from "express";
import {
  uploadFile,
  listFiles,
  deleteFile,
  getFileDownloadUrl,
} from "../controllers/filesController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/uploadMiddleware";
import {
  validateBody,
  validateParams,
} from "../middlewares/validateSchemaMiddleware";
import { uploadFileBodySchema } from "../schemas/fileSchema";
import { folderIdParamSchema, idParamSchema } from "../schemas/paramsSchema";

const router = Router();

router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  validateBody(uploadFileBodySchema),
  uploadFile
);

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

router.delete(
  "/:id",
  authMiddleware,
  validateParams(idParamSchema),
  deleteFile
);

export default router;