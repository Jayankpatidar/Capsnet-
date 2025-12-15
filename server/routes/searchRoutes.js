import express from "express";
import {
  searchUsers,
  searchPosts,
  searchJobs,
  searchCompanies,
  searchReels,
  searchHashtags,
  searchByLocation,
  searchBySkills,
  searchAudioMusic,
  globalAdvancedSearch
} from "../controllers/searchController.js";

const router = express.Router();

// User search
router.get("/users", searchUsers);

// Post search
router.get("/posts", searchPosts);

// Job search
router.get("/jobs", searchJobs);

// Company search
router.get("/companies", searchCompanies);

// Reel search
router.get("/reels", searchReels);

// Hashtag search
router.get("/hashtags", searchHashtags);

// Location-based search
router.get("/location", searchByLocation);

// Skills-based search
router.get("/skills", searchBySkills);

// Audio/music search
router.get("/audio-music", searchAudioMusic);

// Global advanced search
router.get("/global", globalAdvancedSearch);

export default router;
