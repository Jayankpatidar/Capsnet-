import express from "express";
import multer from "multer";
import { parseResume, generateCaption, detectFakeProfile, analyzeProfile, suggestConnections, getRecentPosts, getUserStories, getJobSuggestions, aiAssistant, getChatHistory } from "../controllers/aiController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// AI Resume Parser
router.post("/parse-resume", protect, upload.single('resume'), parseResume);

// AI Auto Captions & Hashtags
router.post("/generate-caption", protect, generateCaption);

// AI Fake Profile Detection
router.post("/detect-fake", protect, detectFakeProfile);

// AI Profile Analyzer
router.get("/analyze-profile", protect, analyzeProfile);

// AI App Data Queries
router.get("/suggest-connections", protect, suggestConnections);
router.get("/recent-posts", protect, getRecentPosts);
router.get("/user-stories", protect, getUserStories);
router.get("/job-suggestions", protect, getJobSuggestions);

// AI Chat
router.post("/ai-assistant", protect, aiAssistant);
router.get("/chat-history", protect, getChatHistory);

export default router;
