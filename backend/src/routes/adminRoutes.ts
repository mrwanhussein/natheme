import { Router } from "express";
import {
  promoteToAdmin,
  demoteToCustomer,
  getDashboardSummary,
  getAllCustomers,
  getAllAdmins,
} from "../controllers/adminController";
import { authenticateUser } from "../middleware/authMiddleware";
import { isAdmin } from "../middleware/isAdmin";
import { isOwner } from "../middleware/isOwner"; // ✅ new import

import {
  createProject,
  deleteProject,
  updateProject,
} from "../controllers/projectsController";
import { deleteCatalog, CreateCatalog } from "../controllers/catalogController";
import { uploadCatalog, uploadProject } from "../config/multer";

const router = Router();

// ✅ Only owner (super admin) can promote/demote users
router.put("/promote", authenticateUser, isAdmin, isOwner, promoteToAdmin);
router.put("/demote", authenticateUser, isAdmin, isOwner, demoteToCustomer);
router.get("/dashboard", authenticateUser, isAdmin, getDashboardSummary);

// 🧱 Project Management
router.post("/projects", uploadProject.array("images"), createProject);
router.put("/projects/:id", authenticateUser, isAdmin, updateProject);
router.delete("/projects/:id", authenticateUser, isAdmin, deleteProject);

// 📚 Catalog Management
router.post("/catalogs", uploadCatalog.single("file"), CreateCatalog);
router.delete("/catalogs/:id", authenticateUser, isAdmin, deleteCatalog);

// 🔹 Get all customers (admin only)
router.get("/customers", authenticateUser, isAdmin, getAllCustomers);
router.get("/admins", authenticateUser, isAdmin, getAllAdmins);
export default router;
