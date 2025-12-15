import Reel from "../model/Reel.js";
import User from "../model/User.js";

// Get Reels for You (Trending Algorithm)
export const getReelsForYou = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        const userInterests = user.interests || [];

        // Fetch all reels without limit or filtering
        const reels = await Reel.find()
            .populate('user', 'full_name username profile_picture')
            .populate('comments.user', 'username full_name profile_picture')
            .sort({ createdAt: -1 });

        res.json({ success: true, reels });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Like Reel
export const likeReel = async (req, res) => {
    try {
        const { reelId } = req.body;
        const userId = req.userId;

        const reel = await Reel.findById(reelId);
        if (!reel) return res.json({ success: false, message: "Reel not found" });

        const isLiked = reel.likes.includes(userId);
        if (isLiked) {
            reel.likes = reel.likes.filter(id => id !== userId);
        } else {
            reel.likes.push(userId);
        }

        await reel.save();
        res.json({ success: true, likes: reel.likes });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Upload Reel (Basic)
export const uploadReel = async (req, res) => {
    try {
        const userId = req.userId;
        const { content, hashtags, location, music_url } = req.body;
        const file = req.files ? req.files[0] : req.file;

        if (!file) return res.json({ success: false, message: "No video file provided" });

        const mediaUrl = `/uploads/${file.filename}`;

        const reel = await Reel.create({
            user: userId,
            video_url: mediaUrl,
            content,
            hashtags: hashtags || [],
            location,
            music_url
        });

        res.json({ success: true, reel });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Add Reel with full features
export const addReel = async (req, res) => {
    try {
        const userId = req.userId;
        const {
            content,
            hashtags,
            location,
            music_url,
            effects,
            template,
            voiceover_url,
            captions,
            remix,
            green_screen,
            volume
        } = req.body;
        const file = req.files ? req.files[0] : req.file;

        if (!file) return res.json({ success: false, message: "No video file provided" });

        const videoUrl = `/uploads/reels/${file.filename}`;

        const reel = await Reel.create({
            user: userId,
            mediaUrl: videoUrl,
            video_url: videoUrl, // Keep for backward compatibility
            caption: content,
            content, // Keep for backward compatibility
            hashtags: hashtags || [],
            location,
            musicUrl: music_url,
            music_url, // Keep for backward compatibility
            effects: effects || [],
            template,
            voiceoverUrl: voiceover_url,
            captions,
            remix: remix === 'true' || remix === true,
            greenScreen: green_screen === 'true' || green_screen === true,
            volume: volume === 'true' || volume === true
        });

        res.json({ success: true, reel });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Create Reel with Advanced Features
export const createReelWithFeatures = async (req, res) => {
    try {
        const userId = req.userId;
        const { caption, musicUrl, effects, template, voiceoverUrl, captions, remix, greenScreen } = req.body;
        const file = req.file;

        if (!file) return res.json({ success: false, message: "No video file provided" });

        const mediaUrl = `/uploads/reels/${file.filename}`;

        // Process video with features (simplified - in real app, use FFmpeg or cloud service)
        // For now, just save the data; actual processing would be done client-side or via API

        const reel = await Reel.create({
            user: userId,
            mediaUrl,
            caption,
            musicUrl,
            effects: effects || [],
            template,
            voiceoverUrl,
            captions,
            remix: remix || false,
            greenScreen: greenScreen || false
        });

        res.json({ success: true, reel });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Reel Analytics
export const getReelAnalytics = async (req, res) => {
    try {
        const { reelId } = req.params;
        const userId = req.userId;

        const reel = await Reel.findById(reelId);
        if (!reel || reel.user !== userId) return res.json({ success: false, message: "Reel not found or unauthorized" });

        // Calculate engagement rate (likes + shares) / views
        const engagementRate = reel.views > 0 ? ((reel.likes.length + reel.analytics.shares) / reel.views) * 100 : 0;

        res.json({
            success: true,
            analytics: {
                totalViews: reel.views,
                likes: reel.likes.length,
                shares: reel.analytics.shares,
                engagementRate: engagementRate.toFixed(2)
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Increment View Count
export const incrementView = async (req, res) => {
    try {
        const { reelId } = req.body;

        const reel = await Reel.findByIdAndUpdate(reelId, { $inc: { views: 1, 'analytics.totalViews': 1 } }, { new: true });
        if (!reel) return res.json({ success: false, message: "Reel not found" });

        res.json({ success: true, views: reel.views });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Add Comment to Reel
export const addComment = async (req, res) => {
    try {
        const { reelId, text } = req.body;
        const userId = req.userId;

        const reel = await Reel.findById(reelId);
        if (!reel) return res.json({ success: false, message: "Reel not found" });

        const comment = {
            user: userId,
            text,
            createdAt: new Date()
        };

        reel.comments.push(comment);
        await reel.save();

        // Populate user data for the new comment
        await reel.populate('comments.user', 'username full_name profile_picture');

        res.json({ success: true, comment: reel.comments[reel.comments.length - 1] });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Share Reel
export const shareReel = async (req, res) => {
    try {
        const { reelId } = req.body;

        const reel = await Reel.findByIdAndUpdate(reelId, { $inc: { 'analytics.shares': 1 } }, { new: true });
        if (!reel) return res.json({ success: false, message: "Reel not found" });

        res.json({ success: true, shares: reel.analytics.shares });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
