// ✅ Asset imports
import logo from "./logo.svg";
import sample_cover from "./sample_cover.jpg";
import sample_profile from "./sample_profile.jpg";
import bgImage from "./bgImage.png";
import group_users from "./group_users.png";
import sponsored_img from "./sponsored_img.png";

// ✅ Import valid Lucide icons (no undefined or invalid icons)
import {
  Home,
  MessageCircle,
  MessageSquare,
  Search,
  User,
  Users,
  Share2,
  BarChart3,
  Briefcase,
  Play,
  Bell,
  Plus,
  Bot,
  Settings,
  Zap,
  Shield,
  Brain,
  Building2,
} from "lucide-react";

// ✅ Exported static assets
export const assets = {
  logo,
  sample_cover,
  sample_profile,
  bgImage,
  group_users,
  sponsored_img,
};

// ✅ LinkedIn-style menu configuration (safe, valid React icons)

export const menuItemsData = [

  { to: "/", label: "Home", Icon: Home },

  { to: "/message", label: "Messages", Icon: MessageSquare },

  { to: "/connections", label: "Connections", Icon: Users },

  { to: "/jobs-home", label: "Jobs Home", Icon: Briefcase },

  { to: "/jobs", label: "Jobs", Icon: Briefcase },

  { to: "/reels", label: "Reels", Icon: Play },

  { to: "/notifications", label: "Notifications", Icon: Bell },

  { to: "/search", label: "Search", Icon: Search },

  { to: "/profile", label: "Profile", Icon: User },

  { to: "/settings", label: "Settings", Icon: Settings },

  { to: "/professional-dashboard", label: "Dashboard", Icon: BarChart3 },

  { to: "/create-post", label: "Create Post", Icon: Plus },

  { to: "/skill-connect", label: "Skill Connect", Icon: Zap },

  { to: "/companies", label: "Companies", Icon: Building2 },

  { to: "/company/create", label: "Create Company", Icon: Building2 },

  { to: "/admin-dashboard", label: "Admin", Icon: Shield, adminOnly: true },

  { to: "/ai-dashboard", label: "AI Dashboard", Icon: Brain },

];

// ✅ Dummy user data
export const dummyUserData = {
  _id: "user_2zdFoZib5lNr614LgkONdD8WG32",
  email: "admin@example.com",
  full_name: "John Warren",
  username: "john_warren",
  bio: "🌍 Dreamer | 📚 Learner | 🚀 Doer\nExploring life one step at a time.\n✨ Staying curious. Creating with purpose.",
  profile_picture: sample_profile,
  cover_photo: sample_cover,
  location: "New York, NY",
  followers: ["user_2", "user_3"],
  following: ["user_2", "user_3"],
  connections: ["user_2", "user_3"],
  posts: [],
  is_verified: true,
  createdAt: "2025-07-09T09:26:59.231Z",
  updatedAt: "2025-07-21T06:56:50.017Z",
};

// ✅ Additional dummy users
const dummyUser2Data = {
  ...dummyUserData,
  _id: "user_2",
  username: "Richard Hendricks",
  full_name: "Richard Hendricks",
  profile_picture:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
};

const dummyUser3Data = {
  ...dummyUserData,
  _id: "user_3",
  username: "alexa_james",
  full_name: "Alexa James",
  profile_picture:
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
};

// ✅ Dummy stories data
export const dummyStoriesData = [
  {
    _id: "68833d466e4b42b685068860",
    user: dummyUserData,
    content:
      "📌 This isn't the story I wanted to tell… not yet. But if you're reading this, know that something interesting is in motion 🔄.",
    media_url: "",
    media_type: "text",
    background_color: "#4f46e5",
    createdAt: "2025-08-15T02:16:06.958Z",
    updatedAt: "2025-07-25T08:16:06.958Z",
  },
  {
    _id: "688340046e4b42b685068a73",
    user: dummyUserData,
    content: "",
    media_url:
      "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
    media_type: "image",
    background_color: "#4f46e5",
    createdAt: "2025-07-25T08:27:48.134Z",
    updatedAt: "2025-07-25T08:27:48.134Z",
  },
];

// ✅ Dummy posts data
export const dummyPostsData = [
  {
    _id: "68773e977db16954a783839c",
    user: dummyUserData,
    content:
      "We're a small #team with a big vision — working day and night to turn dreams into products.",
    image_urls: [
      "https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg",
    ],
    post_type: "text_with_image",
    likes_count: [],
    createdAt: "2025-07-16T05:54:31.191Z",
    updatedAt: "2025-07-16T05:54:31.191Z",
  },
];

// ✅ Dummy message data
export const dummyRecentMessagesData = [
  {
    _id: "68833af618623d2de81b5381",
    from_user_id: dummyUser2Data,
    to_user_id: dummyUserData,
    text: "I saw your profile 👀",
    message_type: "text",
    media_url: "",
    seen: true,
    createdAt: "2025-07-25T08:06:14.436Z",
    updatedAt: "2025-07-25T08:47:47.768Z",
  },
];

// ✅ Dummy connection/follow data
export const dummyConnectionsData = [
  dummyUserData,
  dummyUser2Data,
  dummyUser3Data,
];

export const dummyFollowersData = [dummyUser2Data, dummyUser3Data];
export const dummyFollowingData = [dummyUser2Data, dummyUser3Data];
export const dummyPendingConnectionsData = [dummyUserData];
