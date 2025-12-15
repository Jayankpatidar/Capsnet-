import express from "express";
import { getUserNotifications, markAsRead, markAllAsRead, getUnreadCount } from "../controllers/notificationController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", protect, getUserNotifications);
router.put("/:notificationId/read", protect, markAsRead);
router.put("/read-all", protect, markAllAsRead);
router.get("/unread-count", protect, getUnreadCount);

export default router;
