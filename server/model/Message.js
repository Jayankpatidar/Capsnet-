import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({

    from_user_id: { type: String, ref: "User", required: true },
    to_user_id: { type: String, ref: "User" }, // Optional for group messages
    group_id: { type: mongoose.Schema.Types.ObjectId, ref: "GroupChat" }, // For group messages
    text: { type: String, trim: true },
    message_type: {
        type: String,
        enum: ["text", "image", "video", "voice", "document", "post", "reel", "article", "location", "contact"],
        default: "text"
    },
    media_url: { type: String },
    media_name: { type: String }, // For documents
    media_size: { type: Number }, // For documents
    duration: { type: Number }, // For voice/video messages
    thumbnail_url: { type: String }, // For videos
    post_data: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }, // For shared posts
    reel_data: { type: mongoose.Schema.Types.ObjectId, ref: "Reel" }, // For shared reels
    article_data: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }, // For shared articles
    location_data: {
        latitude: Number,
        longitude: Number,
        address: String
    },
    contact_data: {
        name: String,
        phone: String,
        email: String
    },
    seen: { type: Boolean, default: false },
    seen_by: [{ user_id: String, seen_at: Date }], // For group messages
    delivered: { type: Boolean, default: false },
    delivered_at: Date,
    reactions: [{ user: String, emoji: String, reacted_at: Date }],
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    forwarded: { type: Boolean, default: false },
    forwarded_from: { type: String, ref: "User" },
    is_deleted: { type: Boolean, default: false }, // Soft delete
    deleted_at: Date,
    edited: { type: Boolean, default: false },
    edited_at: Date,
    expires_at: Date, // For vanish mode messages
    is_inmail: { type: Boolean, default: false }, // InMail-style messaging for non-followers

}, { timestamps: true, minimize: false })

const Message = mongoose.model("Message", messageSchema)

export default Message
