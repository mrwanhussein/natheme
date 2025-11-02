import express from "express";
import { upload } from "../config/multer";
import {
  uploadCatalog,
  getCatalogs,
  deleteCatalog,
} from "../controllers/catalogController";
import { authenticateUser } from "../middleware/authMiddleware"; // only admins upload
import { isAdmin } from "../middleware/isAdmin";

const router = express.Router();

// 🧾 Admin uploads
router.post(
  "/upload",
  authenticateUser,
  isAdmin,
  upload.single("file"),
  uploadCatalog
);

// Get all catalogs
router.get("/", getCatalogs);
// 🗑️ Delete catalog (admin only for now)
router.delete("/:id", authenticateUser, isAdmin, deleteCatalog);

export default router;
