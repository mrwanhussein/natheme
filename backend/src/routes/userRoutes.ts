import { Router } from "express";
import {
  getUsers,
  searchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { authenticateUser } from "../middleware/authMiddleware";
import { isAdmin } from "../middleware/isAdmin";

const router = Router();

// Admin routes
router.get("/", authenticateUser, isAdmin, getUsers);
router.get("/search", authenticateUser, isAdmin, searchUsers);
router.post("/", authenticateUser, isAdmin, createUser);
router.put("/:id", authenticateUser, isAdmin, updateUser);
router.delete("/:id", authenticateUser, isAdmin, deleteUser);

export default router;
