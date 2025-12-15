import express from "express";
import { protect } from "../middlewares/auth.js";
import { upload } from "../config/multer.js";
import {
    postJob,
    getJobs,
    getJobDetails,
    applyJob,
    saveJob,
    getSavedJobs,
    getAppliedJobs,
    withdrawApplication,
    getMyJobs,
    updateJobStatus,
    updateApplicationStatus,
    getRecommendedJobs,
    getSalaryInsights,
    getInterviewQuestions
} from "../controllers/jobController.js";

const jobRouter = express.Router();

// Job CRUD
jobRouter.post("/post", protect, postJob);
jobRouter.get("/list", protect, getJobs);
jobRouter.get("/:jobId", protect, getJobDetails);
jobRouter.put("/:jobId/status", protect, updateJobStatus);

// Job Applications
jobRouter.post("/apply", protect, upload.single("resume"), applyJob);
jobRouter.post("/save", protect, saveJob);
jobRouter.get("/saved", protect, getSavedJobs);
jobRouter.get("/applied", protect, getAppliedJobs);
jobRouter.post("/withdraw", protect, withdrawApplication);

// My Jobs (for employers)
jobRouter.get("/my-jobs", protect, getMyJobs);
jobRouter.put("/application/status", protect, updateApplicationStatus);

// Recommendations and Insights
jobRouter.get("/recommended", protect, getRecommendedJobs);
jobRouter.get("/salary-insights", protect, getSalaryInsights);

// Interview
jobRouter.get("/interview/:jobId", protect, getInterviewQuestions);

export default jobRouter;
