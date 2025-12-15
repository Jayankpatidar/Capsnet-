import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: String, ref: "User", required: true },
  type: {
    type: String,
    enum: ["like", "comment", "follow", "connection_request", "connection_accepted", "post", "story", "collaboration"],
    required: true
  },
  message: { type: String, required: true },
  fromUserId: { type: String, ref: "User" },
  postId: { type: String, ref: "Post" },
  storyId: { type: String, ref: "Story" },
  collaborationId: { type: String, ref: "CollaborationPost" },
  isRead: { type: Boolean, default: false },
  data: { type: mongoose.Schema.Types.Mixed } // Additional data for the notification
},
{ timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
