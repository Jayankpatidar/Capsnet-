import express from "express"
import { protect } from "../middlewares/auth.js";
import { addUserStory, getStories, addStory, recordViewer, getHighlights, deleteStory, voteOnPoll, submitQnaResponse, answerQuiz } from "../controllers/storyController.js";
import { upload, uploadStory } from "../config/multer.js";

const storyRouter = express.Router();

storyRouter.post("/create", protect, uploadStory.single("media"), addUserStory)
storyRouter.get("/get", protect, getStories)
storyRouter.post("/add", protect, upload.single("media"), addStory)
storyRouter.post("/view", protect, recordViewer)
storyRouter.get("/highlights", protect, getHighlights)
storyRouter.delete("/:storyId", protect, deleteStory)
storyRouter.post("/poll/vote", protect, voteOnPoll)
storyRouter.post("/qna/submit", protect, submitQnaResponse)
storyRouter.post("/quiz/answer", protect, answerQuiz)

export default storyRouter
