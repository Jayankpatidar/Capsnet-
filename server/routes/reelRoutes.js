import express from "express";
import { protect } from "../middlewares/auth.js";
import { getReelsForYou, likeReel, uploadReel, addReel, createReelWithFeatures, getReelAnalytics, incrementView, addComment, shareReel } from "../controllers/reelController.js";
import { upload, uploadReel as uploadReelMulter } from "../config/multer.js";

const reelRouter = express.Router();

reelRouter.get("/for-you", getReelsForYou);
reelRouter.post("/like", protect, likeReel);
reelRouter.post("/upload", protect, upload.array("files", 1), uploadReel);
reelRouter.post("/add", protect, uploadReelMulter.single("video"), addReel);
reelRouter.post("/create-with-features", protect, uploadReelMulter.single("video"), createReelWithFeatures);
reelRouter.get("/analytics/:reelId", protect, getReelAnalytics);
reelRouter.post("/view", protect, incrementView);
reelRouter.post("/comment", protect, addComment);
reelRouter.post("/share", protect, shareReel);

export default reelRouter;
