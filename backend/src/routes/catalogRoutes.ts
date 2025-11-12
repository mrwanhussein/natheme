import express from "express";
import { uploadCatalog } from "../config/multer";
import {
  getCatalogs,
  deleteCatalog,
  CreateCatalog,
} from "../controllers/catalogController";
import { authenticateUser } from "../middleware/authMiddleware"; // only admins upload
import { isAdmin } from "../middleware/isAdmin";

const router = express.Router();

// 🧾 Admin uploads
router.post(
  "/upload",
  authenticateUser,
  isAdmin,
  uploadCatalog.single("file"),
  CreateCatalog
);

// Get all catalogs
router.get("/", getCatalogs);
// 🗑️ Delete catalog (admin only for now)
router.delete("/:id", authenticateUser, isAdmin, deleteCatalog);

export default router;
