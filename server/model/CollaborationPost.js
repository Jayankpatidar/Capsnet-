import mongoose from "mongoose";

const collaborationPostSchema = new mongoose.Schema({
  userId: { type: String, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  skillsNeeded: [{ type: String }],
  projectType: { type: String, enum: ["hackathon", "startup", "academic", "personal"], default: "personal" },
  status: { type: String, enum: ["open", "closed"], default: "open" },
  applicants: [{ userId: { type: String, ref: "User" }, message: String }],
},
{ timestamps: true });

const CollaborationPost = mongoose.model("CollaborationPost", collaborationPostSchema);

export default CollaborationPost;
