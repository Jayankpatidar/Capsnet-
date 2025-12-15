import Company from "../model/Company.js";
import User from "../model/User.js";
import Post from "../model/Post.js";
import Job from "../model/Job.js";

// Create Company
export const createCompany = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check if user already owns a company
    const existingCompany = await Company.findOne({ owner_id: userId });
    if (existingCompany) {
      return res.json({ success: false, message: "You already own a company" });
    }

    const {
      name,
      description,
      industry,
      location,
      website,
      founded_year,
      company_size,
      mission,
      vision,
      values
    } = req.body;

    if (!name || !description || !industry || !location) {
      return res.json({ success: false, message: "Required fields are missing" });
    }

    // Handle file uploads
    let logo = "";
    let cover_image = "";

    if (req.files?.logo?.[0]) {
      logo = `/uploads/${req.files.logo[0].filename}`;
    }

    if (req.files?.cover_image?.[0]) {
      cover_image = `/uploads/${req.files.cover_image[0].filename}`;
    }

    // Process values array
    let valuesArray = [];
    if (values) {
      valuesArray = typeof values === 'string' ? values.split(',').map(v => v.trim()) : values;
    }

    const company = new Company({
      name,
      description,
      industry,
      location,
      website,
      founded_year: founded_year ? parseInt(founded_year) : undefined,
      company_size,
      mission,
      vision,
      values: valuesArray,
      logo,
      cover_image,
      owner_id: userId,
      team_members: [{
        user_id: userId,
        role: "Owner",
        joined_at: new Date()
      }]
    });

    await company.save();

    res.json({
      success: true,
      message: "Company created successfully",
      company
    });

  } catch (error) {
    console.error("Create company error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Company
export const updateCompany = async (req, res) => {
  try {
    const userId = req.userId;
    const { companyId } = req.params;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.json({ success: false, message: "Company not found" });
    }

    // Check if user is owner or team member
    if (company.owner_id !== userId && !company.team_members.some(member => member.user_id === userId)) {
      return res.json({ success: false, message: "Access denied" });
    }

    const {
      name,
      description,
      industry,
      location,
      website,
      founded_year,
      company_size,
      mission,
      vision,
      values
    } = req.body;

    // Handle file uploads
    if (req.files?.logo?.[0]) {
      company.logo = `/uploads/${req.files.logo[0].filename}`;
    }

    if (req.files?.cover_image?.[0]) {
      company.cover_image = `/uploads/${req.files.cover_image[0].filename}`;
    }

    // Update fields
    if (name) company.name = name;
    if (description) company.description = description;
    if (industry) company.industry = industry;
    if (location) company.location = location;
    if (website) company.website = website;
    if (founded_year) company.founded_year = parseInt(founded_year);
    if (company_size) company.company_size = company_size;
    if (mission) company.mission = mission;
    if (vision) company.vision = vision;

    // Process values array
    if (values) {
      company.values = typeof values === 'string' ? values.split(',').map(v => v.trim()) : values;
    }

    await company.save();

    res.json({
      success: true,
      message: "Company updated successfully",
      company
    });

  } catch (error) {
    console.error("Update company error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Company Profile
export const getCompanyProfile = async (req, res) => {
  try {
    const { companyId } = req.params;

    const company = await Company.findById(companyId)
      .populate('owner_id', 'full_name username profile_picture')
      .populate('team_members.user_id', 'full_name username profile_picture')
      .populate('followers', 'full_name username profile_picture')
      .populate({
        path: 'posts',
        populate: {
          path: 'user',
          select: 'full_name username profile_picture'
        },
        options: { sort: { createdAt: -1 }, limit: 10 }
      })
      .populate({
        path: 'jobs',
        options: { sort: { createdAt: -1 } }
      });

    if (!company) {
      return res.json({ success: false, message: "Company not found" });
    }

    // Increment profile views
    company.profile_views += 1;
    await company.save();

    res.json({
      success: true,
      company
    });

  } catch (error) {
    console.error("Get company profile error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get My Company
export const getMyCompany = async (req, res) => {
  try {
    const userId = req.userId;

    const company = await Company.findOne({ owner_id: userId })
      .populate('owner_id', 'full_name username profile_picture')
      .populate('team_members.user_id', 'full_name username profile_picture')
      .populate('followers', 'full_name username profile_picture')
      .populate({
        path: 'posts',
        populate: {
          path: 'user',
          select: 'full_name username profile_picture'
        },
        options: { sort: { createdAt: -1 }, limit: 10 }
      })
      .populate({
        path: 'jobs',
        options: { sort: { createdAt: -1 } }
      });

    if (!company) {
      return res.json({ success: false, message: "You don't own a company" });
    }

    res.json({
      success: true,
      company
    });

  } catch (error) {
    console.error("Get my company error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Follow/Unfollow Company
export const followCompany = async (req, res) => {
  try {
    const userId = req.userId;
    const { companyId } = req.body;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.json({ success: false, message: "Company not found" });
    }

    const isFollowing = company.followers.includes(userId);

    if (isFollowing) {
      // Unfollow
      company.followers = company.followers.filter(id => id.toString() !== userId);
      company.follower_count -= 1;
    } else {
      // Follow
      company.followers.push(userId);
      company.follower_count += 1;
    }

    await company.save();

    res.json({
      success: true,
      message: isFollowing ? "Unfollowed company" : "Following company",
      isFollowing: !isFollowing
    });

  } catch (error) {
    console.error("Follow company error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add Team Member
export const addTeamMember = async (req, res) => {
  try {
    const userId = req.userId;
    const { companyId, userId: memberUserId, role } = req.body;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.json({ success: false, message: "Company not found" });
    }

    // Only owner can add team members
    if (company.owner_id !== userId) {
      return res.json({ success: false, message: "Access denied" });
    }

    // Check if user is already a team member
    const existingMember = company.team_members.find(member => member.user_id === memberUserId);
    if (existingMember) {
      return res.json({ success: false, message: "User is already a team member" });
    }

    // Add team member
    company.team_members.push({
      user_id: memberUserId,
      role: role || "Member",
      joined_at: new Date()
    });

    await company.save();

    // Populate the new member data
    await company.populate('team_members.user_id', 'full_name username profile_picture');

    res.json({
      success: true,
      message: "Team member added successfully",
      company
    });

  } catch (error) {
    console.error("Add team member error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove Team Member
export const removeTeamMember = async (req, res) => {
  try {
    const userId = req.userId;
    const { companyId, userId: memberUserId } = req.body;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.json({ success: false, message: "Company not found" });
    }

    // Only owner can remove team members
    if (company.owner_id !== userId) {
      return res.json({ success: false, message: "Access denied" });
    }

    // Cannot remove owner
    if (company.owner_id === memberUserId) {
      return res.json({ success: false, message: "Cannot remove company owner" });
    }

    // Remove team member
    company.team_members = company.team_members.filter(member => member.user_id !== memberUserId);

    await company.save();

    res.json({
      success: true,
      message: "Team member removed successfully",
      company
    });

  } catch (error) {
    console.error("Remove team member error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create Company Post
export const createCompanyPost = async (req, res) => {
  try {
    const userId = req.userId;
    const { content, images, companyId } = req.body;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.json({ success: false, message: "Company not found" });
    }

    // Check if user is owner or team member
    if (company.owner_id !== userId && !company.team_members.some(member => member.user_id === userId)) {
      return res.json({ success: false, message: "Access denied" });
    }

    const post = new Post({
      user: userId,
      content,
      images: images || [],
      company: companyId,
      isCompanyPost: true
    });

    await post.save();

    // Add post to company's posts array
    company.posts.push(post._id);
    await company.save();

    // Populate post data
    await post.populate('user', 'full_name username profile_picture');

    res.json({
      success: true,
      message: "Post created successfully",
      post
    });

  } catch (error) {
    console.error("Create company post error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Company Analytics
export const getCompanyAnalytics = async (req, res) => {
  try {
    const userId = req.userId;
    const { companyId } = req.params;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.json({ success: false, message: "Company not found" });
    }

    // Only owner can view analytics
    if (company.owner_id !== userId) {
      return res.json({ success: false, message: "Access denied" });
    }

    // Get analytics data
    const analytics = {
      profile_views: company.profile_views,
      post_views: company.post_views,
      job_views: company.job_views,
      follower_count: company.follower_count,
      team_members_count: company.team_members.length,
      posts_count: company.posts.length,
      jobs_count: company.jobs.length
    };

    res.json({
      success: true,
      analytics
    });

  } catch (error) {
    console.error("Get company analytics error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search Companies
export const searchCompanies = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json({ success: false, message: "Search query is required" });
    }

    const companies = await Company.find({
      $and: [
        {
          $or: [
            { name: new RegExp(q, "i") },
            { description: new RegExp(q, "i") },
            { industry: new RegExp(q, "i") },
            { location: new RegExp(q, "i") }
          ]
        },
        { is_private: false } // Only show public companies
      ]
    })
    .populate('owner_id', 'full_name username profile_picture')
    .limit(20);

    res.json({
      success: true,
      companies
    });

  } catch (error) {
    console.error("Search companies error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Suggested Companies
export const getSuggestedCompanies = async (req, res) => {
  try {
    const userId = req.userId;

    // Get user's interests and skills
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Find companies that match user's interests/skills
    const suggestedCompanies = await Company.find({
      is_private: false,
      $or: [
        { industry: { $in: user.interests || [] } },
        { values: { $in: user.skills?.map(skill => skill.name) || [] } }
      ]
    })
    .populate('owner_id', 'full_name username profile_picture')
    .limit(10);

    res.json({
      success: true,
      companies: suggestedCompanies
    });

  } catch (error) {
    console.error("Get suggested companies error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
