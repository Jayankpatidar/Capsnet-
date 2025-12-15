import fs from "fs"
import path from "path"
import mongoose from "mongoose";
import imagekit from "../config/imageKit.js";
import Post from "../model/Post.js";
import User from "../model/User.js";
import { createNotification } from "./notificationController.js";
// Add Post
export const addPosts = async (req, res) => {
    try {
        console.log("🔥 addPosts called with userId:", req.userId);
        console.log("🔥 req.body:", req.body);
        console.log("🔥 req.files:", req.files);
        const userId = req.userId;
        const {
            content,
            post_type,
            poll_options,
            hashtags,
            location,
            music_url,
            is_article,
            collab_users,
            scheduled_at,
            is_promoted,
            is_draft,
            draft_content,
            tagged_users
        } = req.body || {}

        let images = req.files?.filter(file => file.mimetype.startsWith('image/')) || []
        let videos = req.files?.filter(file => file.mimetype.startsWith('video/')) || []
        let documents = req.files?.filter(file => file.mimetype === 'application/pdf' || file.mimetype.startsWith('application/')) || []

        let image_urls = []
        let video_url = ""
        let document_urls = []

        // Handle image uploads - Always use local storage in uploads/images/
        if (images.length) {
            // Move files to uploads/images/ folder
            const imageDir = path.join(process.cwd(), 'uploads', 'images');
            if (!fs.existsSync(imageDir)) {
                fs.mkdirSync(imageDir, { recursive: true });
            }

            image_urls = images.map(image => {
                const newPath = path.join(imageDir, image.filename);
                // Move file to images folder
                fs.renameSync(image.path, newPath);
                return `/uploads/images/${image.filename}`;
            });
            console.log("✅ Images stored in uploads/images/:", image_urls);
        }

        // Handle video upload - Always use local storage in uploads/videos/
        if (videos.length > 0) {
            // Move file to uploads/videos/ folder
            const videoDir = 'uploads/videos/';
            if (!fs.existsSync(videoDir)) {
                fs.mkdirSync(videoDir, { recursive: true });
            }

            const video = videos[0]; // Assuming one video per post
            const newPath = `${videoDir}${video.filename}`;
            fs.renameSync(video.path, newPath);
            video_url = `/uploads/videos/${video.filename}`;
            console.log("✅ Video stored in uploads/videos/:", video_url);
        }

        // Handle document uploads - Always use local storage in uploads/pdf/
        if (documents.length) {
            // Move files to uploads/pdf/ folder
            const pdfDir = path.join(process.cwd(), 'uploads', 'pdf');
            if (!fs.existsSync(pdfDir)) {
                fs.mkdirSync(pdfDir, { recursive: true });
            }

            document_urls = documents.map(doc => {
                const newPath = path.join(pdfDir, doc.filename);
                // Move file to pdf folder
                fs.renameSync(doc.path, newPath);
                return `/uploads/pdf/${doc.filename}`;
            });
            console.log("✅ Documents stored in uploads/pdf/:", document_urls);
        }

        // Extract hashtags from content if not provided
        let extractedHashtags = hashtags || []
        if (content && !hashtags) {
            const hashtagRegex = /#(\w+)/g;
            const matches = content.match(hashtagRegex);
            if (matches) {
                extractedHashtags = matches.map(tag => tag.slice(1)); // Remove #
            }
        }

        // Prepare poll options
        let processedPollOptions = []
        if (poll_options) {
            try {
                const parsed = typeof poll_options === 'string' ? JSON.parse(poll_options) : poll_options
                if (Array.isArray(parsed)) {
                    processedPollOptions = parsed.map(option => ({
                        text: option.text || option,
                        votes: []
                    }))
                }
            } catch (e) {
                console.error('Invalid poll_options format:', e.message)
            }
        }

        // Prepare collab_users
        let processedCollabUsers = []
        if (collab_users) {
            try {
                const parsed = typeof collab_users === 'string' ? JSON.parse(collab_users) : collab_users
                if (Array.isArray(parsed)) {
                    processedCollabUsers = parsed
                }
            } catch (e) {
                console.error('Invalid collab_users format:', e.message)
            }
        }

        // Prepare tagged_users
        let processedTaggedUsers = []
        if (tagged_users) {
            try {
                const parsed = typeof tagged_users === 'string' ? JSON.parse(tagged_users) : tagged_users
                if (Array.isArray(parsed)) {
                    processedTaggedUsers = parsed
                }
            } catch (e) {
                console.error('Invalid tagged_users format:', e.message)
            }
        }

        console.log("🔥 Creating post with data:", {
            user: userId,
            content,
            image_urls,
            video_url,
            documents: document_urls,
            poll_options: processedPollOptions,
            hashtags: extractedHashtags,
            location,
            music_url,
            is_article: is_article || false,
            collab_users: processedCollabUsers,
            scheduled_at: scheduled_at ? new Date(scheduled_at) : null,
            is_promoted: is_promoted || false,
            is_draft: is_draft || false,
            draft_content: draft_content || null,
            post_type,
            tagged_users: processedTaggedUsers
        });

        const newPost = await Post.create({
            user: userId,
            content,
            image_urls,
            video_url,
            documents: document_urls,
            poll_options: processedPollOptions,
            hashtags: extractedHashtags,
            location,
            music_url,
            is_article: is_article || false,
            collab_users: processedCollabUsers,
            scheduled_at: scheduled_at ? new Date(scheduled_at) : null,
            is_promoted: is_promoted || false,
            is_draft: is_draft || false,
            draft_content: draft_content || null,
            post_type,
            tagged_users: processedTaggedUsers
        });

        console.log("✅ Post created successfully:", newPost._id);

        // If scheduled, don't notify yet
        if (!scheduled_at) {
            // Send notification to followers/connections
            const user = await User.findById(userId);
            const connections = Array.isArray(user.connections) ? user.connections : [];
            const following = Array.isArray(user.following) ? user.following : [];

            const usersToNotify = [...connections, ...following];

            for (const followerId of usersToNotify) {
                await createNotification(
                    followerId,
                    "post",
                    `${user.full_name} created a new post`,
                    userId,
                    { postId: newPost._id }
                );
            }
        }

        console.log("✅ Post created successfully. Response data:", {
            post_id: newPost._id,
            post_type: newPost.post_type,
            content: newPost.content,
            image_urls: newPost.image_urls,
            video_url: newPost.video_url,
            documents: newPost.documents,
            poll_options: newPost.poll_options,
            is_article: newPost.is_article,
            collab_users: newPost.collab_users,
            tagged_users: newPost.tagged_users
        });

        res.json({ success: true, message: is_draft ? "Draft saved successfully" : "Post created successfully", post: newPost })

    } catch (error) {
        console.error("❌ Error creating post:", error.message);
        res.json({ success: false, message: error.message })
    }
}

// Get Feed Posts
export const getFeedPosts = async (req, res) => {
    try {
        const userId = req.userId;
        const currentUser = await User.findById(userId);

        const connections = Array.isArray(currentUser.connections) ? currentUser.connections : [];
        const following = Array.isArray(currentUser.following) ? currentUser.following : [];

        const userIds = [userId, ...connections, ...following];

        // ✅ IMPORTANT: Populate user data for posts
        const posts = await Post.find({ user: { $in: userIds } })
            .populate('user', 'full_name username profile_picture')
            .populate('comments.user', 'full_name username profile_picture')
            .sort({ createdAt: -1 });

        // ✅ Ensure all posts have valid user data
        const normalizedPosts = posts.map(post => {
            const postObj = post.toObject();

            // Ensure user is populated
            if (!postObj.user || typeof postObj.user === 'string') {
                postObj.user = {
                    _id: postObj.user || null,
                    full_name: 'Unknown User',
                    username: 'unknown',
                    profile_picture: '/default-avatar.png'
                };
            }

            // Ensure comments have user data
            if (Array.isArray(postObj.comments)) {
                postObj.comments = postObj.comments.map(comment => {
                    if (!comment.user || typeof comment.user === 'string') {
                        comment.user = {
                            _id: comment.user || null,
                            full_name: 'Unknown User',
                            username: 'unknown',
                            profile_picture: '/default-avatar.png'
                        };
                    }
                    return comment;
                });
            }

            return postObj;
        });

        res.json({ success: true, posts: normalizedPosts });

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// DEPRECATED: Use toggleLikePost instead
// This function was causing undefined userIds error
export const likePost = async (req, res) => {
    try {
        const { postId } = req.body;
        const userId = req.userId;

        const post = await Post.findById(postId)
            .populate('user', 'full_name username profile_picture')
            .populate('comments.user', 'full_name username profile_picture');

        if (!post) {
            return res.json({ success: false, message: "Post not found" });
        }

        // Toggle like
        const isLiked = post.likes.includes(userId);
        if (isLiked) {
            post.likes = post.likes.filter(id => id.toString() !== userId);
        } else {
            post.likes.push(userId);
        }

        await post.save();

        res.json({ success: true, likes: post.likes, liked: !isLiked });
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Toggle Like Post (for double-tap)
export const toggleLikePost = async (req, res) => {
    try {
        const { postId } = req.body;
        const post = await Post.findById(postId);
        const idx = post.likes.indexOf(req.userId);
        if (idx > -1) post.likes.splice(idx, 1); else post.likes.push(req.userId);
        await post.save();
        res.json({ success: true, likes: post.likes.length });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Save Post
export const savePost = async (req, res) => {
    try {
        const { postId } = req.body;
        const user = await User.findById(req.userId);
        if (!user.savedPosts.includes(postId)) user.savedPosts.push(postId);
        await user.save();
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Add Comment
export const addComment = async (req, res) => {
    try {
        const { postId, content, parentCommentId } = req.body;
        const userId = req.userId;

        if (!postId || !content) {
            return res.json({ success: false, message: "Missing fields" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.json({ success: false, message: "Post not found" });
        }

        const newComment = {
            user: userId,
            content,
            parentCommentId: parentCommentId || null,
        };

        post.comments.push(newComment);
        await post.save();

        // Populate the last added comment
        const populatedComment = await Post.populate(post.comments.slice(-1)[0], {
            path: "user",
            select: "full_name username profile_picture",
        });

        res.json({ success: true, comment: populatedComment });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Delete Post
export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.userId;

        const post = await Post.findById(postId);
        if (!post) {
            return res.json({ success: false, message: "Post not found" });
        }

        // Check if user owns the post
        if (post.user.toString() !== userId) {
            return res.json({ success: false, message: "Unauthorized to delete this post" });
        }

        await Post.findByIdAndDelete(postId);
        res.json({ success: true, message: "Post deleted successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get Sponsored Posts
export const getSponsoredPosts = async (req, res) => {
    try {
        // For now, return some dummy sponsored posts
        // In a real app, this would be based on user interests, location, etc.
        const sponsoredPosts = [
            {
                _id: "sponsored_1",
                user: {
                    _id: "sponsored_user_1",
                    full_name: "TechCorp Solutions",
                    username: "techcorp",
                    profile_picture: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=200"
                },
                content: "🚀 Revolutionize your workflow with our cutting-edge project management tools. Boost productivity by 40%!",
                image_urls: ["https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800"],
                post_type: "sponsored",
                likes_count: [],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: "sponsored_2",
                user: {
                    _id: "sponsored_user_2",
                    full_name: "Creative Studio",
                    username: "creativestudio",
                    profile_picture: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=200"
                },
                content: "🎨 Unleash your creativity with our premium design software. Perfect for professionals and hobbyists alike.",
                image_urls: ["https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800"],
                post_type: "sponsored",
                likes_count: [],
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        res.json({ success: true, posts: sponsoredPosts });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
