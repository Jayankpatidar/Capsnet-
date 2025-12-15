import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  industry: { type: String, required: true },
  website: { type: String },
  location: { type: String, required: true },
  logo: { type: String, default: "" },
  cover_image: { type: String, default: "" },
  founded_year: { type: Number },
  company_size: { type: String, enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'] },
  mission: { type: String },
  vision: { type: String },
  values: [{ type: String }],

  // Company owner/admin
  owner_id: { type: String, ref: "User", required: true },

  // Team members
  team_members: [{
    user_id: { type: String, ref: "User" },
    role: { type: String, required: true },
    joined_at: { type: Date, default: Date.now }
  }],

  // Followers
  followers: [{ type: String, ref: "User" }],
  follower_count: { type: Number, default: 0 },

  // Company posts/updates
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],

  // Jobs posted by company
  jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],

  // Analytics
  profile_views: { type: Number, default: 0 },
  post_views: { type: Number, default: 0 },
  job_views: { type: Number, default: 0 },

  // Verification status
  is_verified: { type: Boolean, default: false },
  verification_documents: [{ type: String }],

  // Contact information
  contact_email: { type: String },
  contact_phone: { type: String },

  // Social media links
  social_links: {
    linkedin: { type: String },
    twitter: { type: String },
    facebook: { type: String },
    instagram: { type: String }
  },

  // Company culture/gallery
  culture_images: [{ type: String }],
  office_images: [{ type: String }],

  // Settings
  is_private: { type: Boolean, default: false },
  allow_job_applications: { type: Boolean, default: true }
}, { timestamps: true });

const Company = mongoose.model("Company", companySchema);

export default Company;
