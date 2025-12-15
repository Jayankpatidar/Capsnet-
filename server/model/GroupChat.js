import mongoose from "mongoose"

const groupChatSchema = new mongoose.Schema({

    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    avatar: { type: String }, // Group avatar URL
    created_by: { type: String, ref: "User", required: true },
    admins: [{ type: String, ref: "User" }], // Group admins
    members: [{
        user: { type: String, ref: "User", required: true },
        joined_at: { type: Date, default: Date.now },
        role: { type: String, enum: ["admin", "member"], default: "member" },
        is_muted: { type: Boolean, default: false },
        muted_until: Date
    }],
    is_private: { type: Boolean, default: false }, // Private groups require invitation
    max_members: { type: Number, default: 100 },
    last_message: {
        message_id: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
        text: String,
        sender: { type: String, ref: "User" },
        sent_at: Date
    },
    message_count: { type: Number, default: 0 },
    theme: {
        background_color: { type: String, default: "#ffffff" },
        text_color: { type: String, default: "#000000" },
        wallpaper: String
    },
    settings: {
        allow_member_invites: { type: Boolean, default: true },
        allow_admin_only_messages: { type: Boolean, default: false },
        vanish_mode: { type: Boolean, default: false }, // Messages disappear after 24h
        vanish_mode_duration: { type: Number, default: 24 }, // Hours
        mute_notifications: { type: Boolean, default: false },
        pinned_messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }]
    },
    is_active: { type: Boolean, default: true },
    deleted_at: Date

}, { timestamps: true, minimize: false })

const GroupChat = mongoose.model("GroupChat", groupChatSchema)

export default GroupChat
