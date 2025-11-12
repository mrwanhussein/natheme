import { Router } from "express";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectsController";
import { isAdmin } from "../middleware/isAdmin";
import { authenticateUser } from "../middleware/authMiddleware";
import { uploadProject } from "../config/multer";
const router = Router();

router.get("/", getProjects);
router.post("/", authenticateUser, isAdmin, createProject);
// 🧱 Project Management (with image upload)
router.post("/api/projects", uploadProject.array("images"), createProject);

router.put("/:id", authenticateUser, isAdmin, updateProject);
router.delete("/:id", authenticateUser, isAdmin, deleteProject);

export default router;
