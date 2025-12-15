import express from "express";
import { createCollaborationPost, getCollaborationPosts, applyForCollaboration } from "../controllers/collaborationController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.post("/posts", protect, createCollaborationPost);
router.get("/posts", protect, getCollaborationPosts);
router.post("/posts/:postId/apply", protect, applyForCollaboration);

export default router;
