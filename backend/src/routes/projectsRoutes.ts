import { Router } from "express";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectsController";
import { isAdmin } from "../middleware/isAdmin";
import { authenticateUser } from "../middleware/authMiddleware";
const router = Router();

router.get("/", getProjects);
router.post("/", authenticateUser, isAdmin, createProject);
router.put("/:id", authenticateUser, isAdmin, updateProject);
router.delete("/:id", authenticateUser, isAdmin, deleteProject);

export default router;
