import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  createGroup,
  getUserGroups,
  getGroupById,
  addMember,
  removeMember,
  sendGroupMessage,
  getGroupMessages,
  leaveGroup,
  deleteGroup
} from "../controllers/groupController.js";

const router = express.Router();

// Create a new group
router.post("/create", protect, createGroup);

// Get user's groups
router.get("/my-groups", protect, getUserGroups);

// Get group by ID
router.get("/:groupId", protect, getGroupById);

// Add member to group
router.post("/:groupId/add-member", protect, addMember);

// Remove member from group
router.delete("/:groupId/remove-member/:memberId", protect, removeMember);

// Send message to group
router.post("/:groupId/message", protect, sendGroupMessage);

// Get group messages
router.get("/:groupId/messages", protect, getGroupMessages);

// Leave group
router.post("/:groupId/leave", protect, leaveGroup);

// Delete group
router.delete("/:groupId", protect, deleteGroup);

export default router;
