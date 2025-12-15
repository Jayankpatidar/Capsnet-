import CollaborationPost from "../model/CollaborationPost.js";

export const createCollaborationPost = async (req, res) => {
  try {
    const { title, description, skillsNeeded, projectType } = req.body;
    const userId = req.userId;

    const post = new CollaborationPost({
      userId,
      title,
      description,
      skillsNeeded,
      projectType
    });

    await post.save();
    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCollaborationPosts = async (req, res) => {
  try {
    const posts = await CollaborationPost.find({ status: "open" }).populate("userId").sort({ createdAt: -1 });
    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const applyForCollaboration = async (req, res) => {
  try {
    const { message } = req.body;
    const { postId } = req.params;
    const userId = req.userId;

    const post = await CollaborationPost.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    post.applicants.push({ userId, message });
    await post.save();

    res.json({ success: true, message: "Application submitted", applicant: { userId, message } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
