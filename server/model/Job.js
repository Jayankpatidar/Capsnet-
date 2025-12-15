import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salary: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    period: { type: String, enum: ['hourly', 'monthly', 'yearly'], default: 'yearly' }
  },
  experience: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 10 }
  },
  jobType: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'], default: 'full-time' },
  workType: { type: String, enum: ['remote', 'on-site', 'hybrid'], default: 'on-site' },
  skills: [{ type: String }],
  requirements: [{ type: String }],
  benefits: [{ type: String }],
  postedBy: { type: String, ref: 'User', required: true },
  applicants: [{
    user: { type: String, ref: 'User' },
    status: { type: String, enum: ['applied', 'reviewed', 'interviewed', 'offered', 'rejected'], default: 'applied' },
    appliedAt: { type: Date, default: Date.now },
    resume: { type: String } // resume file path
  }],
  savedBy: [{ type: String, ref: 'User' }],
  views: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  applicationDeadline: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Add indexes for better search performance
JobSchema.index({ title: 'text', description: 'text', company: 'text' });
JobSchema.index({ location: 1 });
JobSchema.index({ 'salary.min': 1, 'salary.max': 1 });
JobSchema.index({ skills: 1 });
JobSchema.index({ jobType: 1 });
JobSchema.index({ workType: 1 });

const Job = mongoose.model("Job", JobSchema);

export default Job;
