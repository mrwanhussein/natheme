import { Router } from "express";
import { sendContactMessage } from "../controllers/contactController";
import { authenticateUser } from "../middleware/authMiddleware";
const router = Router();

router.post("/", authenticateUser, sendContactMessage);

export default router;
