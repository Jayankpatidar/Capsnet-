import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  userId: { type: String, ref: "User", required: true },
  message: { type: String, required: true },
  reply: { type: String, required: true },
  language: { type: String, default: "en" },
  timestamp: { type: Date, default: Date.now },
});

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
