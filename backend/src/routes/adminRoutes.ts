import { Router } from "express";
import {
  promoteToAdmin,
  demoteToCustomer,
  getDashboardSummary,
  adminAddProject,
  adminUpdateProject,
  adminDeleteProject,
  adminUploadCatalog,
  adminDeleteCatalog,
} from "../controllers/adminController";
import { authenticateUser } from "../middleware/authMiddleware";
import { isAdmin } from "../middleware/isAdmin";
import { isOwner } from "../middleware/isOwner"; // ✅ new import
import { upload } from "../config/multer";

const router = Router();

// ✅ Only owner (super admin) can promote/demote users
router.put("/promote", authenticateUser, isAdmin, isOwner, promoteToAdmin);
router.put("/demote", authenticateUser, isAdmin, isOwner, demoteToCustomer);
router.get("/dashboard", authenticateUser, isAdmin, getDashboardSummary);

// 🧱 Project Management
router.post("/projects", authenticateUser, isAdmin, adminAddProject);
router.put("/projects/:id", authenticateUser, isAdmin, adminUpdateProject);
router.delete("/projects/:id", authenticateUser, isAdmin, adminDeleteProject);

// 📚 Catalog Management
router.post(
  "/catalogs/upload",
  authenticateUser,
  isAdmin,
  upload.single("file"),
  adminUploadCatalog
);
router.delete("/catalogs/:id", authenticateUser, isAdmin, adminDeleteCatalog);

export default router;
