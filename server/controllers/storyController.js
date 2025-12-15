import fs from "fs"
import imagekit from "../config/imageKit.js";
import Story from "../model/Story.js";
import User from "../model/User.js";
import { inngest } from "../innjest/index.js";

// addStory
export const addUserStory = async (req, res) => {
    try {
        const userId = req.userId;

        const {
            content,
            media_type,
            background_color,
            music_url,
            music_title,
            poll_options,
            quiz_options,
            qna_enabled,
            gif_url,
            sticker_url,
            swipe_link,
            swipe_link_text,
            close_friends_only
        } = req.body

        const media = req.file
        let media_url = ""

        if (media_type === "image" || media_type === "video") {
            if (imagekit) {
                if (media) {
                    const fileBuffer = fs.readFileSync(media.path)
                    const response = await imagekit.upload({
                        file: fileBuffer,
                        fileName: media.originalname
                    })
                    media_url = response.url
                } else {
                    console.warn("No media file provided for story");
                }
            } else {
                if (media) {
                    media_url = `/uploads/stories/${media.filename}`
                } else {
                    console.warn("No media file provided for story");
                }
            }
        }

        // Process poll options
        let processedPollOptions = []
        if (poll_options) {
            const parsedPollOptions = typeof poll_options === 'string' ? JSON.parse(poll_options) : poll_options;
            if (Array.isArray(parsedPollOptions)) {
                processedPollOptions = parsedPollOptions
                    .map(option => ({
                        text: option.text || option,
                        votes: [],
                        count: 0
                    }))
                    .filter(option => option.text && option.text.trim() !== '') // Filter out empty options
            }
        }

        // Process quiz options
        let processedQuizOptions = []
        if (quiz_options) {
            const parsedQuizOptions = typeof quiz_options === 'string' ? JSON.parse(quiz_options) : quiz_options;
            if (Array.isArray(parsedQuizOptions)) {
                processedQuizOptions = parsedQuizOptions.map(q => ({
                    question: q.question,
                    answers: q.answers.map(a => ({
                        text: a.text,
                        is_correct: a.is_correct || false
                    })),
                    user_answer: null
                }))
            }
        }

        const story = await Story.create({
            user: userId,
            content,
            media_url,
            media_type,
            background_color,
            music_url,
            music_title,
            poll_options: processedPollOptions,
            quiz_options: processedQuizOptions,
            qna_enabled: qna_enabled || false,
            gif_url,
            sticker_url,
            swipe_link,
            swipe_link_text,
            close_friends_only: close_friends_only || false
        })

        await inngest.send({
            name : "app/story.delete",
            data : {storyId : story._id}
        })

        res.json({ success: true , message: "Story created successfully" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
// getStory
export const getStories = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        const userIds = [
            user._id,
            ...user.connections,
            ...user.following
        ];

        // Get all stories from connections/following, including user's own stories
        const allStories = await Story.find({
            user: { $in: userIds }
        })
        .populate("user")
        .sort({ created_at: -1 });

        // Filter out close friends only stories that user is not allowed to see
        const filteredStories = allStories.filter(story => {
            if (story.close_friends_only) {
                // Check if current user is in the story creator's close friends
                return story.user.closeFriends && story.user.closeFriends.includes(userId);
            }
            return true;
        });

        res.json({ success: true, stories: filteredStories });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message });
    }
};

// Add Story with expiry and highlights
export const addStory = async (req, res) => {
    try {
        const file = req.file;
        const url = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const { highlight, background_color } = req.body;
        const story = await Story.create({
            user: req.userId,
            media_url: url,
            media_type: req.body.type || 'image',
            expiresAt,
            highlight: highlight || null,
            background_color
        });
        res.json({ success: true, story });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Get Story Highlights
export const getHighlights = async (req, res) => {
    try {
        const highlights = await Story.aggregate([
            { $match: { highlight: { $ne: null } } },
            { $group: { _id: "$highlight", stories: { $push: "$$ROOT" }, count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        res.json({ success: true, highlights });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Record Viewer
export const recordViewer = async (req, res) => {
    try {
        const { storyId } = req.body;
        const story = await Story.findById(storyId);
        if (!story.viewers.includes(req.userId)) story.viewers.push(req.userId);
        await story.save();
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Delete Story
export const deleteStory = async (req, res) => {
    try {
        const { storyId } = req.params;
        const story = await Story.findById(storyId);
        if (!story) {
            return res.json({ success: false, message: "Story not found" });
        }
        if (story.user.toString() !== req.userId) {
            return res.json({ success: false, message: "Unauthorized" });
        }
        await Story.findByIdAndDelete(storyId);
        res.json({ success: true, message: "Story deleted successfully" });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Vote on Poll
export const voteOnPoll = async (req, res) => {
    try {
        const { storyId, optionIndex } = req.body;
        const story = await Story.findById(storyId);
        if (!story) {
            return res.json({ success: false, message: "Story not found" });
        }
        if (!story.poll_options || !story.poll_options[optionIndex]) {
            return res.json({ success: false, message: "Invalid poll option" });
        }
        const userId = req.userId;
        const option = story.poll_options[optionIndex];
        if (option.votes.includes(userId)) {
            return res.json({ success: false, message: "Already voted" });
        }
        option.votes.push(userId);
        option.count += 1;
        await story.save();
        res.json({ success: true, message: "Vote recorded" });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Submit QnA Response
export const submitQnaResponse = async (req, res) => {
    try {
        const { storyId, response } = req.body;
        const story = await Story.findById(storyId);
        if (!story) {
            return res.json({ success: false, message: "Story not found" });
        }
        if (!story.qna_enabled) {
            return res.json({ success: false, message: "QnA not enabled for this story" });
        }
        const qnaResponse = {
            user: req.userId,
            response,
            created_at: new Date()
        };
        story.qna_responses.push(qnaResponse);
        await story.save();
        res.json({ success: true, message: "Response submitted" });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Answer Quiz
export const answerQuiz = async (req, res) => {
    try {
        const { storyId, questionIndex, answerIndex } = req.body;
        const story = await Story.findById(storyId);
        if (!story) {
            return res.json({ success: false, message: "Story not found" });
        }
        if (!story.quiz_options || !story.quiz_options[questionIndex]) {
            return res.json({ success: false, message: "Invalid quiz question" });
        }
        const question = story.quiz_options[questionIndex];
        if (!question.answers || !question.answers[answerIndex]) {
            return res.json({ success: false, message: "Invalid answer" });
        }
        question.user_answer = answerIndex;
        await story.save();
        const isCorrect = question.answers[answerIndex].is_correct;
        res.json({ success: true, isCorrect });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}
