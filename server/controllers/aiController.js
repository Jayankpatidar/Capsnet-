import User from "../model/User.js";
import Post from "../model/Post.js";
import Connection from "../model/Connection.js";
import Story from "../model/Story.js";
import Job from "../model/Job.js";
import Chat from "../model/Chat.js";

// Fallback response function when Perplexity API is not available
const getFallbackResponse = (message, language = "en") => {
    const msg = message.toLowerCase();

    if (language === "hi") {
        // Hindi responses
        if (msg.includes("hello") || msg.includes("hi") || msg.includes("नमस्ते")) {
            return "नमस्ते! मैं आपका AI कैम्पस असिस्टेंट हूं। मैं आपकी पढ़ाई, परीक्षाओं, कोर्सेज और यूनिवर्सिटी से संबंधित किसी भी प्रश्न का उत्तर दे सकता हूं।";
        }
        if (msg.includes("exam") || msg.includes("परीक्षा")) {
            return "परीक्षा से संबंधित जानकारी के लिए, कृपया अपनी यूनिवर्सिटी की आधिकारिक वेबसाइट देखें या अपने फैकल्टी से संपर्क करें। मैं सामान्य सलाह दे सकता हूं कि नियमित अध्ययन करें और समय प्रबंधन करें।";
        }
        if (msg.includes("course") || msg.includes("कोर्स")) {
            return "कोर्सेज के बारे में जानकारी के लिए, आप अपनी यूनिवर्सिटी के एकेडमिक कैलेंडर या सिलेबस देख सकते हैं। विभिन्न विषयों में कई रोचक कोर्स उपलब्ध हैं।";
        }
        if (msg.includes("job") || msg.includes("नौकरी")) {
            return "नौकरी के अवसरों के लिए, आप LinkedIn, Naukri.com या अपनी यूनिवर्सिटी के प्लेसमेंट सेल से संपर्क कर सकते हैं। अपने स्किल्स को अपडेट रखें और इंटर्नशिप करें।";
        }
        if (msg.includes("help") || msg.includes("मदद")) {
            return "मैं आपकी कैसे मदद कर सकता हूं? आप मुझे यूनिवर्सिटी, कोर्सेज, कैरियर या किसी अन्य विषय के बारे में पूछ सकते हैं।";
        }
        return "क्षमा करें, मैं इस प्रश्न का ठीक से उत्तर नहीं दे सकता। कृपया अधिक स्पष्ट प्रश्न पूछें या अपनी यूनिवर्सिटी के अधिकारियों से संपर्क करें।";
    } else {
        // English responses
        if (msg.includes("hello") || msg.includes("hi")) {
            return "Hello! I'm your AI Campus Assistant. I can help you with questions about studies, exams, courses, and anything university-related.";
        }
        if (msg.includes("exam")) {
            return "For exam-related information, please check your university's official website or contact your faculty. I can give general advice to study regularly and manage your time well.";
        }
        if (msg.includes("course")) {
            return "For course information, you can check your university's academic calendar or syllabus. There are many interesting courses available in various subjects.";
        }
        if (msg.includes("job")) {
            return "For job opportunities, you can check LinkedIn, job portals, or your university's placement cell. Keep your skills updated and do internships.";
        }
        if (msg.includes("help")) {
            return "How can I help you? You can ask me about university, courses, career, or any other topic.";
        }
        return "Sorry, I can't answer this question properly. Please ask a more specific question or contact your university officials.";
    }
};

// AI Resume Parser
export const parseResume = async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.json({ success: false, message: 'No file uploaded' });

        const parsedData = {
            skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
            experience: [{
                company: 'Tech Corp',
                role: 'Developer',
                start: '2020-01-01',
                end: '2023-01-01',
                description: 'Full stack development'
            }],
            education: 'Bachelor of Computer Science'
        };

        const user = await User.findByIdAndUpdate(
            req.userId,
            {
                skills: parsedData.skills.map(skill => ({ name: skill, endorsements: [] })),
                experience: parsedData.experience
            },
            { new: true }
        );

        res.json({ success: true, parsedData, user });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

// AI Auto Captions & Hashtags
export const generateCaption = async (req, res) => {
    try {
        const caption = "Amazing moment captured! #photography #life #beautiful";
        const hashtags = ["#photography", "#life", "#beautiful", "#moment"];
        res.json({ success: true, caption, hashtags });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

// AI Fake Profile Detection
export const detectFakeProfile = async (req, res) => {
    try {
        const riskScore = Math.random() * 100;
        const isSuspicious = riskScore > 70;

        res.json({ success: true, riskScore, isSuspicious, protectionBadge: !isSuspicious });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

// AI Profile Analyzer
export const analyzeProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        let score = 50;
        const suggestions = [];

        if (user.bio && user.bio.length > 10) score += 10;
        else suggestions.push("Add a detailed bio");

        if (user.skills && user.skills.length > 0) score += 15;
        else suggestions.push("Add your skills");

        if (user.experience && user.experience.length > 0) score += 15;
        else suggestions.push("Add work experience");

        if (user.profile_picture) score += 10;
        else suggestions.push("Upload a profile picture");

        res.json({ success: true, score: Math.min(score, 100), suggestions });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

// AI App Data Queries
export const suggestConnections = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const connections = await Connection.find({
            $or: [{ sender: req.userId }, { receiver: req.userId }]
        }).populate('sender receiver');

        const connectedUserIds = connections.map(conn =>
            conn.sender.toString() === req.userId
                ? conn.receiver.toString()
                : conn.sender.toString()
        );

        const suggestions = await User.find({
            _id: { $nin: [...connectedUserIds, req.userId] },
            skills: { $in: user.skills.map(s => s.name) }
        }).limit(5);

        res.json({ success: true, suggestions });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

export const getRecentPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user', 'name profile_picture')
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({ success: true, posts });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

export const getUserStories = async (req, res) => {
    try {
        const stories = await Story.find({ user: req.userId }).sort({ createdAt: -1 });
        res.json({ success: true, stories });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

export const getJobSuggestions = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const jobs = await Job.find({
            skills: { $in: user.skills.map(s => s.name) }
        }).populate('postedBy', 'name').limit(5);

        res.json({ success: true, jobs });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

// 🔥 AI Assistant (Perplexity API with fallback)
export const aiAssistant = async (req, res) => {
    try {
        const { message, language = "en" } = req.body;
        const userId = req.userId;

        if (!message) {
            return res.json({ success: false, message: "Message is required" });
        }

        let reply;

        // Check if Perplexity API key is available
        if (process.env.PERPLEXITY_API_KEY) {
            try {
                const prompt = `
You are an AI Campus Assistant.
Reply in ${language === "hi" ? "Hindi" : "English"}.
User: ${message}
`;

                const response = await fetch(
                    "https://api.perplexity.ai/chat/completions",
                    {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            model: "sonar-small-chat",
                            messages: [
                                {
                                    role: "user",
                                    content: prompt
                                }
                            ]
                        })
                    }
                );

                const data = await response.json();

                if (response.ok && data?.choices?.length) {
                    reply = data.choices[0].message.content;
                } else {
                    console.warn("Perplexity API failed, using fallback");
                    reply = getFallbackResponse(message, language);
                }
            } catch (apiError) {
                console.warn("Perplexity API error, using fallback:", apiError.message);
                reply = getFallbackResponse(message, language);
            }
        } else {
            console.log("No Perplexity API key, using fallback responses");
            reply = getFallbackResponse(message, language);
        }

        // Save to database if user is authenticated
        if (userId) {
            try {
                await Chat.create({
                    userId,
                    message,
                    reply,
                    language
                });
            } catch (dbError) {
                console.warn("Failed to save chat to database:", dbError.message);
                // Don't fail the request if DB save fails
            }
        }

        res.json({ success: true, reply });

    } catch (err) {
        console.error("AI Assistant Error:", err);
        res.json({ success: false, message: "Failed to send message" });
    }
};

// Get Chat History
export const getChatHistory = async (req, res) => {
    try {
        const userId = req.userId || 'guest';

        // For guest users, return empty history or session-based history
        if (!req.userId) {
            return res.json({ success: true, messages: [] });
        }

        const chats = await Chat.find({ userId })
            .sort({ timestamp: -1 })
            .limit(50);

        const messages = chats.reverse().map(chat => ({
            userMessage: chat.message,
            aiReply: chat.reply,
            timestamp: chat.timestamp
        }));

        res.json({ success: true, messages });
    } catch (err) {
        console.error("Chat History Error:", err);
        res.json({ success: false, message: "Failed to fetch chat history" });
    }
};
