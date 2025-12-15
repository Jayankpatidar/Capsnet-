import mongoose from "mongoose"

const postSchema = new mongoose.Schema({

    user: { type: String, ref: "User", required: true },
    content: { type: String },
    image_urls: [{ type: String }],
    video_url: { type: String },
    documents: [{ type: String }], // For PDF/Document uploads
    poll_options: [{
        text: { type: String, required: true },
        votes: [{ type: String, ref: 'User' }] // Users who voted for this option
    }],
    hashtags: [{ type: String }],
    location: { type: String },
    music_url: { type: String },
    is_article: { type: Boolean, default: false }, // For long posts/articles
    collab_users: [{ type: String, ref: 'User' }],
    scheduled_at: { type: Date },
    is_promoted: { type: Boolean, default: false },
    is_draft: { type: Boolean, default: false },
    draft_content: { type: Object }, // To save draft data
    post_type: { type: String, enum: ["image", "text", "text_with_image", "video", "carousel", "pdf", "poll", "article", "collab"], required: true },
    like_counts: [{ type: String, ref: "User" }],
    tagged_users: [{ type: String, ref: 'User' }],
    likes: [{ type: String }],
    comments: [{
        user: { type: String, ref: 'User', required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }],

}, { timestamps: true, minimize: false })

const Post = mongoose.model("Post", postSchema)

export default Post
