import dotenv from "dotenv";
dotenv.config();

import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import connectDb from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import storyRouter from "./routes/storyRoutes.js";
import jobRouter from "./routes/jobRoutes.js";
import reelRouter from "./routes/reelRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import collaborationRoutes from "./routes/collaborationRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import videoCallRoutes from "./routes/videoCallRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";

import Message from "./model/Message.js";
import User from "./model/User.js";

// DEV fallback for JWT_SECRET to avoid mismatched signing/verifying during local testing
if (!process.env.JWT_SECRET && process.env.NODE_ENV !== "production") {
  process.env.JWT_SECRET = "devsecret_local";
  console.warn("⚠️ JWT_SECRET not set — using development fallback 'devsecret_local'. Do NOT use in production.");
}

// Print masked JWT secret at startup (safe-ish for dev)
if (process.env.NODE_ENV !== "production") {
  const secret = process.env.JWT_SECRET || "<missing>";
  const masked = typeof secret === "string" ? (secret.length > 6 ? `${secret.slice(0,3)}...${secret.slice(-3)}` : secret) : "<not-string>";
  console.debug(`[server] JWT_SECRET in use (masked): ${masked}`);
}

// Add cookie parser
import cookieParser from "cookie-parser";

const app = express();

// ✅ Connect MongoDB
await connectDb();

// ✅ Create Default Test User (if missing)
const createDefaultUser = async () => {
  try {
    const existingUser = await User.findOne({ email: "test@example.com" });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      const defaultUser = new User({
        _id: new mongoose.Types.ObjectId().toString(),
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword,
        username: "testuser",
        full_name: "Test User",
        role: "admin",
      });
      await defaultUser.save();
      console.log("✅ Default admin user created: test@example.com / password123");
    } else {
      console.log("ℹ️ Default user already exists: test@example.com / password123");
      // Always ensure the test user has admin role
      if (existingUser.role !== "admin") {
        existingUser.role = "admin";
        await existingUser.save();
        console.log("🔄 Role updated to admin for existing user");
      }
      if (!existingUser.password) {
        existingUser.password = await bcrypt.hash("password123", 10);
        await existingUser.save();
        console.log("🔄 Password updated for existing user");
      }
    }
  } catch (error) {
    console.error("❌ Error creating default user:", error.message);
  }
};

await createDefaultUser();

// ✅ Security Middleware
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs (increased for development)
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

// ✅ Middleware
app.use(morgan("tiny"));
app.use(express.json());
// register cookie parser so auth can read cookies
app.use(cookieParser());

// ✅ Smart CORS (accept all localhost ports for dev + mobile access)
app.use(
  cors({
    origin: [/http:\/\/127\.0\.0\.1:\d+$/, /http:\/\/localhost:\d+$/, /http:\/\/10\.255\.66\.225:\d+$/],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Serve static files from uploads directory
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    res.set('Access-Control-Allow-Origin', '*');
  }
}));

// ✅ Serve static files from client/public directory (for default avatar, etc.)
app.use(express.static(path.join(process.cwd(), 'client/public')));

// ✅ API Routes
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/story", storyRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/reel", reelRouter);
app.use("/api/message", messageRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/collaboration", collaborationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/video-call", videoCallRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/search", searchRoutes);

// ✅ Health Check Endpoint
app.get("/", (_req, res) => {
  res.send("🚀 The Server is Running Successfully!");
});

// ✅ Create HTTP server and Socket.IO
const PORT = process.env.PORT || 5001;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [/http:\/\/127\.0\.0\.1:\d+$/, /http:\/\/localhost:\d+$/, /http:\/\/10\.255\.66\.225:\d+$/],
    credentials: true,
  }
});

// ✅ Socket.IO Real-time Features
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user room for private messages
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  // Handle sending messages
  socket.on('sendMessage', async (data) => {
    try {
      // Save message to DB using existing Message model
      const message = await Message.create({
        from_user_id: data.senderId,
        to_user_id: data.receiverId,
        text: data.content,
        message_type: data.messageType || "text",
        media_url: data.mediaUrl,
        seen: false
      });

      // Emit to receiver
      io.to(data.receiverId).emit('newMessage', message);
      // Emit to sender for confirmation
      socket.emit('messageSent', message);
    } catch (error) {
      socket.emit('messageError', error.message);
    }
  });

  // AI Chat Assistant (Real-time)
  socket.on('sendAIMessage', async (data) => {
    try {
      console.log('Received sendAIMessage:', data);
      const { message, language = "en", userId } = data;

      if (!message || !userId) {
        console.log('Missing message or userId');
        socket.emit('aiError', 'Message and userId are required');
        return;
      }

      // Import aiAssistant function
      const { aiAssistant } = await import('./controllers/aiController.js');

      // Create mock req/res objects for the aiAssistant function
      const mockReq = {
        body: { message, language },
        userId: userId
      };

      const mockRes = {
        json: (response) => {
          console.log('AI Response:', response);
          if (response.success) {
          socket.emit('aiReply', {
            userMessage: message,
            aiReply: response.reply,
            timestamp: new Date().toISOString()
          });
          } else {
            socket.emit('aiError', response.message || 'AI service error');
          }
        }
      };

      // Call the aiAssistant function
      await aiAssistant(mockReq, mockRes);

    } catch (error) {
      console.error('AI Chat Error:', error);
      socket.emit('aiError', 'Failed to get AI response');
    }
  });

  // Typing indicator
  socket.on('typing', (data) => {
    socket.to(data.toUserId).emit('userTyping', { from: data.fromUserId });
  });

  socket.on('stopTyping', (data) => {
    socket.to(data.toUserId).emit('userStopTyping', { from: data.fromUserId });
  });

  // Message reactions
  socket.on('addReaction', async (data) => {
    try {
      const message = await Message.findById(data.messageId);
      if (message) {
        message.reactions.push({ user: data.userId, emoji: data.emoji });
        await message.save();
        io.to(data.receiverId).emit('reactionAdded', { messageId: data.messageId, reaction: { user: data.userId, emoji: data.emoji } });
      }
    } catch (error) {
      socket.emit('reactionError', error.message);
    }
  });

  // Mark messages as read
  socket.on('markAsRead', async (data) => {
    try {
      await Message.updateMany(
        { from_user_id: data.senderId, to_user_id: data.userId, seen: false },
        { seen: true }
      );
      io.to(data.senderId).emit('messagesRead', { by: data.userId });
    } catch (error) {
      socket.emit('readError', error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// ✅ Start Server
httpServer.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`📱 Mobile access: http://10.255.66.225:${PORT}`);
  console.log(`🔌 Socket.IO enabled for real-time features`);
});
