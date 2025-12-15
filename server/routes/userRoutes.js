import express from "express";
import {
    acceptUserConnection, discoverUsers, followUsers,
    getUserConnections, getUserData, getUserProfile, sendConnectionRequests,
    unFollowUsers, updateUserData, registerUser, loginUser, getSuggestedUsers,
    endorseSkill, addExperience, uploadResume, uploadCertificate, getProfileViewStats,
    setup2FA, verify2FA, testEndpoint, addEducation, editEducation, deleteEducation,
    editExperience, deleteExperience, toggleAccountType, togglePrivacy,
    rejectConnectionRequest, removeFollower, blockUser, unblockUser, restrictUser,
    unrestrictUser, getMutualConnections, followBack, verifyEmail
} from "../controllers/userController.js";

import { protect } from "../middlewares/auth.js";
import { upload } from "../config/multer.js";
import { getRecentMessages } from "../controllers/messageController.js";

const userRouter = express.Router();

// Public routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/verify-email/:token", verifyEmail);

// Protected routes
userRouter.get("/data", protect, getUserData);
userRouter.post(
    "/update",
    upload.fields([{ name: "profile", maxCount: 1 }, { name: "cover", maxCount: 1 }]),
    protect,
    updateUserData
);

userRouter.post("/discover", protect, discoverUsers);
userRouter.post("/follow", protect, followUsers);
userRouter.post("/follow-back", protect, followBack);
userRouter.post("/unfollow", protect, unFollowUsers);
userRouter.post("/remove-follower", protect, removeFollower);

userRouter.post("/connect", protect, sendConnectionRequests);
userRouter.post("/accept", protect, acceptUserConnection);
userRouter.get("/connections", protect, getUserConnections);

userRouter.get("/profiles/:profileId", protect, getUserProfile);
userRouter.get("/recent-messages", protect, getRecentMessages);
userRouter.get("/suggested-users", protect, getSuggestedUsers);

userRouter.post("/endorse-skill", protect, endorseSkill);
userRouter.post("/add-experience", protect, addExperience);

userRouter.post("/upload-resume", protect, upload.single("resume"), uploadResume);
userRouter.post("/upload-certificate", protect, upload.single("certificate"), uploadCertificate);

userRouter.get("/profile-stats", protect, getProfileViewStats);
userRouter.post("/setup-2fa", protect, setup2FA);
userRouter.post("/verify-2fa", protect, verify2FA);

// Education routes
userRouter.post("/add-education", protect, addEducation);
userRouter.put("/edit-education/:educationId", protect, editEducation);
userRouter.delete("/delete-education/:educationId", protect, deleteEducation);

// Experience edit/delete routes
userRouter.put("/edit-experience/:experienceId", protect, editExperience);
userRouter.delete("/delete-experience/:experienceId", protect, deleteExperience);

// Account settings
userRouter.post("/toggle-account-type", protect, toggleAccountType);
userRouter.post("/toggle-privacy", protect, togglePrivacy);

// Block/Restrict routes
userRouter.post("/block", protect, blockUser);
userRouter.post("/unblock", protect, unblockUser);
userRouter.post("/restrict", protect, restrictUser);
userRouter.post("/unrestrict", protect, unrestrictUser);

export default userRouter;
