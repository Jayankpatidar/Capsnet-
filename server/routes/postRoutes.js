import express from "express"
import { protect } from "../middlewares/auth.js"
import { addPosts, getFeedPosts, likePost, toggleLikePost, savePost, getSponsoredPosts, addComment } from "../controllers/postController.js"
import { upload } from "../config/multer.js"

const postRouter = express.Router()

postRouter.post("/add", protect , upload.array("files",10) ,addPosts) // Allow multiple file types
postRouter.post("/like", protect , likePost)
postRouter.get("/feed", protect , getFeedPosts)
postRouter.post("/toggle-like", protect, toggleLikePost)
postRouter.post("/save", protect, savePost)
postRouter.post("/comment", protect, addComment)
postRouter.get("/sponsored", protect, getSponsoredPosts)

export default postRouter
