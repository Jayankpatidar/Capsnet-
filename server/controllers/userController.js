import mongoose from "mongoose";
import imagekit from "../config/imageKit.js";
import Connection from "../model/Connection.js";
import Post from "../model/Post.js";
import User from "../model/User.js";
import fs from "fs"
import { inngest } from "../innjest/index.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import sendEmail from "../config/nodeMailer.js";


export const getUserData = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('-password'); // Exclude password for security
        if (!user) {
            return res.json({ success: false, message: "User Not Found" })
        }
        res.json({ success: true, user })
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}

export const updateUserData = async (req, res) => {
    try {
        const userId = req.userId;
        let { username, bio, location, full_name, skills, interests, department } = req.body

        const tempUser = await User.findById(userId)


        if (!username) {
            username = tempUser.username;
        }

        if (tempUser.username !== username) {
            const user = await User.findOne({ username })
            if (user) {
                // we will not changes username if is taken
                username = tempUser.username
            }
        }

        const updatedUser = {
            username,
            bio,
            location,
            full_name,
            skills: skills ? (typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : skills) : tempUser.skills,
            interests: interests ? (typeof interests === 'string' ? interests.split(',').map(i => i.trim()) : interests) : tempUser.interests,
            department,
        }

        const profile = req.files?.profile?.[0]
        const cover = req.files?.cover?.[0]

        if (profile) {
            try {
                // Use local path for now, since ImageKit might not be configured
                const filename = profile.filename;
                updatedUser.profile_picture = `/uploads/${filename}`;
            } catch (error) {
                console.warn("Profile upload failed:", error.message);
            }
        }

        if (cover) {
            try {
                // Use local path for now, since ImageKit might not be configured
                const filename = cover.filename;
                updatedUser.cover_photo = `/uploads/${filename}`;
            } catch (error) {
                console.warn("Cover upload failed:", error.message);
            }
        }

        const user = await User.findByIdAndUpdate(userId, updatedUser, { new: true })

        return res.json({ success: true, user, message: "Profile Updated Successfully" })
        // res.json({ success: true, user })
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}

// Find user by name,username,location,email

export const discoverUsers = async (req, res) => {
    try {
        const userId = req.userId;
        const { input } = req.body;

        const allUsers = await User.find(
            {
                $or: [
                    { name: new RegExp(input, "i") },
                    { username: new RegExp(input, "i") },
                    { email: new RegExp(input, "i") },
                    { location: new RegExp(input, "i") },
                ]
            }
        )
        const filteredUsers = allUsers.filter(user => user._id !== userId)
        res.json({ success: true, user: filteredUsers })

    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}

// follow users
export const followUsers = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.body;

        // Validate that user exists
        const user = await User.findById(userId)
        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        // Validate that user to follow exists
        const toUser = await User.findById(id)
        if (!toUser) {
            return res.json({ success: false, message: "User to follow not found" })
        }

        // Check if already following
        if (user.following.includes(id)) {
            return res.json({ success: false, message: "You are already following this user" })
        }

        user.following.push(id)
        await user.save()

        toUser.followers.push(userId)
        await toUser.save()

        res.json({ success: true, message: "Now you are following this user" })

    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}

// Unfollow User 
export const unFollowUsers = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.body;

        // Validate that user exists
        const user = await User.findById(userId)
        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        // Validate that user to unfollow exists
        const toUser = await User.findById(id)
        if (!toUser) {
            return res.json({ success: false, message: "User to unfollow not found" })
        }

        user.following = user.following.filter(userId_item => userId_item.toString() !== id)
        await user.save()

        toUser.followers = toUser.followers.filter(userId_item => userId_item.toString() !== userId)
        await toUser.save()

        res.json({ success: true, message: "You are no longer following this user" })

    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}

export const sendConnectionRequests = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.body;
 
        // Limit to 20 requests in 24 hours
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentRequests = await Connection.find({
            from_user_id: userId,
            createdAt: { $gt: last24Hours }
        });
        if (recentRequests.length >= 20) {
            return res.json({ success: false, message: "You have sent more than 20 connection requests in the last 24 hours" });
        }

        // Check if a connection already exists
        const existingConnection = await Connection.findOne({
            $or: [
                { from_user_id: userId, to_user_id: id },
                { from_user_id: id, to_user_id: userId }
            ]
        });

        if (existingConnection) {
            if (existingConnection.status === "accepted") {
                return res.json({ success: false, message: "You are already connected with this user" });
            } else {
                return res.json({ success: false, message: "Connection request already pending" });
            }
        }

        // Create a new connection request
        const newConnection = await Connection.create({
            from_user_id: userId,
            to_user_id: id,
            status: "pending"
        });

        await inngest.send({
            name: "app/connection-request",
            data: { connectionId: newConnection._id }
        });

        return res.json({ success: true, message: "Connection request sent successfully" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


export const getUserConnections = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).populate("connections followers following")

        const connections = user.connections
        const followers = user.followers
        const following = user.following

        const pendingConnectionsRaw = await Connection.find({
            to_user_id: userId,
            status: "pending"
        }).populate("from_user_id");

        const pendingConnections = pendingConnectionsRaw.map(conn => conn.from_user_id);


        return res.json({ success: true, connections, followers, following, pendingConnections })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}



export const acceptUserConnection = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.body;

        const connection = await Connection.findOne({ from_user_id: id, to_user_id: userId })
        if (!connection) {
            return res.json({ success: false, message: "No connection found" })
        }

        const user = await User.findById(userId);
        const toUser = await User.findById(id);

        if (!user.connections.includes(id)) user.connections.push(id);
        if (!toUser.connections.includes(userId)) toUser.connections.push(userId);

        await user.save();
        await toUser.save();

        // Mark connection as accepted
        connection.status = "accepted";
        await connection.save();


        return res.json({ success: false, message: "Connection accepted successfully" })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// export const getUserProfile = async (req, res) => {
//     try {
//         const { profileId } = req.body;

//         const profile = await User.findById(profileId)

//         if (!profile) {
//             return res.json({ success: false, message: "Profile not found" })
//         }

//         const posts = await Post.find({ user: profile }).populate("user")
//         return res.json({ success: true, profile, posts })


//     } catch (error) {
//         return res.json({ success: false, message: error.message })
//     }
// }

export const getUserProfile = async (req, res) => {
    try {
        // GET /api/user/profiles/:profileId
        const profileId = req.params.profileId;

        if (!profileId) {
            return res.json({ success: false, message: "Profile ID is missing" });
        }

        const profile = await User.findById(profileId).select("-password");

        if (!profile) {
            return res.json({ success: false, message: "Profile not found" });
        }

        // ✅ IMPORTANT: Populate user data in posts AND comments
        const posts = await Post.find({ user: profile._id })
            .populate('user', 'full_name username profile_picture')
            .populate('comments.user', 'full_name username profile_picture')
            .sort({ createdAt: -1 });

        // ✅ Ensure no "Unknown User" in response
        const normalizedPosts = posts.map(post => {
            const postObj = post.toObject();

            // Ensure user is populated
            if (!postObj.user || typeof postObj.user === 'string') {
                postObj.user = {
                    _id: postObj.user || profile._id,
                    full_name: profile.full_name || 'Unknown User',
                    username: profile.username || 'unknown',
                    profile_picture: profile.profile_picture || '/default-avatar.png'
                };
            }

            // Ensure comments have user data
            if (Array.isArray(postObj.comments)) {
                postObj.comments = postObj.comments.map(comment => {
                    if (!comment.user || typeof comment.user === 'string') {
                        comment.user = {
                            _id: comment.user || null,
                            full_name: 'Unknown User',
                            username: 'unknown',
                            profile_picture: '/default-avatar.png'
                        };
                    }
                    return comment;
                });
            }

            return postObj;
        });

        return res.json({
            success: true,
            profile,
            posts: normalizedPosts
        });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.json({ success: false, message: "All fields are required" })
        }

        // Enforce Medicaps domain
        if (!email.endsWith("@medicaps.ac.in")) {
            return res.status(403).json({ success: false, message: "Only Medicaps University email IDs are allowed" })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        // Basic heuristic for faculty emails; admin assignments should be done manually
        let role = "student";
        const lcEmail = email.toLowerCase();
        if (lcEmail.includes("faculty") || lcEmail.includes("prof") || lcEmail.includes("staff")) {
            role = "faculty";
        }

        const user = new User({
            _id: new mongoose.Types.ObjectId().toString(),
            name,
            email,
            password: hashedPassword,
            full_name: name,
            username: email.split('@')[0] + Math.random().toString(36).substr(2, 5),
            role,
            isVerified: false
        })

        await user.save()

        // Create email verification token
        const verifyToken = jwt.sign({ id: user._id, type: 'email_verify' }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '7d' })

        try {
            const serverBase = process.env.SERVER_URL || `${req.protocol}://${req.get('host')}`;
            const verifyLink = `${serverBase}/api/user/verify-email/${verifyToken}`;
            const html = `<p>Hi ${user.full_name},</p><p>Please verify your Medicaps email by clicking <a href="${verifyLink}">here</a>.</p>`;
            await sendEmail(user.email, "Verify your Medicaps email", html);
        } catch (err) {
            console.warn("Failed to send verification email:", err.message);
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '7d' })

        res.json({ success: true, user, token, message: "User registered successfully. Please verify your college email to activate the account." })

    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        if (!token) return res.status(400).json({ success: false, message: 'Invalid token' });

        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
        } catch (err) {
            return res.status(400).json({ success: false, message: 'Token invalid or expired' });
        }

        if (payload.type !== 'email_verify') {
            return res.status(400).json({ success: false, message: 'Invalid token type' });
        }

        const user = await User.findById(payload.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        user.isVerified = true;
        await user.save();

        return res.json({ success: true, message: 'Email verified successfully' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

export const loginUser = async (req, res) => {
    try {
        console.log("🔐 Login attempt for email:", req.body.email);

        const { email, password } = req.body;

        if (!email || !password) {
            console.log("❌ Login failed: Missing email or password");
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ Login failed: User not found for email:", email);
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Enforce Medicaps domain on login as well
        if (!user.email.toLowerCase().endsWith("@medicaps.ac.in")) {
            return res.status(403).json({ success: false, message: "Unauthorized domain" });
        }

        if (!user.isVerified) {
            return res.status(401).json({ success: false, message: "Please verify your college email first" });
        }

        console.log("✅ User found:", user._id, user.email);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Login failed: Invalid password for user:", user._id);
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        console.log("✅ Password matched for user:", user._id);

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'default_secret',
            { expiresIn: "7d" }
        );

        console.log("✅ JWT token generated for user:", user._id);

        // -------------------------
        //  SET JWT IN HTTP-ONLY COOKIE
        // -------------------------
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: false, // true in production
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        console.log("✅ Login successful for user:", user._id);

        return res.json({
            success: true,
            user,
            token,
            message: "Login successful"
        });

    } catch (error) {
        console.error("❌ Login error:", error.message, error.stack);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.userId;
        const currentUser = await User.findById(userId);
        const allUsers = await User.find({ _id: { $ne: userId } });

        const matched = allUsers.map(u => {
            const commonSkills = u.skills.filter(skill => currentUser.skills.some(s => s.name === skill.name));
            const commonInterests = u.interests.filter(interest => currentUser.interests.includes(interest));
            return { ...u._doc, matchScore: commonSkills.length + commonInterests.length };
        });

        const sorted = matched.sort((a, b) => b.matchScore - a.matchScore);
        res.json({ success: true, users: sorted.slice(0, 10) });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Endorse Skill
export const endorseSkill = async (req, res) => {
    try {
        const { userIdToEndorse, skillName } = req.body;
        const me = req.userId;

        const user = await User.findById(userIdToEndorse);
        if (!user) return res.json({ success: false });
        const skill = user.skills.find(s => s.name.toLowerCase() === skillName.toLowerCase());
        if (skill) {
            if (!skill.endorsements.includes(me)) skill.endorsements.push(me);
        } else {
            user.skills.push({ name: skillName, endorsements: [me] });
        }
        await user.save();
        res.json({ success: true, user });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Add Experience
export const addExperience = async (req, res) => {
    try {
        const { company, role, start, end, description } = req.body;
        const user = await User.findById(req.userId);
        user.experience.push({ company, role, start, end, description });
        await user.save();
        res.json({ success: true, experience: user.experience });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Upload Resume
export const uploadResume = async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.json({ success: false, message: 'No file' });
        const url = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
        const user = await User.findByIdAndUpdate(req.userId, { $push: { resumes: { url, uploadedAt: new Date() } } }, { new: true });
        res.json({ success: true, url, user });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Upload Certificate
export const uploadCertificate = async (req, res) => {
    try {
        const { title, issuedBy, date } = req.body;
        const file = req.file;
        if (!file) return res.json({ success: false, message: 'No file' });
        const url = `/uploads/${file.filename}`;
        const user = await User.findByIdAndUpdate(req.userId, { $push: { certificates: { url, title, issuedBy, date } } }, { new: true });
        res.json({ success: true, url, user });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Get Profile View Stats
export const getProfileViewStats = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        res.json({ success: true, profileViews: user.profileViews, postViews: user.postViews });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// 2FA Setup
export const setup2FA = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        // Mock 2FA setup - in real implementation use speakeasy or similar
        user.twoFactorEnabled = true;
        user.twoFactorSecret = 'mock_secret_' + Date.now();
        await user.save();
        res.json({ success: true, secret: user.twoFactorSecret });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Verify 2FA
export const verify2FA = async (req, res) => {
    try {
        const { token } = req.body;
        // Mock verification
        const isValid = token === '123456'; // Mock token
        res.json({ success: true, verified: isValid });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Test endpoint for mobile access verification
export const testEndpoint = async (req, res) => {
    try {
        return res.json({ success: true, message: "Backend is accessible from mobile!", timestamp: new Date().toISOString() });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Add Education
export const addEducation = async (req, res) => {
    try {
        const { institution, degree, field, start_year, end_year, grade } = req.body;
        const user = await User.findById(req.userId);
        user.education.push({ institution, degree, field, start_year, end_year, grade });
        await user.save();
        res.json({ success: true, education: user.education });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Edit Education
export const editEducation = async (req, res) => {
    try {
        const { educationId } = req.params;
        const { institution, degree, field, start_year, end_year, grade } = req.body;
        const user = await User.findById(req.userId);
        const education = user.education.id(educationId);
        if (!education) return res.json({ success: false, message: 'Education not found' });
        education.institution = institution;
        education.degree = degree;
        education.field = field;
        education.start_year = start_year;
        education.end_year = end_year;
        education.grade = grade;
        await user.save();
        res.json({ success: true, education: user.education });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Delete Education
export const deleteEducation = async (req, res) => {
    try {
        const { educationId } = req.params;
        const user = await User.findById(req.userId);
        user.education.pull(educationId);
        await user.save();
        res.json({ success: true, education: user.education });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Edit Experience
export const editExperience = async (req, res) => {
    try {
        const { experienceId } = req.params;
        const { company, role, start, end, description } = req.body;
        const user = await User.findById(req.userId);
        const experience = user.experience.id(experienceId);
        if (!experience) return res.json({ success: false, message: 'Experience not found' });
        experience.company = company;
        experience.role = role;
        experience.start = start;
        experience.end = end;
        experience.description = description;
        await user.save();
        res.json({ success: true, experience: user.experience });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Delete Experience
export const deleteExperience = async (req, res) => {
    try {
        const { experienceId } = req.params;
        const user = await User.findById(req.userId);
        user.experience.pull(experienceId);
        await user.save();
        res.json({ success: true, experience: user.experience });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Toggle Account Type
export const toggleAccountType = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        user.account_type = user.account_type === 'personal' ? 'professional' : 'personal';
        await user.save();
        res.json({ success: true, account_type: user.account_type });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Toggle Privacy
export const togglePrivacy = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        user.is_private = !user.is_private;
        await user.save();
        res.json({ success: true, is_private: user.is_private });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Brute Force Protection - Track failed login attempts
const loginAttempts = new Map();

export const checkBruteForce = (req, res, next) => {
    const ip = req.ip;
    const attempts = loginAttempts.get(ip) || 0;

    if (attempts >= 5) {
        return res.json({ success: false, message: 'Too many failed attempts. Try again later.' });
    }

    next();
}

// Increment failed attempts
export const incrementFailedAttempts = (ip) => {
    const attempts = loginAttempts.get(ip) || 0;
    loginAttempts.set(ip, attempts + 1);

    // Reset after 15 minutes
    setTimeout(() => loginAttempts.delete(ip), 15 * 60 * 1000);
}

// Reject connection request
export const rejectConnectionRequest = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.body;

        const connection = await Connection.findOneAndDelete({
            from_user_id: id,
            to_user_id: userId,
            status: "pending"
        });

        if (!connection) {
            return res.json({ success: false, message: "No pending connection request found" });
        }

        return res.json({ success: true, message: "Connection request rejected" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Remove follower
export const removeFollower = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.body;

        const user = await User.findById(userId);
        const follower = await User.findById(id);

        if (!follower) {
            return res.json({ success: false, message: "User not found" });
        }

        // Remove from user's followers list
        user.followers = user.followers.filter(followerId => followerId.toString() !== id);
        await user.save();

        // Remove from follower's following list
        follower.following = follower.following.filter(followingId => followingId.toString() !== userId);
        await follower.save();

        return res.json({ success: true, message: "Follower removed successfully" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Block user
export const blockUser = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.body;

        const user = await User.findById(userId);
        const targetUser = await User.findById(id);

        if (!targetUser) {
            return res.json({ success: false, message: "User not found" });
        }

        // Add to blocked users if not already blocked
        if (!user.blocked_users.includes(id)) {
            user.blocked_users.push(id);
            await user.save();
        }

        // Remove any existing connections/follows
        user.connections = user.connections.filter(connId => connId.toString() !== id);
        user.followers = user.followers.filter(followerId => followerId.toString() !== id);
        user.following = user.following.filter(followingId => followingId.toString() !== id);
        await user.save();

        targetUser.connections = targetUser.connections.filter(connId => connId.toString() !== userId);
        targetUser.followers = targetUser.followers.filter(followerId => followerId.toString() !== userId);
        targetUser.following = targetUser.following.filter(followingId => followingId.toString() !== userId);
        await targetUser.save();

        // Delete any pending connection requests
        await Connection.findOneAndDelete({
            $or: [
                { from_user_id: userId, to_user_id: id },
                { from_user_id: id, to_user_id: userId }
            ]
        });

        return res.json({ success: true, message: "User blocked successfully" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Unblock user
export const unblockUser = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.body;

        const user = await User.findById(userId);

        // Remove from blocked users
        user.blocked_users = user.blocked_users.filter(blockedId => blockedId.toString() !== id);
        await user.save();

        return res.json({ success: true, message: "User unblocked successfully" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Restrict user (similar to block but less severe)
export const restrictUser = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.body;

        const user = await User.findById(userId);

        // Add to restricted users if not already restricted
        if (!user.restricted_users.includes(id)) {
            user.restricted_users.push(id);
            await user.save();
        }

        return res.json({ success: true, message: "User restricted successfully" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Unrestrict user
export const unrestrictUser = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.body;

        const user = await User.findById(userId);

        // Remove from restricted users
        user.restricted_users = user.restricted_users.filter(restrictedId => restrictedId.toString() !== id);
        await user.save();

        return res.json({ success: true, message: "User unrestricted successfully" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Get mutual connections
export const getMutualConnections = async (req, res) => {
    try {
        const userId = req.userId;
        const { targetUserId } = req.params;

        const user = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);

        if (!targetUser) {
            return res.json({ success: false, message: "User not found" });
        }

        // Find mutual connections
        const mutualConnections = user.connections.filter(connId =>
            targetUser.connections.some(targetConnId => targetConnId.toString() === connId.toString())
        );

        // Populate mutual connections data
        const mutualConnectionsData = await User.find({
            _id: { $in: mutualConnections }
        }).select('full_name username profile_picture');

        return res.json({
            success: true,
            mutualConnections: mutualConnectionsData,
            count: mutualConnectionsData.length
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Follow back (same as follow but for mutual following)
export const followBack = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.body;

        const user = await User.findById(userId);
        const targetUser = await User.findById(id);

        if (!targetUser) {
            return res.json({ success: false, message: "User not found" });
        }

        // Check if target user is following current user
        if (!targetUser.following.includes(userId)) {
            return res.json({ success: false, message: "This user is not following you" });
        }

        // Follow back
        if (!user.following.includes(id)) {
            user.following.push(id);
            await user.save();

            targetUser.followers.push(userId);
            await targetUser.save();
        }

        return res.json({ success: true, message: "Followed back successfully" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};
