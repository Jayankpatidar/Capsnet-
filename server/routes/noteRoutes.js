import express from "express"
import { protect } from "../middlewares/auth.js";
import {
    createNote,
    getUserNotes,
    deleteNote
} from "../controllers/noteController.js";

const noteRouter = express.Router();

// Create Note
noteRouter.post("/create", protect, createNote);

// Get User's Notes
noteRouter.get("/my-notes", protect, getUserNotes);

// Delete Note
noteRouter.delete("/:note_id", protect, deleteNote);

export default noteRouter
