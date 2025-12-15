import mongoose from "mongoose"

const videoCallSchema = new mongoose.Schema({

    call_id: { type: String, required: true, unique: true }, // Unique call identifier
    initiator: { type: String, ref: "User", required: true }, // Who started the call
    participants: [{
        user: { type: String, ref: "User", required: true },
        joined_at: Date,
        left_at: Date,
        status: { type: String, enum: ["invited", "ringing", "joined", "declined", "missed"], default: "invited" }
    }],
    call_type: { type: String, enum: ["audio", "video"], default: "video" },
    status: { type: String, enum: ["ringing", "ongoing", "ended", "missed", "declined"], default: "ringing" },
    started_at: Date,
    ended_at: Date,
    duration: { type: Number, default: 0 }, // Duration in seconds
    is_group_call: { type: Boolean, default: false },
    group_id: { type: mongoose.Schema.Types.ObjectId, ref: "GroupChat" }, // For group calls
    recording_url: String, // If call was recorded
    chat_messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }], // Messages sent during call
    settings: {
        allow_recording: { type: Boolean, default: false },
        allow_screenshots: { type: Boolean, default: true },
        background_blur: { type: Boolean, default: false },
        virtual_background: String
    },
    quality: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    created_at: { type: Date, default: Date.now }

}, { minimize: false })

const VideoCall = mongoose.model("VideoCall", videoCallSchema)

export default VideoCall
