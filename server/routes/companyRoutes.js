import express from "express";
import {
  createCompany,
  updateCompany,
  getCompanyProfile,
  getMyCompany,
  followCompany,
  addTeamMember,
  removeTeamMember,
  createCompanyPost,
  getCompanyAnalytics,
  searchCompanies,
  getSuggestedCompanies
} from "../controllers/companyController.js";
import { protect } from "../middlewares/auth.js";
import { upload } from "../config/multer.js";

const router = express.Router();

// All company routes require authentication
router.use(protect);

// Company CRUD
router.post("/create", upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'cover_image', maxCount: 1 }
]), createCompany);

router.put("/update/:companyId", upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'cover_image', maxCount: 1 }
]), updateCompany);

// Company Profile
router.get("/profile/:companyId", getCompanyProfile);
router.get("/my-company", getMyCompany);

// Company Interactions
router.post("/follow", followCompany);

// Team Management
router.post("/add-team-member", addTeamMember);
router.post("/remove-team-member", removeTeamMember);

// Company Posts
router.post("/post", createCompanyPost);

// Analytics
router.get("/analytics/:companyId", getCompanyAnalytics);

// Search and Discovery
router.get("/search", searchCompanies);
router.get("/suggested", getSuggestedCompanies);

export default router;
