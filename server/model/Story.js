import mongoose from "mongoose"

const storySchema = new mongoose.Schema({

    user: { type: String, ref: "User", required: true },
    content: { type: String },
    media_url: { type: String },
    media_type: { type: String, enum: ["image", "text", "video"], },
    views_count: [{ type: String, ref: "User" }],
    background_color: { type: String },
    viewers: [{ type: String, ref: 'User' }],
    expiresAt: Date,
    highlight: { type: String, default: null }, // highlight group id or name

    // Advanced Features
    music_url: { type: String }, // Music sticker URL
    music_title: { type: String }, // Music title for display
    poll_options: [{
        text: { type: String, required: true },
        votes: [{ type: String, ref: 'User' }],
        count: { type: Number, default: 0 }
    }],
    quiz_options: [{
        question: { type: String },
        answers: [{
            text: { type: String },
            is_correct: { type: Boolean, default: false }
        }],
        user_answer: { type: String, ref: 'User' }
    }],
    qna_enabled: { type: Boolean, default: false },
    qna_responses: [{
        user: { type: String, ref: 'User' },
        question: { type: String },
        answer: { type: String },
        timestamp: { type: Date, default: Date.now }
    }],
    gif_url: { type: String }, // GIF URL
    sticker_url: { type: String }, // Sticker URL
    swipe_link: { type: String }, // Swipe-up link URL
    swipe_link_text: { type: String }, // Display text for swipe link
    close_friends_only: { type: Boolean, default: false }, // Only visible to close friends

}, { timestamps: true, minimize: false })

const Story = mongoose.model("Story", storySchema)

export default Story