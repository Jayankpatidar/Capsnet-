import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    Briefcase, Users, MapPin, Calendar, Eye, Edit, Trash2,
    Download, MessageSquare, CheckCircle, XCircle, Clock, Star,
    Plus, Filter, Search, ChevronDown, MoreHorizontal, BarChart3
} from 'lucide-react'
import {
    fetchMyJobs,
    updateJobStatus,
    updateApplicationStatus,
    fetchJobs,
    postJob
} from '../features/jobs/jobsSlice'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const RecruiterDashboard = () => {
    const dispatch = useDispatch()
    const { myJobs, loading, error } = useSelector((state) => state.jobs)
    const currentUser = useSelector((state) => state.user.value)

    const [selectedJob, setSelectedJob] = useState(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [applicantFilters, setApplicantFilters] = useState({
        status: '',
        skills: '',
        experience: '',
        search: ''
    })

    const [activeTab, setActiveTab] = useState('jobs')
    const [showPostJobModal, setShowPostJobModal] = useState(false)
    const [jobForm, setJobForm] = useState({
        title: '',
        company: '',
        location: '',
        salaryMin: '',
        salaryMax: '',
        experience: '',
        jobType: 'full-time',
        workType: 'remote',
        description: '',
        requirements: '',
        skills: []
    })

    useEffect(() => {
        dispatch(fetchMyJobs())
    }, [dispatch])

    const handleJobStatusUpdate = async (jobId, isActive) => {
        try {
            await dispatch(updateJobStatus({ jobId, isActive })).unwrap()
            toast.success(`Job ${isActive ? 'activated' : 'deactivated'} successfully`)
        } catch (error) {
            toast.error(error.message || 'Failed to update job status')
        }
    }

    const handleApplicationStatusUpdate = async (jobId, userId, status) => {
        try {
            await dispatch(updateApplicationStatus({ jobId, userId, status })).unwrap()
            toast.success(`Application ${status} successfully`)
        } catch (error) {
            toast.error(error.message || 'Failed to update application status')
        }
    }

    const handlePostJob = async (e) => {
        e.preventDefault()
        try {
            const jobData = {
                ...jobForm,
                skills: jobForm.skills.filter(skill => skill.trim() !== '')
            }
            await dispatch(postJob(jobData)).unwrap()
            toast.success('Job posted successfully!')
            setShowPostJobModal(false)
            setJobForm({
                title: '',
                company: '',
                location: '',
                salaryMin: '',
                salaryMax: '',
                experience: '',
                jobType: 'full-time',
                workType: 'remote',
                description: '',
                requirements: '',
                skills: []
            })
        } catch (error) {
            toast.error(error.message || 'Failed to post job')
        }
    }

    const JobCard = ({ job }) => (
        <motion.div
            className='p-6 transition-all duration-300 cursor-pointer modern-card group hover:shadow-xl'
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={() => setSelectedJob(job)}
        >
            <div className='flex items-start justify-between mb-4'>
                <div className='flex-1 min-w-0'>
                    <h3 className='text-lg font-semibold truncate text-text-primary group-hover:text-primary'>
                        {job.title}
                    </h3>
                    <p className='font-medium text-text-secondary'>{job.company}</p>
                    <div className='flex items-center gap-4 mt-2 text-sm text-text-secondary'>
                        <div className='flex items-center gap-1'>
                            <MapPin className='w-4 h-4' />
                            {job.location}
                        </div>
                        <div className='flex items-center gap-1'>
                            <Users className='w-4 h-4' />
                            {job.applicants?.length || 0} applicants
                        </div>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        job.isActive ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                    }`}>
                        {job.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setSelectedJob(job)
                        }}
                        className='p-2 transition-colors rounded-full hover:bg-glass-border'
                    >
                        <MoreHorizontal className='w-4 h-4' />
                    </button>
                </div>
            </div>

            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4 text-sm text-text-secondary'>
                    <div className='flex items-center gap-1'>
                        <Calendar className='w-4 h-4' />
                        {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                    <div className='flex items-center gap-1'>
                        <Eye className='w-4 h-4' />
                        {job.views || 0} views
                    </div>
                </div>

                <div className='flex items-center gap-2'>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setSelectedJob(job)
                            setShowEditModal(true)
                        }}
                        className='p-2 transition-colors rounded-lg hover:bg-primary/10 text-primary'
                    >
                        <Edit className='w-4 h-4' />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            handleJobStatusUpdate(job._id, !job.isActive)
                        }}
                        className={`p-2 transition-colors rounded-lg ${
                            job.isActive
                                ? 'hover:bg-error/10 text-error'
                                : 'hover:bg-success/10 text-success'
                        }`}
                    >
                        {job.isActive ? <XCircle className='w-4 h-4' /> : <CheckCircle className='w-4 h-4' />}
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            // Handle delete job
                            toast.error('Delete functionality not implemented yet')
                        }}
                        className='p-2 transition-colors rounded-lg hover:bg-error/10 text-error'
                    >
                        <Trash2 className='w-4 h-4' />
                    </button>
                </div>
            </div>
        </motion.div>
    )

    const ApplicantCard = ({ applicant, jobId }) => (
        <motion.div
            className='p-6 transition-all duration-300 modern-card group hover:shadow-xl'
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <div className='flex items-start justify-between mb-4'>
                <div className='flex items-center gap-4'>
                    <img
                        src={applicant.profilePicture || '/default-avatar.png'}
                        alt={applicant.fullName}
                        className='w-12 h-12 rounded-full'
                    />
                    <div>
                        <h4 className='font-semibold text-text-primary'>{applicant.fullName}</h4>
                        <p className='text-sm text-text-secondary'>{applicant.email}</p>
                        <div className='flex items-center gap-2 mt-1'>
                            <span className='text-xs text-text-secondary'>
                                {applicant.experience} years exp
                            </span>
                            <span className='text-xs text-text-secondary'>
                                Applied {new Date(applicant.appliedAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
                <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                    applicant.status === 'shortlisted' ? 'bg-success/10 text-success' :
                    applicant.status === 'interviewed' ? 'bg-warning/10 text-warning' :
                    applicant.status === 'rejected' ? 'bg-error/10 text-error' :
                    'bg-primary/10 text-primary'
                }`}>
                    {applicant.status || 'pending'}
                </div>
            </div>

            <div className='mb-4'>
                <div className='flex flex-wrap gap-2'>
                    {applicant.skills?.slice(0, 3).map((skill, index) => (
                        <span
                            key={index}
                            className='px-3 py-1 text-xs font-medium rounded-full glass-border text-text-primary'
                        >
                            {skill}
                        </span>
                    ))}
                    {applicant.skills?.length > 3 && (
                        <span className='px-3 py-1 text-xs font-medium rounded-full glass-border text-text-secondary'>
                            +{applicant.skills.length - 3} more
                        </span>
                    )}
                </div>
            </div>

            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <button
                        onClick={() => {
                            // Handle resume download
                            toast.success('Resume download started')
                        }}
                        className='flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-primary/10 text-primary'
                    >
                        <Download className='w-4 h-4' />
                        Resume
                    </button>
                    <button
                        onClick={() => {
                            // Handle messaging
                            toast.success('Message sent')
                        }}
                        className='flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-primary/10 text-primary'
                    >
                        <MessageSquare className='w-4 h-4' />
                        Message
                    </button>
                </div>

                <div className='flex items-center gap-2'>
                    <button
                        onClick={() => handleApplicationStatusUpdate(jobId, applicant.userId, 'shortlisted')}
                        className='px-3 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-success hover:bg-success/90'
                    >
                        Shortlist
                    </button>
                    <button
                        onClick={() => handleApplicationStatusUpdate(jobId, applicant.userId, 'interview')}
                        className='px-3 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-warning hover:bg-warning/90'
                    >
                        Interview
                    </button>
                    <button
                        onClick={() => handleApplicationStatusUpdate(jobId, applicant.userId, 'rejected')}
                        className='px-3 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-error hover:bg-error/90'
                    >
                        Reject
                    </button>
                </div>
            </div>
        </motion.div>
    )

    const AnalyticsOverview = () => {
        const totalJobs = myJobs.length
        const activeJobs = myJobs.filter(job => job.isActive).length
        const totalApplications = myJobs.reduce((sum, job) => sum + (job.applicants?.length || 0), 0)
        const averageViews = totalJobs > 0 ? Math.round(myJobs.reduce((sum, job) => sum + (job.views || 0), 0) / totalJobs) : 0

        const metrics = [
            { label: 'Total Jobs', value: totalJobs, icon: Briefcase, color: 'text-primary' },
            { label: 'Active Jobs', value: activeJobs, icon: CheckCircle, color: 'text-success' },
            { label: 'Total Applications', value: totalApplications, icon: Users, color: 'text-warning' },
            { label: 'Average Views', value: averageViews, icon: Eye, color: 'text-accent' }
        ]

        return (
            <div className='grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4'>
                {metrics.map((metric, index) => (
                    <motion.div
                        key={metric.label}
                        className='p-6 modern-card'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-sm font-medium text-text-secondary'>{metric.label}</p>
                                <p className='text-3xl font-bold text-text-primary'>{metric.value}</p>
                            </div>
                            <metric.icon className={`w-8 h-8 ${metric.color}`} />
                        </div>
                    </motion.div>
                ))}
            </div>
        )
    }

    const PostJobModal = () => (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
            <motion.div
                className='w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-bg-primary rounded-2xl shadow-2xl'
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
            >
                <div className='p-6 border-b border-glass-border'>
                    <div className='flex items-center justify-between'>
                        <h2 className='text-xl font-semibold text-text-primary'>Post New Job</h2>
                        <button
                            onClick={() => setShowPostJobModal(false)}
                            className='p-2 transition-colors rounded-full hover:bg-glass-border'
                        >
                            <XCircle className='w-5 h-5' />
                        </button>
                    </div>
                </div>

                <form onSubmit={handlePostJob} className='p-6 space-y-6'>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                        <div>
                            <label className='block mb-2 text-sm font-medium text-text-primary'>Job Title</label>
                            <input
                                type='text'
                                value={jobForm.title}
                                onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                                className='w-full px-4 py-3 rounded-lg glass-input'
                                placeholder='e.g. Senior Software Engineer'
                                required
                            />
                        </div>
                        <div>
                            <label className='block mb-2 text-sm font-medium text-text-primary'>Company</label>
                            <input
                                type='text'
                                value={jobForm.company}
                                onChange={(e) => setJobForm({...jobForm, company: e.target.value})}
                                className='w-full px-4 py-3 rounded-lg glass-input'
                                placeholder='e.g. Tech Corp'
                                required
                            />
                        </div>
                    </div>

                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                        <div>
                            <label className='block mb-2 text-sm font-medium text-text-primary'>Location</label>
                            <input
                                type='text'
                                value={jobForm.location}
                                onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                                className='w-full px-4 py-3 rounded-lg glass-input'
                                placeholder='e.g. New York, NY'
                                required
                            />
                        </div>
                        <div>
                            <label className='block mb-2 text-sm font-medium text-text-primary'>Experience Level</label>
                            <select
                                value={jobForm.experience}
                                onChange={(e) => setJobForm({...jobForm, experience: e.target.value})}
                                className='w-full px-4 py-3 rounded-lg glass-input'
                                required
                            >
                                <option value=''>Select experience</option>
                                <option value='entry'>Entry Level (0-2 years)</option>
                                <option value='mid'>Mid Level (2-5 years)</option>
                                <option value='senior'>Senior Level (5-10 years)</option>
                                <option value='expert'>Expert Level (10+ years)</option>
                            </select>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                        <div>
                            <label className='block mb-2 text-sm font-medium text-text-primary'>Min Salary</label>
                            <input
                                type='number'
                                value={jobForm.salaryMin}
                                onChange={(e) => setJobForm({...jobForm, salaryMin: e.target.value})}
                                className='w-full px-4 py-3 rounded-lg glass-input'
                                placeholder='50000'
                            />
                        </div>
                        <div>
                            <label className='block mb-2 text-sm font-medium text-text-primary'>Max Salary</label>
                            <input
                                type='number'
                                value={jobForm.salaryMax}
                                onChange={(e) => setJobForm({...jobForm, salaryMax: e.target.value})}
                                className='w-full px-4 py-3 rounded-lg glass-input'
                                placeholder='80000'
                            />
                        </div>
                        <div>
                            <label className='block mb-2 text-sm font-medium text-text-primary'>Job Type</label>
                            <select
                                value={jobForm.jobType}
                                onChange={(e) => setJobForm({...jobForm, jobType: e.target.value})}
                                className='w-full px-4 py-3 rounded-lg glass-input'
                            >
                                <option value='full-time'>Full Time</option>
                                <option value='part-time'>Part Time</option>
                                <option value='contract'>Contract</option>
                                <option value='internship'>Internship</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className='block mb-2 text-sm font-medium text-text-primary'>Work Type</label>
                        <select
                            value={jobForm.workType}
                            onChange={(e) => setJobForm({...jobForm, workType: e.target.value})}
                            className='w-full px-4 py-3 rounded-lg glass-input'
                        >
                            <option value='remote'>Remote</option>
                            <option value='onsite'>On-site</option>
                            <option value='hybrid'>Hybrid</option>
                        </select>
                    </div>

                    <div>
                        <label className='block mb-2 text-sm font-medium text-text-primary'>Job Description</label>
                        <textarea
                            value={jobForm.description}
                            onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                            className='w-full px-4 py-3 rounded-lg glass-input'
                            rows={4}
                            placeholder='Describe the role, responsibilities, and what the candidate will be doing...'
                            required
                        />
                    </div>

                    <div>
                        <label className='block mb-2 text-sm font-medium text-text-primary'>Requirements</label>
                        <textarea
                            value={jobForm.requirements}
                            onChange={(e) => setJobForm({...jobForm, requirements: e.target.value})}
                            className='w-full px-4 py-3 rounded-lg glass-input'
                            rows={3}
                            placeholder='List the required skills, qualifications, and experience...'
                            required
                        />
                    </div>

                    <div>
                        <label className='block mb-2 text-sm font-medium text-text-primary'>Skills (Press Enter to add)</label>
                        <input
                            type='text'
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    const skill = e.target.value.trim()
                                    if (skill && !jobForm.skills.includes(skill)) {
                                        setJobForm({
                                            ...jobForm,
                                            skills: [...jobForm.skills, skill]
                                        })
                                        e.target.value = ''
                                    }
                                }
                            }}
                            className='w-full px-4 py-3 rounded-lg glass-input'
                            placeholder='e.g. JavaScript, React, Node.js'
                        />
                        <div className='flex flex-wrap gap-2 mt-2'>
                            {jobForm.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className='flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full glass-border text-text-primary'
                                >
                                    {skill}
                                    <button
                                        type='button'
                                        onClick={() => setJobForm({
                                            ...jobForm,
                                            skills: jobForm.skills.filter((_, i) => i !== index)
                                        })}
                                        className='text-text-secondary hover:text-error'
                                    >
                                        <XCircle className='w-4 h-4' />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className='flex items-center justify-end gap-4 pt-4 border-t border-glass-border'>
                        <button
                            type='button'
                            onClick={() => setShowPostJobModal(false)}
                            className='px-6 py-2 text-sm font-medium transition-colors rounded-lg text-text-secondary hover:bg-glass-border'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            className='px-6 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-primary hover:bg-primary/90'
                        >
                            Post Job
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )

    const tabs = [
        { id: 'jobs', label: 'My Jobs', icon: Briefcase },
        { id: 'applicants', label: 'Applicants', icon: Users },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 }
    ]

    return (
        <div className='min-h-screen bg-bg-primary'>
            {/* Header */}
            <div className='sticky top-0 z-40 border-b bg-bg-primary/80 backdrop-blur-lg border-glass-border'>
                <div className='px-4 py-4 mx-auto max-w-7xl'>
                    <div className='flex items-center justify-between mb-4'>
                        <h1 className='text-2xl font-bold text-text-primary'>Recruiter Dashboard</h1>
                        <button className='flex items-center gap-2 px-4 py-2 modern-button'>
                            <Plus className='w-4 h-4' />
                            Post New Job
                        </button>
                    </div>


                </div>
            </div>

            {/* Content */}
            <div className='px-4 py-6 mx-auto max-w-7xl'>
                {loading ? (
                    <div className='flex items-center justify-center py-12'>
                        <div className='w-8 h-8 border-b-2 rounded-full animate-spin border-primary'></div>
                    </div>
                ) : (
                    <>
                        {activeTab === 'jobs' && (
                            <>
                                <div className='flex items-center justify-between mb-6'>
                                    <h2 className='text-xl font-semibold text-text-primary'>My Posted Jobs</h2>
                                    <button
                                        onClick={() => setShowPostJobModal(true)}
                                        className='flex items-center gap-2 px-4 py-2 glass-button hover:bg-primary/10'
                                    >
                                        <Plus className='w-4 h-4' />
                                        Post New Job
                                    </button>
                                </div>

                                <motion.div
                                    className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'
                                    variants={{
                                        hidden: { opacity: 0 },
                                        show: {
                                            opacity: 1,
                                            transition: {
                                                staggerChildren: 0.1
                                            }
                                        }
                                    }}
                                    initial="hidden"
                                    animate="show"
                                >
                                    {myJobs.map((job) => (
                                        <JobCard key={job._id} job={job} />
                                    ))}
                                </motion.div>

                                {myJobs.length === 0 && (
                                    <div className='py-12 text-center'>
                                        <Briefcase className='w-16 h-16 mx-auto mb-4 text-text-secondary' />
                                        <h3 className='mb-2 text-xl font-semibold text-text-primary'>No jobs posted yet</h3>
                                        <p className='text-text-secondary'>Start by posting your first job opening</p>
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === 'applicants' && (
                            <>
                                <div className='flex items-center justify-between mb-6'>
                                    <h2 className='text-xl font-semibold text-text-primary'>Job Applicants</h2>
                                    <div className='flex items-center gap-4'>
                                        <div className='relative'>
                                            <Search className='absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-text-secondary' />
                                            <input
                                                type='text'
                                                placeholder='Search applicants...'
                                                value={applicantFilters.search}
                                                onChange={(e) => setApplicantFilters({...applicantFilters, search: e.target.value})}
                                                className='py-2 pl-10 pr-4 rounded-lg glass-input'
                                            />
                                        </div>
                                        <button className='flex items-center gap-2 px-4 py-2 glass-button hover:bg-primary/10'>
                                            <Filter className='w-4 h-4' />
                                            Filter
                                        </button>
                                    </div>
                                </div>

                                <div className='space-y-6'>
                                    {myJobs.map((job) => (
                                        job.applicants?.length > 0 && (
                                            <div key={job._id}>
                                                <h3 className='mb-4 font-semibold text-text-primary'>{job.title} - {job.applicants.length} applicants</h3>
                                                <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                                                    {job.applicants.map((applicant, index) => (
                                                        <ApplicantCard
                                                            key={index}
                                                            applicant={applicant}
                                                            jobId={job._id}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    ))}

                                    {myJobs.every(job => !job.applicants?.length) && (
                                        <div className='py-12 text-center'>
                                            <Users className='w-16 h-16 mx-auto mb-4 text-text-secondary' />
                                            <h3 className='mb-2 text-xl font-semibold text-text-primary'>No applicants yet</h3>
                                            <p className='text-text-secondary'>Applicants will appear here once they apply to your jobs</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {activeTab === 'analytics' && (
                            <>
                                <div className='mb-6'>
                                    <h2 className='text-xl font-semibold text-text-primary'>Analytics Overview</h2>
                                    <p className='text-text-secondary'>Track your recruitment performance and insights</p>
                                </div>

                                <AnalyticsOverview />

                                {/* Additional analytics charts can be added here */}
                                <div className='p-6 modern-card'>
                                    <h3 className='mb-4 text-lg font-semibold text-text-primary'>Job Performance</h3>
                                    <p className='text-text-secondary'>Detailed analytics charts will be implemented here</p>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Post Job Modal */}
            {showPostJobModal && <PostJobModal />}
        </div>
    )
}

export default RecruiterDashboard
