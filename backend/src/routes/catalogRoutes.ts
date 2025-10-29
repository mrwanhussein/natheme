import express from "express";
import { upload } from "../config/multer";
import { uploadCatalog, getCatalogs } from "../controllers/catalogController";
import { authenticateUser } from "../middleware/authMiddleware"; // only admins upload

const router = express.Router();

// 🧾 Admin uploads
router.post("/upload", authenticateUser, upload.single("file"), uploadCatalog);

// Get all catalogs
router.get("/", getCatalogs);

export default router;
