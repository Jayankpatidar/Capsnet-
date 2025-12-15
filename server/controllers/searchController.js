import User from "../model/User.js";
import Post from "../model/Post.js";
import Job from "../model/Job.js";
import Company from "../model/Company.js";
import Reel from "../model/Reel.js";

// User search
export const searchUsers = async (req, res) => {
  try {
    const { query, limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const searchRegex = new RegExp(query, 'i');

    const users = await User.find({
      $or: [
        { full_name: searchRegex },
        { username: searchRegex },
        { bio: searchRegex },
        { professional_headline: searchRegex },
        { location: searchRegex },
        { skills: { $elemMatch: { name: searchRegex } } },
        { interests: searchRegex }
      ]
    })
    .select('full_name username bio professional_headline profile_picture location skills interests')
    .limit(parseInt(limit))
    .skip(skip)
    .sort({ createdAt: -1 });

    const total = await User.countDocuments({
      $or: [
        { full_name: searchRegex },
        { username: searchRegex },
        { bio: searchRegex },
        { professional_headline: searchRegex },
        { location: searchRegex },
        { skills: { $elemMatch: { name: searchRegex } } },
        { interests: searchRegex }
      ]
    });

    res.json({
      success: true,
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalResults: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Post search
export const searchPosts = async (req, res) => {
  try {
    const { query, limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const searchRegex = new RegExp(query, 'i');

    const posts = await Post.find({
      $or: [
        { content: searchRegex },
        { hashtags: searchRegex },
        { location: searchRegex }
      ],
      is_draft: false
    })
    .populate('user', 'full_name username profile_picture')
    .limit(parseInt(limit))
    .skip(skip)
    .sort({ createdAt: -1 });

    const total = await Post.countDocuments({
      $or: [
        { content: searchRegex },
        { hashtags: searchRegex },
        { location: searchRegex }
      ],
      is_draft: false
    });

    res.json({
      success: true,
      data: posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalResults: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Job search
export const searchJobs = async (req, res) => {
  try {
    const { query, location, jobType, workType, limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    let searchQuery = { isActive: true };

    if (query) {
      const searchRegex = new RegExp(query, 'i');
      searchQuery.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { company: searchRegex },
        { skills: searchRegex }
      ];
    }

    if (location) {
      searchQuery.location = new RegExp(location, 'i');
    }

    if (jobType) {
      searchQuery.jobType = jobType;
    }

    if (workType) {
      searchQuery.workType = workType;
    }

    const jobs = await Job.find(searchQuery)
      .populate('postedBy', 'full_name username profile_picture')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments(searchQuery);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalResults: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Company search
export const searchCompanies = async (req, res) => {
  try {
    const { query, industry, location, limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    let searchQuery = {};

    if (query) {
      const searchRegex = new RegExp(query, 'i');
      searchQuery.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { industry: searchRegex }
      ];
    }

    if (industry) {
      searchQuery.industry = new RegExp(industry, 'i');
    }

    if (location) {
      searchQuery.location = new RegExp(location, 'i');
    }

    const companies = await Company.find(searchQuery)
      .populate('owner_id', 'full_name username profile_picture')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Company.countDocuments(searchQuery);

    res.json({
      success: true,
      data: companies,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalResults: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reel search
export const searchReels = async (req, res) => {
  try {
    const { query, limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const searchRegex = new RegExp(query, 'i');

    const reels = await Reel.find({
      $or: [
        { caption: searchRegex },
        { content: searchRegex },
        { hashtags: searchRegex },
        { location: searchRegex }
      ]
    })
    .populate('user', 'full_name username profile_picture')
    .limit(parseInt(limit))
    .skip(skip)
    .sort({ createdAt: -1 });

    const total = await Reel.countDocuments({
      $or: [
        { caption: searchRegex },
        { content: searchRegex },
        { hashtags: searchRegex },
        { location: searchRegex }
      ]
    });

    res.json({
      success: true,
      data: reels,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalResults: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Hashtag search
export const searchHashtags = async (req, res) => {
  try {
    const { query, limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const hashtagRegex = new RegExp(`^${query}`, 'i');

    // Search in posts
    const posts = await Post.find({
      hashtags: hashtagRegex,
      is_draft: false
    })
    .populate('user', 'full_name username profile_picture')
    .limit(parseInt(limit))
    .skip(skip)
    .sort({ createdAt: -1 });

    // Search in reels
    const reels = await Reel.find({
      hashtags: hashtagRegex
    })
    .populate('user', 'full_name username profile_picture')
    .limit(parseInt(limit))
    .skip(skip)
    .sort({ createdAt: -1 });

    const combinedResults = [...posts, ...reels].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: combinedResults.slice(0, limit),
      type: 'hashtag'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Location search
export const searchByLocation = async (req, res) => {
  try {
    const { query, limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const locationRegex = new RegExp(query, 'i');

    // Search users by location
    const users = await User.find({ location: locationRegex })
      .select('full_name username profile_picture location')
      .limit(parseInt(limit));

    // Search posts by location
    const posts = await Post.find({ location: locationRegex, is_draft: false })
      .populate('user', 'full_name username profile_picture')
      .limit(parseInt(limit));

    // Search jobs by location
    const jobs = await Job.find({ location: locationRegex, isActive: true })
      .populate('postedBy', 'full_name username profile_picture')
      .limit(parseInt(limit));

    // Search companies by location
    const companies = await Company.find({ location: locationRegex })
      .populate('owner_id', 'full_name username profile_picture')
      .limit(parseInt(limit));

    // Search reels by location
    const reels = await Reel.find({ location: locationRegex })
      .populate('user', 'full_name username profile_picture')
      .limit(parseInt(limit));

    const combinedResults = {
      users,
      posts,
      jobs,
      companies,
      reels
    };

    res.json({
      success: true,
      data: combinedResults,
      type: 'location'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Skill-based search
export const searchBySkills = async (req, res) => {
  try {
    const { query, limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const skillRegex = new RegExp(query, 'i');

    // Search users by skills
    const users = await User.find({
      skills: { $elemMatch: { name: skillRegex } }
    })
    .select('full_name username profile_picture skills')
    .limit(parseInt(limit))
    .skip(skip)
    .sort({ createdAt: -1 });

    // Search jobs by skills
    const jobs = await Job.find({
      skills: skillRegex,
      isActive: true
    })
    .populate('postedBy', 'full_name username profile_picture')
    .limit(parseInt(limit))
    .skip(skip)
    .sort({ createdAt: -1 });

    const combinedResults = {
      users,
      jobs
    };

    res.json({
      success: true,
      data: combinedResults,
      type: 'skills'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Audio/music search
export const searchAudioMusic = async (req, res) => {
  try {
    const { query, limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const musicRegex = new RegExp(query, 'i');

    // Search posts with music
    const posts = await Post.find({
      music_url: { $exists: true, $ne: null },
      $or: [
        { content: musicRegex },
        { music_url: musicRegex }
      ],
      is_draft: false
    })
    .populate('user', 'full_name username profile_picture')
    .limit(parseInt(limit))
    .skip(skip)
    .sort({ createdAt: -1 });

    // Search reels with music
    const reels = await Reel.find({
      $or: [
        { musicUrl: musicRegex },
        { music_url: musicRegex },
        { caption: musicRegex },
        { content: musicRegex }
      ]
    })
    .populate('user', 'full_name username profile_picture')
    .limit(parseInt(limit))
    .skip(skip)
    .sort({ createdAt: -1 });

    const combinedResults = [...posts, ...reels].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: combinedResults.slice(0, limit),
      type: 'audio_music'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Global advanced search
export const globalAdvancedSearch = async (req, res) => {
  try {
    const {
      query,
      type, // users, posts, jobs, companies, reels
      filters = {},
      limit = 20,
      page = 1
    } = req.query;

    const skip = (page - 1) * limit;
    const searchRegex = new RegExp(query, 'i');

    let results = {};

    if (!type || type === 'all') {
      // Search all types
      const [users, posts, jobs, companies, reels] = await Promise.all([
        User.find({
          $or: [
            { full_name: searchRegex },
            { username: searchRegex },
            { bio: searchRegex },
            { professional_headline: searchRegex },
            { location: searchRegex },
            { skills: { $elemMatch: { name: searchRegex } } }
          ]
        }).limit(5).select('full_name username profile_picture'),

        Post.find({
          $or: [
            { content: searchRegex },
            { hashtags: searchRegex },
            { location: searchRegex }
          ],
          is_draft: false
        }).limit(5).populate('user', 'full_name username profile_picture'),

        Job.find({
          $or: [
            { title: searchRegex },
            { description: searchRegex },
            { company: searchRegex },
            { skills: searchRegex }
          ],
          isActive: true
        }).limit(5).populate('postedBy', 'full_name username profile_picture'),

        Company.find({
          $or: [
            { name: searchRegex },
            { description: searchRegex },
            { industry: searchRegex }
          ]
        }).limit(5).populate('owner_id', 'full_name username profile_picture'),

        Reel.find({
          $or: [
            { caption: searchRegex },
            { content: searchRegex },
            { hashtags: searchRegex }
          ]
        }).limit(5).populate('user', 'full_name username profile_picture')
      ]);

      results = {
        users: { data: users, count: users.length },
        posts: { data: posts, count: posts.length },
        jobs: { data: jobs, count: jobs.length },
        companies: { data: companies, count: companies.length },
        reels: { data: reels, count: reels.length }
      };
    } else {
      // Search specific type with full pagination
      let model, searchQuery, populateField;

      switch (type) {
        case 'users':
          model = User;
          searchQuery = {
            $or: [
              { full_name: searchRegex },
              { username: searchRegex },
              { bio: searchRegex },
              { professional_headline: searchRegex },
              { location: searchRegex },
              { skills: { $elemMatch: { name: searchRegex } } }
            ]
          };
          break;
        case 'posts':
          model = Post;
          searchQuery = {
            $or: [
              { content: searchRegex },
              { hashtags: searchRegex },
              { location: searchRegex }
            ],
            is_draft: false
          };
          populateField = 'user';
          break;
        case 'jobs':
          model = Job;
          searchQuery = {
            $or: [
              { title: searchRegex },
              { description: searchRegex },
              { company: searchRegex },
              { skills: searchRegex }
            ],
            isActive: true
          };
          populateField = 'postedBy';
          break;
        case 'companies':
          model = Company;
          searchQuery = {
            $or: [
              { name: searchRegex },
              { description: searchRegex },
              { industry: searchRegex }
            ]
          };
          populateField = 'owner_id';
          break;
        case 'reels':
          model = Reel;
          searchQuery = {
            $or: [
              { caption: searchRegex },
              { content: searchRegex },
              { hashtags: searchRegex }
            ]
          };
          populateField = 'user';
          break;
      }

      // Apply additional filters
      if (filters.location) {
        searchQuery.location = new RegExp(filters.location, 'i');
      }
      if (filters.jobType && type === 'jobs') {
        searchQuery.jobType = filters.jobType;
      }
      if (filters.workType && type === 'jobs') {
        searchQuery.workType = filters.workType;
      }
      if (filters.industry && type === 'companies') {
        searchQuery.industry = new RegExp(filters.industry, 'i');
      }

      const data = await model.find(searchQuery)
        .populate(populateField, 'full_name username profile_picture')
        .limit(parseInt(limit))
        .skip(skip)
        .sort({ createdAt: -1 });

      const total = await model.countDocuments(searchQuery);

      results = {
        [type]: {
          data,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalResults: total,
            hasNext: page * limit < total,
            hasPrev: page > 1
          }
        }
      };
    }

    res.json({
      success: true,
      data: results,
      query,
      type: type || 'all'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
