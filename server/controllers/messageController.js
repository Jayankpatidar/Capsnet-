import fs from "fs"
import imagekit from "../config/imageKit.js"
import Message from "../model/Message.js"
// create an empty object to store SSE connections
const connection = {}

export const sseController = async (req, res) => {
    try {
        const { userId } = req.params
        
        // Validate userId
        if (!userId || userId === 'undefined') {
            return res.status(400).json({ success: false, message: "Valid userId is required" })
        }

        // ✅ Proper SSE headers
        res.setHeader("Content-Type", "text/event-stream")
        res.setHeader("Cache-Control", "no-cache")
        res.setHeader("Connection", "keep-alive")
        res.setHeader("Access-Control-Allow-Origin", "*")

        // ✅ flush headers (some proxies require this)
        if (res.flushHeaders) res.flushHeaders()

        // ✅ Save connection
        connection[userId] = res

        // ✅ Initial handshake message
        res.write(`event: log\n`)
        res.write(`data: Connected to SSE stream for user ${userId}\n\n`)

        // ✅ Heartbeat (every 30s) to prevent timeouts
        const heartbeat = setInterval(() => {
            if (connection[userId]) {
                res.write(`event: ping\n`)
                res.write(`data: keep-alive\n\n`)
            }
        }, 30000)

        // ✅ Handle disconnect
        req.on("close", () => {
            clearInterval(heartbeat)
            delete connection[userId]
            // console.log(`Client Disconnected: ${userId}`)
        })

    } catch (error) {
        console.error("SSE Error:", error.message)
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: error.message })
        }
    }
}

export const sendMessage = async (req, res) => {
    try {
        const userId = req.userId
        const { to_user_id, text } = req.body
        const image = req.file

        let media_url = ""
        let message_type = image ? "image" : "text"

        if (message_type === "image") {
            if (imagekit) {
                const buffer = fs.readFileSync(image.path)
                const response = await imagekit.upload({
                    file: buffer,
                    fileName: image.originalname,
                })

                media_url = imagekit.url({
                    path: response.filePath,
                    transformation: [
                        { quality: "auto" },
                        { format: "webp" },
                        { height: "1280" },
                    ]
                })
            } else {
                console.warn("ImageKit not configured, skipping image upload for message");
            }
        }

        const message = await Message.create({
            from_user_id: userId,
            to_user_id,
            text,
            message_type,
            media_url
        })

        // ✅ Populate sender details for frontend use
        const messageWithUserData = await Message.findById(message._id)
            .populate("from_user_id", "full_name profile_picture") // select only needed fields

        // ✅ Send HTTP response
        res.json({ success: true, message: messageWithUserData })

        // ✅ Push to recipient via SSE
        if (connection[to_user_id]) {
            console.log(connection[to_user_id])
            connection[to_user_id].write(`event: message\n`)
            connection[to_user_id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`)
        }

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}


export const getChatMessages = async (req, res) => {
    try {

        const userId = req.userId
        const { to_user_id } = req.body;


        const messages = await Message.find({
            $or: [
                { from_user_id: userId, to_user_id: to_user_id },
                { from_user_id: to_user_id, to_user_id: userId },
            ]
        }).sort({ created_at: -1 })

        await Message.updateMany({ from_user_id: to_user_id, to_user_id: userId }, { seen: true })


        res.json({ success: true, messages })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export const getRecentMessages = async (req, res) => {
    try {

        const userId = req.userId
        
        // Validate userId exists
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID not found in request" })
        }

        const messages = await Message.find({ to_user_id: userId })
            .populate("from_user_id to_user_id")
            .sort({ createdAt: -1 })
            .lean()

        res.json({ success: true, messages })

    } catch (error) {
        console.log("Error in getRecentMessages:", error.message)
        res.status(500).json({ success: false, message: error.message })
    }
}

// Send Document Message
export const sendDocument = async (req, res) => {
    try {
        const userId = req.userId
        const { to_user_id, group_id } = req.body
        const document = req.file

        if (!document) {
            return res.json({ success: false, message: "Document file is required" })
        }

        let media_url = ""
        let media_name = document.originalname
        let media_size = document.size

        if (imagekit) {
            const buffer = fs.readFileSync(document.path)
            const response = await imagekit.upload({
                file: buffer,
                fileName: document.originalname,
                folder: "messages/documents"
            })
            media_url = response.url
        } else {
            console.warn("ImageKit not configured, skipping document upload for message")
        }

        const message = await Message.create({
            from_user_id: userId,
            to_user_id: group_id ? null : to_user_id,
            group_id: group_id || null,
            message_type: "document",
            media_url,
            media_name,
            media_size
        })

        const messageWithUserData = await Message.findById(message._id)
            .populate("from_user_id", "full_name profile_picture")

        res.json({ success: true, message: messageWithUserData })

        // Push to recipient(s) via SSE
        if (group_id) {
            // Send to all group members
            const group = await GroupChat.findById(group_id).populate("members.user")
            group.members.forEach(member => {
                if (member.user._id.toString() !== userId && connection[member.user._id]) {
                    connection[member.user._id].write(`event: message\n`)
                    connection[member.user._id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`)
                }
            })
        } else if (connection[to_user_id]) {
            connection[to_user_id].write(`event: message\n`)
            connection[to_user_id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`)
        }

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// Send Voice Message
export const sendVoiceMessage = async (req, res) => {
    try {
        const userId = req.userId
        const { to_user_id, group_id, duration } = req.body
        const voiceFile = req.file

        if (!voiceFile) {
            return res.json({ success: false, message: "Voice file is required" })
        }

        let media_url = ""

        if (imagekit) {
            const buffer = fs.readFileSync(voiceFile.path)
            const response = await imagekit.upload({
                file: buffer,
                fileName: voiceFile.originalname,
                folder: "messages/voice"
            })
            media_url = response.url
        } else {
            console.warn("ImageKit not configured, skipping voice upload for message")
        }

        const message = await Message.create({
            from_user_id: userId,
            to_user_id: group_id ? null : to_user_id,
            group_id: group_id || null,
            message_type: "voice",
            media_url,
            duration: parseInt(duration) || 0
        })

        const messageWithUserData = await Message.findById(message._id)
            .populate("from_user_id", "full_name profile_picture")

        res.json({ success: true, message: messageWithUserData })

        // Push to recipient(s) via SSE
        if (group_id) {
            const group = await GroupChat.findById(group_id).populate("members.user")
            group.members.forEach(member => {
                if (member.user._id.toString() !== userId && connection[member.user._id]) {
                    connection[member.user._id].write(`event: message\n`)
                    connection[member.user._id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`)
                }
            })
        } else if (connection[to_user_id]) {
            connection[to_user_id].write(`event: message\n`)
            connection[to_user_id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`)
        }

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// Send Video Message
export const sendVideoMessage = async (req, res) => {
    try {
        const userId = req.userId
        const { to_user_id, group_id, duration } = req.body
        const videoFile = req.file

        if (!videoFile) {
            return res.json({ success: false, message: "Video file is required" })
        }

        let media_url = ""
        let thumbnail_url = ""

        if (imagekit) {
            const buffer = fs.readFileSync(videoFile.path)
            const response = await imagekit.upload({
                file: buffer,
                fileName: videoFile.originalname,
                folder: "messages/videos"
            })
            media_url = response.url
            // Generate thumbnail (simplified - in real app use ffmpeg)
            thumbnail_url = media_url // Placeholder
        } else {
            console.warn("ImageKit not configured, skipping video upload for message")
        }

        const message = await Message.create({
            from_user_id: userId,
            to_user_id: group_id ? null : to_user_id,
            group_id: group_id || null,
            message_type: "video",
            media_url,
            thumbnail_url,
            duration: parseInt(duration) || 0
        })

        const messageWithUserData = await Message.findById(message._id)
            .populate("from_user_id", "full_name profile_picture")

        res.json({ success: true, message: messageWithUserData })

        // Push to recipient(s) via SSE
        if (group_id) {
            const group = await GroupChat.findById(group_id).populate("members.user")
            group.members.forEach(member => {
                if (member.user._id.toString() !== userId && connection[member.user._id]) {
                    connection[member.user._id].write(`event: message\n`)
                    connection[member.user._id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`)
                }
            })
        } else if (connection[to_user_id]) {
            connection[to_user_id].write(`event: message\n`)
            connection[to_user_id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`)
        }

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// Share Post/Reel/Article
export const shareContent = async (req, res) => {
    try {
        const userId = req.userId
        const { to_user_id, group_id, content_type, content_id } = req.body

        let messageData = {
            from_user_id: userId,
            to_user_id: group_id ? null : to_user_id,
            group_id: group_id || null,
            message_type: content_type,
            text: `Shared a ${content_type}`
        }

        if (content_type === "post") {
            messageData.post_data = content_id
        } else if (content_type === "reel") {
            messageData.reel_data = content_id
        } else if (content_type === "article") {
            messageData.article_data = content_id
        }

        const message = await Message.create(messageData)

        const messageWithUserData = await Message.findById(message._id)
            .populate("from_user_id", "full_name profile_picture")
            .populate("post_data")
            .populate("reel_data")
            .populate("article_data")

        res.json({ success: true, message: messageWithUserData })

        // Push to recipient(s) via SSE
        if (group_id) {
            const group = await GroupChat.findById(group_id).populate("members.user")
            group.members.forEach(member => {
                if (member.user._id.toString() !== userId && connection[member.user._id]) {
                    connection[member.user._id].write(`event: message\n`)
                    connection[member.user._id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`)
                }
            })
        } else if (connection[to_user_id]) {
            connection[to_user_id].write(`event: message\n`)
            connection[to_user_id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`)
        }

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// Add Reaction to Message
export const addReaction = async (req, res) => {
    try {
        const userId = req.userId
        const { message_id, emoji } = req.body

        const message = await Message.findById(message_id)
        if (!message) {
            return res.json({ success: false, message: "Message not found" })
        }

        // Remove existing reaction from this user
        message.reactions = message.reactions.filter(r => r.user !== userId)

        // Add new reaction
        message.reactions.push({
            user: userId,
            emoji,
            reacted_at: new Date()
        })

        await message.save()

        res.json({ success: true, message: "Reaction added" })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// Reply to Message
export const replyToMessage = async (req, res) => {
    try {
        const userId = req.userId
        const { to_user_id, group_id, text, reply_to_id } = req.body

        const replyMessage = await Message.findById(reply_to_id)
        if (!replyMessage) {
            return res.json({ success: false, message: "Original message not found" })
        }

        const message = await Message.create({
            from_user_id: userId,
            to_user_id: group_id ? null : to_user_id,
            group_id: group_id || null,
            text,
            replyTo: reply_to_id
        })

        const messageWithUserData = await Message.findById(message._id)
            .populate("from_user_id", "full_name profile_picture")
            .populate({
                path: "replyTo",
                populate: { path: "from_user_id", select: "full_name" }
            })

        res.json({ success: true, message: messageWithUserData })

        // Push to recipient(s) via SSE
        if (group_id) {
            const group = await GroupChat.findById(group_id).populate("members.user")
            group.members.forEach(member => {
                if (member.user._id.toString() !== userId && connection[member.user._id]) {
                    connection[member.user._id].write(`event: message\n`)
                    connection[member.user._id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`)
                }
            })
        } else if (connection[to_user_id]) {
            connection[to_user_id].write(`event: message\n`)
            connection[to_user_id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`)
        }

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// Forward Message
export const forwardMessage = async (req, res) => {
    try {
        const userId = req.userId
        const { message_id, to_user_ids, group_ids } = req.body

        const originalMessage = await Message.findById(message_id)
        if (!originalMessage) {
            return res.json({ success: false, message: "Message not found" })
        }

        const forwardedMessages = []

        // Forward to individual users
        if (to_user_ids && to_user_ids.length > 0) {
            for (const to_user_id of to_user_ids) {
                const message = await Message.create({
                    from_user_id: userId,
                    to_user_id,
                    text: originalMessage.text,
                    message_type: originalMessage.message_type,
                    media_url: originalMessage.media_url,
                    forwarded: true,
                    forwarded_from: originalMessage.from_user_id
                })

                const messageWithUserData = await Message.findById(message._id)
                    .populate("from_user_id", "full_name profile_picture")

                forwardedMessages.push(messageWithUserData)

                // Push via SSE
                if (connection[to_user_id]) {
                    connection[to_user_id].write(`event: message\n`)
                    connection[to_user_id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`)
                }
            }
        }

        // Forward to groups
        if (group_ids && group_ids.length > 0) {
            for (const group_id of group_ids) {
                const message = await Message.create({
                    from_user_id: userId,
                    group_id,
                    text: originalMessage.text,
                    message_type: originalMessage.message_type,
                    media_url: originalMessage.media_url,
                    forwarded: true,
                    forwarded_from: originalMessage.from_user_id
                })

                const messageWithUserData = await Message.findById(message._id)
                    .populate("from_user_id", "full_name profile_picture")

                forwardedMessages.push(messageWithUserData)

                // Push to all group members via SSE
                const group = await GroupChat.findById(group_id).populate("members.user")
                group.members.forEach(member => {
                    if (member.user._id.toString() !== userId && connection[member.user._id]) {
                        connection[member.user._id].write(`event: message\n`)
                        connection[member.user._id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`)
                    }
                })
            }
        }

        res.json({ success: true, messages: forwardedMessages })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// Delete Message (Soft Delete)
export const deleteMessage = async (req, res) => {
    try {
        const userId = req.userId
        const { message_id } = req.body

        const message = await Message.findById(message_id)
        if (!message) {
            return res.json({ success: false, message: "Message not found" })
        }

        if (message.from_user_id !== userId) {
            return res.json({ success: false, message: "You can only delete your own messages" })
        }

        message.is_deleted = true
        message.deleted_at = new Date()
        await message.save()

        res.json({ success: true, message: "Message deleted" })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// Edit Message
export const editMessage = async (req, res) => {
    try {
        const userId = req.userId
        const { message_id, new_text } = req.body

        const message = await Message.findById(message_id)
        if (!message) {
            return res.json({ success: false, message: "Message not found" })
        }

        if (message.from_user_id !== userId) {
            return res.json({ success: false, message: "You can only edit your own messages" })
        }

        message.text = new_text
        message.edited = true
        message.edited_at = new Date()
        await message.save()

        res.json({ success: true, message: "Message edited" })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// Send InMail (LinkedIn-style messaging for non-followers)
export const sendInMail = async (req, res) => {
    try {
        const userId = req.userId
        const { to_user_id, subject, text } = req.body

        // Check if recipient exists and is not a connection/follower
        const recipient = await User.findById(to_user_id)
        if (!recipient) {
            return res.json({ success: false, message: "User not found" })
        }

        const sender = await User.findById(userId)
        const isConnection = sender.connections.includes(to_user_id) || sender.following.includes(to_user_id)

        if (isConnection) {
            return res.json({ success: false, message: "Use regular messaging for connections" })
        }

        const message = await Message.create({
            from_user_id: userId,
            to_user_id,
            text: `Subject: ${subject}\n\n${text}`,
            is_inmail: true
        })

        const messageWithUserData = await Message.findById(message._id)
            .populate("from_user_id", "full_name profile_picture")

        res.json({ success: true, message: messageWithUserData })

        // Push via SSE
        if (connection[to_user_id]) {
            connection[to_user_id].write(`event: inmail\n`)
            connection[to_user_id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`)
        }

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}
