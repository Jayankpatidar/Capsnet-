import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },

  full_name: { type: String, required: true },
  username: { type: String, required: true },

  bio: { type: String, default: "Hey there I am using Capsnet." },
  professional_headline: { type: String, default: "" },
  profile_picture: { type: String, default: "" },
  cover_photo: { type: String, default: "" },
  location: { type: String, default: "" },
  account_type: { type: String, default: "personal" }, // personal or professional
  is_private: { type: Boolean, default: false },
  avatar_data: { type: String, default: "" }, // base64 encoded avatar

  followers: [{ type: String, ref: "User" }],
  following: [{ type: String, ref: "User" }],
  connections: [{ type: String, ref: "User" }],

  skills: [{ name: String, endorsements: [{ type: String }] }], // endorsements store userIds
  experience: [
    {
      company: String,
      role: String,
      start: Date,
      end: Date,
      description: String
    }
  ],
  education: [
    {
      institution: String,
      degree: String,
      field: String,
      start_year: String,
      end_year: String,
      grade: String
    }
  ],
  resumes: [{ url: String, uploadedAt: Date }],
  certificates: [{ url: String, title: String, issuedBy: String, date: Date }],
  badges: [{ type: String }], // strings like "all-star", "newbie"
  savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  profileViews: { type: Number, default: 0 },
  postViews: { type: Number, default: 0 },
  profile_strength: { type: Number, default: 0 }, // percentage of profile completion
  interests: [{ type: String }],
  department: { type: String, default: "" },
  major: { type: String, default: "" },
  year: { type: String, default: "" }, // e.g., freshman, sophomore, junior, senior
  courses: [{ type: String }],
  role: { type: String, default: "student" }, // student, faculty, admin
  isVerified: { type: Boolean, default: false },
  language: { type: String, default: "en" }, // preferred language: en, hi
  schedule: [{ type: Object }], // array of schedule objects, e.g., { day: 'Monday', time: '10:00', course: 'CS101' }
},
{ timestamps: true, minimize: false });

const User = mongoose.model("User", userSchema);

export default User;
