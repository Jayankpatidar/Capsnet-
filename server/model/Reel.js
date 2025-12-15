import mongoose from "mongoose";

const ReelSchema = new mongoose.Schema({
  user: { type: String, ref: 'User' },
  mediaUrl: String,
  video_url: String, // Added for backward compatibility
  caption: String,
  content: String, // Added for backward compatibility
  likes: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  musicUrl: String, // URL for background music
  music_url: String, // Added for backward compatibility
  effects: [{ type: String }], // Array of applied effects/filters
  template: String, // Template used (e.g., 'funny', 'dance')
  voiceoverUrl: String, // URL for voiceover audio
  voiceover_url: String, // Added for backward compatibility
  captions: String, // Auto-generated or manual captions
  remix: { type: Boolean, default: false }, // If it's a remix
  greenScreen: { type: Boolean, default: false }, // If green screen was used
  hashtags: [{ type: String }], // Added hashtags field
  location: String, // Added location field
  comments: [{
    user: { type: String, ref: 'User' },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  analytics: {
    totalViews: { type: Number, default: 0 },
    engagementRate: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  },
  volume: { type: Boolean, default: true } // true means not muted, false means muted
});

const Reel = mongoose.model("Reel", ReelSchema);

export default Reel;
