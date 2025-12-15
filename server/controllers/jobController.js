import Job from "../model/Job.js";
import User from "../model/User.js";

// Post Job
export const postJob = async (req, res) => {
    try {
        const jobData = {
            ...req.body,
            postedBy: req.userId
        };
        const job = await Job.create(jobData);
        res.json({ success: true, job });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Get Jobs with Matching and Filtering
export const getJobs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        // Build filter object
        const filters = { isActive: true };

        if (req.query.search) {
            filters.$text = { $search: req.query.search };
        }

        if (req.query.location) {
            filters.location = { $regex: req.query.location, $options: 'i' };
        }

        if (req.query.salaryMin) {
            filters['salary.min'] = { $gte: parseInt(req.query.salaryMin) };
        }

        if (req.query.salaryMax) {
            filters['salary.max'] = { $lte: parseInt(req.query.salaryMax) };
        }

        if (req.query.experience) {
            const [min, max] = req.query.experience.split('-').map(Number);
            filters['experience.min'] = { $lte: max };
            filters['experience.max'] = { $gte: min };
        }

        if (req.query.jobType) {
            filters.jobType = req.query.jobType;
        }

        if (req.query.workType) {
            filters.workType = req.query.workType;
        }

        const totalJobs = await Job.countDocuments(filters);
        const totalPages = Math.ceil(totalJobs / limit);

        const jobs = await Job.find(filters)
            .populate('postedBy', 'name profilePic')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Calculate match percentage based on skills if user is logged in
        let jobsWithMatch = jobs;
        if (req.userId) {
            const user = await User.findById(req.userId);
            if (user && user.skills) {
                jobsWithMatch = jobs.map(job => {
                    const userSkills = user.skills.map(s => s.name?.toLowerCase() || s.toLowerCase());
                    const jobSkills = [
                        ...(job.skills || []),
                        ...(job.description ? job.description.toLowerCase().split(' ').filter(word =>
                            ['javascript', 'react', 'node', 'python', 'java', 'mongodb', 'sql', 'html', 'css', 'typescript'].includes(word.toLowerCase())
                        ) : [])
                    ];

                    const matchingSkills = jobSkills.filter(skill =>
                        userSkills.includes(typeof skill === 'string' ? skill.toLowerCase() : skill)
                    );
                    const matchPercentage = jobSkills.length > 0 ? Math.round((matchingSkills.length / jobSkills.length) * 100) : 0;

                    return { ...job.toObject(), matchPercentage };
                });
            }
        }

        const pagination = {
            currentPage: page,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
            totalJobs
        };

        res.json({ success: true, jobs: jobsWithMatch, pagination });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Get Job Details
export const getJobDetails = async (req, res) => {
    try {
        const { jobId } = req.params;
        const job = await Job.findById(jobId).populate('postedBy', 'name profilePic company');

        if (!job) {
            return res.json({ success: false, message: 'Job not found' });
        }

        // Increment view count
        job.views += 1;
        await job.save();

        res.json({ success: true, job });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Apply Job
export const applyJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const resume = req.file ? req.file.path : null;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.json({ success: false, message: 'Job not found' });
        }

        // Check if user already applied
        const existingApplication = job.applicants.find(app => app.user.toString() === req.userId);
        if (existingApplication) {
            return res.json({ success: false, message: 'Already applied to this job' });
        }

        // Add application
        job.applicants.push({
            user: req.userId,
            status: 'applied',
            appliedAt: new Date(),
            resume: resume
        });

        await job.save();
        await job.populate('postedBy', 'name profilePic');

        res.json({ success: true, job, message: 'Application submitted successfully' });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Save Job
export const saveJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const job = await Job.findById(jobId);

        if (!job) {
            return res.json({ success: false, message: 'Job not found' });
        }

        // Check if already saved
        if (job.savedBy.includes(req.userId)) {
            return res.json({ success: false, message: 'Job already saved' });
        }

        job.savedBy.push(req.userId);
        await job.save();
        await job.populate('postedBy', 'name profilePic');

        res.json({ success: true, job, message: 'Job saved successfully' });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Get Saved Jobs
export const getSavedJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ savedBy: req.userId, isActive: true })
            .populate('postedBy', 'name profilePic')
            .sort({ createdAt: -1 });

        res.json({ success: true, jobs });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Get Applied Jobs
export const getAppliedJobs = async (req, res) => {
    try {
        const jobs = await Job.find({
            'applicants.user': req.userId,
            isActive: true
        })
        .populate('postedBy', 'name profilePic')
        .sort({ createdAt: -1 });

        // Add application status to each job
        const jobsWithStatus = jobs.map(job => {
            const application = job.applicants.find(app => app.user.toString() === req.userId);
            return {
                ...job.toObject(),
                applicationStatus: application ? application.status : 'applied',
                appliedAt: application ? application.appliedAt : null
            };
        });

        res.json({ success: true, jobs: jobsWithStatus });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Withdraw Application
export const withdrawApplication = async (req, res) => {
    try {
        const { jobId } = req.body;
        const job = await Job.findById(jobId);

        if (!job) {
            return res.json({ success: false, message: 'Job not found' });
        }

        // Remove application
        job.applicants = job.applicants.filter(app => app.user.toString() !== req.userId);
        await job.save();
        await job.populate('postedBy', 'name profilePic');

        res.json({ success: true, job, message: 'Application withdrawn successfully' });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Get My Jobs (for employers)
export const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.userId })
            .populate('postedBy', 'name profilePic')
            .sort({ createdAt: -1 });

        res.json({ success: true, jobs });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Update Job Status
export const updateJobStatus = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { isActive } = req.body;

        const job = await Job.findOneAndUpdate(
            { _id: jobId, postedBy: req.userId },
            { isActive },
            { new: true }
        ).populate('postedBy', 'name profilePic');

        if (!job) {
            return res.json({ success: false, message: 'Job not found or unauthorized' });
        }

        res.json({ success: true, job, message: 'Job status updated successfully' });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Update Application Status
export const updateApplicationStatus = async (req, res) => {
    try {
        const { jobId, userId, status } = req.body;

        const job = await Job.findOneAndUpdate(
            { _id: jobId, postedBy: req.userId, 'applicants.user': userId },
            { $set: { 'applicants.$.status': status } },
            { new: true }
        ).populate('postedBy', 'name profilePic');

        if (!job) {
            return res.json({ success: false, message: 'Job or application not found' });
        }

        res.json({ success: true, job, message: 'Application status updated successfully' });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Get Recommended Jobs
export const getRecommendedJobs = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user || !user.skills) {
            // Return recent jobs if no skills
            const jobs = await Job.find({ isActive: true })
                .populate('postedBy', 'name profilePic')
                .sort({ createdAt: -1 })
                .limit(10);
            return res.json({ success: true, jobs });
        }

        const userSkills = user.skills.map(s => s.name?.toLowerCase() || s.toLowerCase());

        // Find jobs that match user skills
        const jobs = await Job.find({
            isActive: true,
            $or: [
                { skills: { $in: userSkills.map(s => new RegExp(s, 'i')) } },
                { description: { $regex: userSkills.join('|'), $options: 'i' } }
            ]
        })
        .populate('postedBy', 'name profilePic')
        .sort({ createdAt: -1 })
        .limit(20);

        // Calculate match scores
        const jobsWithMatch = jobs.map(job => {
            const jobSkills = [
                ...(job.skills || []),
                ...(job.description ? job.description.toLowerCase().split(' ').filter(word =>
                    ['javascript', 'react', 'node', 'python', 'java', 'mongodb', 'sql', 'html', 'css', 'typescript'].includes(word.toLowerCase())
                ) : [])
            ];

            const matchingSkills = jobSkills.filter(skill =>
                userSkills.includes(typeof skill === 'string' ? skill.toLowerCase() : skill)
            );
            const matchPercentage = jobSkills.length > 0 ? Math.round((matchingSkills.length / jobSkills.length) * 100) : 0;

            return { ...job.toObject(), matchPercentage };
        });

        // Sort by match percentage
        jobsWithMatch.sort((a, b) => b.matchPercentage - a.matchPercentage);

        res.json({ success: true, jobs: jobsWithMatch.slice(0, 10) });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Get Salary Insights
export const getSalaryInsights = async (req, res) => {
    try {
        const insights = await Job.aggregate([
            {
                $match: { isActive: true }
            },
            {
                $group: {
                    _id: {
                        jobType: '$jobType',
                        workType: '$workType',
                        location: { $toLower: '$location' }
                    },
                    avgMinSalary: { $avg: '$salary.min' },
                    avgMaxSalary: { $avg: '$salary.max' },
                    count: { $sum: 1 },
                    currency: { $first: '$salary.currency' }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 20
            }
        ]);

        res.json({ success: true, insights });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Get Interview Questions
export const getInterviewQuestions = async (req, res) => {
    try {
        const { jobId } = req.params;
        const job = await Job.findById(jobId);

        if (!job) {
            return res.json({ success: false, message: 'Job not found' });
        }

        // Generate interview questions based on job type and skills
        const baseQuestions = [
            "Tell me about yourself",
            "What are your strengths and weaknesses?",
            "Why do you want to work here?",
            "Where do you see yourself in 5 years?",
            "Why should we hire you?",
            "Tell me about a challenging project you worked on",
            "How do you handle pressure and deadlines?",
            "Describe your ideal work environment",
            "What are your salary expectations?",
            "Do you have any questions for us?"
        ];

        // Add job-specific questions
        const jobSpecificQuestions = [];
        if (job.jobType === 'full-time') {
            jobSpecificQuestions.push("How do you stay updated with industry trends?");
        }
        if (job.workType === 'remote') {
            jobSpecificQuestions.push("How do you manage your time when working remotely?");
        }
        if (job.skills && job.skills.length > 0) {
            jobSpecificQuestions.push(`Tell me about your experience with ${job.skills[0]}`);
        }

        const questions = [...baseQuestions, ...jobSpecificQuestions];

        res.json({ success: true, questions, job });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}
