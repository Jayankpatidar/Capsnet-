import GroupChat from "../model/GroupChat.js";
import Message from "../model/Message.js";
import User from "../model/User.js";

// Create group
export const createGroup = async (req, res) => {
  try {
    const group = await GroupChat.create({
      name: req.body.name,
      created_by: req.userId,
      admins: [req.userId],
      members: [{
        user: req.userId,
        role: "admin",
        joined_at: new Date()
      }],
    });

    res.status(201).json({ success: true, group });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get groups of logged user
export const getUserGroups = async (req, res) => {
  try {
    const groups = await GroupChat.find({ "members.user": req.userId });
    res.json({ success: true, groups });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get group details
export const getGroupById = async (req, res) => {
  try {
    const group = await GroupChat.findById(req.params.groupId).populate("members.user", "full_name username");
    res.json({ success: true, group });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add member to group
export const addMember = async (req, res) => {
  try {
    const group = await GroupChat.findByIdAndUpdate(
      req.params.groupId,
      { $push: { members: { user: req.body.memberId, role: "member", joined_at: new Date() } } },
      { new: true }
    );

    res.json({ success: true, group });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Remove member from group
export const removeMember = async (req, res) => {
  try {
    const group = await GroupChat.findByIdAndUpdate(
      req.params.groupId,
      { $pull: { members: { user: req.params.memberId } } },
      { new: true }
    );

    res.json({ success: true, group });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Send message to group
export const sendGroupMessage = async (req, res) => {
  try {
    const message = await Message.create({
      sender: req.user.id,
      group: req.params.groupId,
      text: req.body.text,
    });

    res.status(201).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get group messages
export const getGroupMessages = async (req, res) => {
  try {
    const messages = await Message.find({ group_id: req.params.groupId }).populate(
      "from_user_id",
      "full_name username"
    );

    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Leave group
export const leaveGroup = async (req, res) => {
  try {
    const updated = await GroupChat.findByIdAndUpdate(
      req.params.groupId,
      { $pull: { members: { user: req.userId } } },
      { new: true }
    );

    res.json({ success: true, updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete group
export const deleteGroup = async (req, res) => {
  try {
    await GroupChat.findByIdAndDelete(req.params.groupId);

    res.json({ success: true, message: "Group deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
