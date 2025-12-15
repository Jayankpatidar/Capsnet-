import User from "../model/User.js";
import Post from "../model/Post.js";
import Chat from "../model/Chat.js";
import CollaborationPost from "../model/CollaborationPost.js";

export const getAdminAnalytics = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalChats = await Chat.countDocuments();
    const totalCollaborations = await CollaborationPost.countDocuments();

    const departmentStats = await User.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } }
    ]);

    const roleStats = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    const recentPosts = await Post.find().populate("user").sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      analytics: {
        totalUsers,
        totalPosts,
        totalChats,
        totalCollaborations,
        departmentStats,
        roleStats,
        recentUsers,
        recentPosts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
