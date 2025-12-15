import VideoCall from "../model/VideoCall.js"
import GroupChat from "../model/GroupChat.js"
import { v4 as uuidv4 } from 'uuid'

// Initiate Video Call
export const initiateCall = async (req, res) => {
    try {
        const userId = req.userId
        const { participant_ids, call_type, group_id } = req.body

        if (!participant_ids || participant_ids.length === 0) {
            return res.json({ success: false, message: "At least one participant is required" })
        }

        const callId = uuidv4()

        // Create participants array
        const participants = participant_ids.map(id => ({
            user: id,
            status: id === userId ? "joined" : "invited"
        }))

        // Add initiator
        participants.unshift({
            user: userId,
            status: "joined",
            joined_at: new Date()
        })

        const callData = {
            call_id: callId,
            initiator: userId,
            participants,
            call_type: call_type || "video",
            status: "ringing",
            started_at: new Date()
        }

        if (group_id) {
            callData.is_group_call = true
            callData.group_id = group_id
        }

        const call = await VideoCall.create(callData)

        const callWithParticipants = await VideoCall.findById(call._id)
            .populate("participants.user", "full_name profile_picture username")
            .populate("initiator", "full_name profile_picture")

        res.json({ success: true, call: callWithParticipants })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// Accept Call
export const acceptCall = async (req, res) => {
    try {
        const userId = req.userId
        const { call_id } = req.body

        const call = await VideoCall.findOne({
            call_id,
            "participants.user": userId,
            status: "ringing"
        })

        if (!call) {
            return res.json({ success: false, message: "Call not found or already ended" })
        }

        // Update participant status
        const participantIndex = call.participants.findIndex(p => p.user.toString() === userId)
        if (participantIndex !== -1) {
            call.participants[participantIndex].status = "joined"
            call.participants[participantIndex].joined_at = new Date()
        }

        // Check if call should start (at least 2 participants joined)
        const joinedCount = call.participants.filter(p => p.status === "joined").length
        if (joinedCount >= 2) {
            call.status = "ongoing"
        }

        await call.save()

        res.json({ success: true, call })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// Decline Call
export const declineCall = async (req, res) => {
    try {
        const userId = req.userId
        const { call_id } = req.body

        const call = await VideoCall.findOne({
            call_id,
            "participants.user": userId,
            status: "ringing"
        })

        if (!call) {
            return res.json({ success: false, message: "Call not found" })
        }

        // Update participant status
        const participantIndex = call.participants.findIndex(p => p.user.toString() === userId)
        if (participantIndex !== -1) {
            call.participants[participantIndex].status = "declined"
        }

        await call.save()

        res.json({ success: true, message: "Call declined" })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// End Call
export const endCall = async (req, res) => {
    try {
        const userId = req.userId
        const { call_id } = req.body

        const call = await VideoCall.findOne({
            call_id,
            "participants.user": userId,
            status: { $in: ["ringing", "ongoing"] }
        })

        if (!call) {
            return res.json({ success: false, message: "Call not found" })
        }

        // Update participant status
        const participantIndex = call.participants.findIndex(p => p.user.toString() === userId)
        if (participantIndex !== -1) {
            call.participants[participantIndex].status = "left"
            call.participants[participantIndex].left_at = new Date()
        }

        // Check if all participants have left
        const activeParticipants = call.participants.filter(p =>
            p.status === "joined" && p.user.toString() !== userId
        )

        if (activeParticipants.length === 0) {
            call.status = "ended"
            call.ended_at = new Date()
            call.duration = Math.floor((call.ended_at - call.started_at) / 1000)
        }

        await call.save()

        res.json({ success: true, message: "Call ended" })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// Get Call Details
export const getCallDetails = async (req, res) => {
    try {
        const userId = req.userId
        const { call_id } = req.params

        const call = await VideoCall.findOne({
            call_id,
            "participants.user": userId
        })
        .populate("participants.user", "full_name profile_picture username")
        .populate("initiator", "full_name profile_picture")
        .populate("group_id", "name avatar")

        if (!call) {
            return res.json({ success: false, message: "Call not found" })
        }

        res.json({ success: true, call })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// Get Call History
export const getCallHistory = async (req, res) => {
    try {
        const userId = req.userId

        const calls = await VideoCall.find({
            "participants.user": userId,
            status: { $in: ["ended", "missed"] }
        })
        .populate("participants.user", "full_name profile_picture username")
        .populate("initiator", "full_name profile_picture")
        .sort({ created_at: -1 })
        .limit(50)

        res.json({ success: true, calls })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// Send Message During Call
export const sendCallMessage = async (req, res) => {
    try {
        const userId = req.userId
        const { call_id, text } = req.body

        const call = await VideoCall.findOne({
            call_id,
            "participants.user": userId,
            status: "ongoing"
        })

        if (!call) {
            return res.json({ success: false, message: "Call not found or not ongoing" })
        }

        // Create message (this would be handled by message controller)
        // For now, just add to call's chat_messages array
        const messageData = {
            from_user_id: userId,
            text,
            message_type: "text",
            createdAt: new Date()
        }

        call.chat_messages.push(messageData)
        await call.save()

        res.json({ success: true, message: "Message sent" })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// Toggle Recording
export const toggleRecording = async (req, res) => {
    try {
        const userId = req.userId
        const { call_id, recording } = req.body

        const call = await VideoCall.findOne({
            call_id,
            "participants.user": userId,
            status: "ongoing"
        })

        if (!call) {
            return res.json({ success: false, message: "Call not found or not ongoing" })
        }

        // Check if user has permission to record
        if (recording && !call.settings.allow_recording) {
            return res.json({ success: false, message: "Recording not allowed in this call" })
        }

        // Update recording status (this would integrate with actual recording service)
        call.settings.allow_recording = recording

        await call.save()

        res.json({ success: true, message: recording ? "Recording started" : "Recording stopped" })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}
