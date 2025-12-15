import express from "express";
import {
  initiateCall,
  acceptCall,
  declineCall,
  endCall,
  getCallDetails,
  getCallHistory,
  sendCallMessage,
  toggleRecording
} from "../controllers/videoCallController.js";
import { protect } from "../middlewares/auth.js";

const videoCallRouter = express.Router();

// Initiate a video call
videoCallRouter.post("/initiate", protect, initiateCall);

// Accept a call
videoCallRouter.post("/accept", protect, acceptCall);

// Decline a call
videoCallRouter.post("/decline", protect, declineCall);

// End a call
videoCallRouter.post("/end", protect, endCall);

// Get call details
videoCallRouter.get("/:call_id", protect, getCallDetails);

// Get call history
videoCallRouter.get("/history", protect, getCallHistory);

// Send message during call
videoCallRouter.post("/message", protect, sendCallMessage);

// Toggle recording
videoCallRouter.post("/recording", protect, toggleRecording);

export default videoCallRouter;
