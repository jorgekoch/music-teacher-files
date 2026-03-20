import { Router } from "express";
import {
  acceptFolderInviteController,
  createFolderShareController,
  getFolderInviteByTokenController,
  listFolderSharesController,
  listSharedFoldersController,
  removeFolderShareController,
} from "../controllers/folderShareController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/folder-share-invites/:token", getFolderInviteByTokenController);

router.use(authMiddleware);

router.post("/", createFolderShareController);
router.get("/folder/:folderId", listFolderSharesController);
router.get("/shared-with-me", listSharedFoldersController);
router.post("/folder-share-invites/:token/accept", acceptFolderInviteController);
router.delete("/:shareId", removeFolderShareController);

export default router;