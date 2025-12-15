import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    Search, MapPin, DollarSign, Briefcase, Clock, Bookmark, BookmarkCheck,
    Filter, X, ChevronLeft, ChevronRight, ExternalLink, Users, Star
} from 'lucide-react'
import {
    fetchJobs,
    fetchSavedJobs,
    fetchAppliedJobs,
    saveJob,
    applyForJob,
    setFilters,
    clearFilters
} from '../features/jobs/jobsSlice'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const Jobs = () => {
    const dispatch = useDispatch()
    const {
        jobs,
        savedJobs,
        appliedJobs,
        loading,
        pagination,
        filters
    } = useSelector((state) => state.jobs)

    const [showFilters, setShowFilters] = useState(false)
    const [selectedJob, setSelectedJob] = useState(null)
    const [activeTab, setActiveTab] = useState('browse')

    useEffect(() => {
        if (activeTab === 'browse') {
            dispatch(fetchJobs({ page: pagination.currentPage, ...filters }))
        } else if (activeTab === 'saved') {
            dispatch(fetchSavedJobs())
        } else if (activeTab === 'applied') {
            dispatch(fetchAppliedJobs())
        }
    }, [dispatch, activeTab, pagination.currentPage, filters])

    const handleSaveJob = async (jobId) => {
        try {
            await dispatch(saveJob(jobId)).unwrap()
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleApplyJob = async (jobId) => {
        try {
            await dispatch(applyForJob({ jobId })).unwrap()
        } catch (error) {
            toast.error(error.message)
        }
    }

    const isJobSaved = (jobId) => {
        return savedJobs.some(job => job._id === jobId)
    }

    const isJobApplied = (jobId) => {
        return appliedJobs.some(job => job._id === jobId)
    }

    const formatSalary = (salary) => {
        if (!salary) return 'Not specified'
        const { min, max, currency, period } = salary
        const periodText = period === 'yearly' ? '/year' : period === 'monthly' ? '/month' : '/hour'
        return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()} ${periodText}`
    }

    const JobCard = ({ job, showSaveButton = true }) => (
        <motion.div
            className='cursor-pointer modern-card group'
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={() => setSelectedJob(job)}
        >
            <div className='p-6'>
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
                                <DollarSign className='w-4 h-4' />
                                {formatSalary(job.salary)}
                            </div>
                        </div>
                    </div>
                    {showSaveButton && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                handleSaveJob(job._id)
                            }}
                            className='p-2 transition-colors rounded-full hover:bg-glass-border'
                        >
                            {isJobSaved(job._id) ? (
                                <BookmarkCheck className='w-5 h-5 text-primary' />
                            ) : (
                                <Bookmark className='w-5 h-5 text-text-secondary' />
                            )}
                        </button>
                    )}
                </div>

                <p className='mb-4 text-text-secondary line-clamp-2'>
                    {job.description}
                </p>

                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <span className='px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary'>
                            {job.jobType}
                        </span>
                        <span className='px-2 py-1 text-xs font-medium rounded-full bg-accent/10 text-accent'>
                            {job.workType}
                        </span>
                        {job.matchPercentage && (
                            <span className='px-2 py-1 text-xs font-medium rounded-full bg-success/10 text-success'>
                                {job.matchPercentage}% match
                            </span>
                        )}
                    </div>

                    <div className='flex items-center gap-2'>
                        <span className='text-xs text-text-secondary'>
                            {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                        {activeTab === 'browse' && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleApplyJob(job._id)
                                }}
                                disabled={isJobApplied(job._id)}
                                className='px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {isJobApplied(job._id) ? 'Applied' : 'Apply Now'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    )

    const FilterSidebar = () => (
        <motion.div
            initial={{ x: -300 }}
            animate={{ x: showFilters ? 0 : -300 }}
            className='fixed top-0 left-0 z-50 h-full overflow-y-auto border-r w-80 bg-bg-primary border-glass-border'
        >
            <div className='p-6'>
                <div className='flex items-center justify-between mb-6'>
                    <h2 className='text-xl font-semibold'>Filters</h2>
                    <button
                        onClick={() => setShowFilters(false)}
                        className='p-2 rounded-full hover:bg-glass-border'
                    >
                        <X className='w-5 h-5' />
                    </button>
                </div>

                <div className='space-y-6'>
                    <div>
                        <label className='block mb-2 text-sm font-medium'>Search</label>
                        <input
                            type='text'
                            value={filters.search}
                            onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
                            placeholder='Job title, company...'
                            className='w-full px-3 py-2 rounded-lg glass-input'
                        />
                    </div>

                    <div>
                        <label className='block mb-2 text-sm font-medium'>Location</label>
                        <input
                            type='text'
                            value={filters.location}
                            onChange={(e) => dispatch(setFilters({ location: e.target.value }))}
                            placeholder='City, state, or remote'
                            className='w-full px-3 py-2 rounded-lg glass-input'
                        />
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label className='block mb-2 text-sm font-medium'>Min Salary</label>
                            <input
                                type='number'
                                value={filters.salaryMin}
                                onChange={(e) => dispatch(setFilters({ salaryMin: e.target.value }))}
                                placeholder='0'
                                className='w-full px-3 py-2 rounded-lg glass-input'
                            />
                        </div>
                        <div>
                            <label className='block mb-2 text-sm font-medium'>Max Salary</label>
                            <input
                                type='number'
                                value={filters.salaryMax}
                                onChange={(e) => dispatch(setFilters({ salaryMax: e.target.value }))}
                                placeholder='200000'
                                className='w-full px-3 py-2 rounded-lg glass-input'
                            />
                        </div>
                    </div>

                    <div>
                        <label className='block mb-2 text-sm font-medium'>Experience Level</label>
                        <select
                            value={filters.experience}
                            onChange={(e) => dispatch(setFilters({ experience: e.target.value }))}
                            className='w-full px-3 py-2 rounded-lg glass-input'
                        >
                            <option value=''>Any Experience</option>
                            <option value='0-1'>Entry Level (0-1 years)</option>
                            <option value='1-3'>Junior (1-3 years)</option>
                            <option value='3-5'>Mid Level (3-5 years)</option>
                            <option value='5-10'>Senior (5-10 years)</option>
                            <option value='10+'>Executive (10+ years)</option>
                        </select>
                    </div>

                    <div>
                        <label className='block mb-2 text-sm font-medium'>Job Type</label>
                        <select
                            value={filters.jobType}
                            onChange={(e) => dispatch(setFilters({ jobType: e.target.value }))}
                            className='w-full px-3 py-2 rounded-lg glass-input'
                        >
                            <option value=''>Any Type</option>
                            <option value='full-time'>Full Time</option>
                            <option value='part-time'>Part Time</option>
                            <option value='contract'>Contract</option>
                            <option value='internship'>Internship</option>
                            <option value='freelance'>Freelance</option>
                        </select>
                    </div>

                    <div>
                        <label className='block mb-2 text-sm font-medium'>Work Type</label>
                        <select
                            value={filters.workType}
                            onChange={(e) => dispatch(setFilters({ workType: e.target.value }))}
                            className='w-full px-3 py-2 rounded-lg glass-input'
                        >
                            <option value=''>Any</option>
                            <option value='remote'>Remote</option>
                            <option value='on-site'>On-site</option>
                            <option value='hybrid'>Hybrid</option>
                        </select>
                    </div>

                    <div className='flex gap-3'>
                        <button
                            onClick={() => {
                                dispatch(clearFilters())
                                setShowFilters(false)
                            }}
                            className='flex-1 px-4 py-2 transition-colors rounded-lg bg-glass-border text-text-primary hover:bg-glass-border/80'
                        >
                            Clear All
                        </button>
                        <button
                            onClick={() => setShowFilters(false)}
                            className='flex-1 px-4 py-2 text-white transition-colors rounded-lg bg-primary hover:bg-primary/90'
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )

    const JobDetailsModal = () => {
        if (!selectedJob) return null

        return (
            <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50'>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className='bg-bg-primary rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'
                >
                    <div className='p-6'>
                        <div className='flex items-start justify-between mb-6'>
                            <div>
                                <h2 className='mb-2 text-2xl font-bold text-text-primary'>
                                    {selectedJob.title}
                                </h2>
                                <p className='mb-2 text-lg text-text-secondary'>{selectedJob.company}</p>
                                <div className='flex items-center gap-4 text-sm text-text-secondary'>
                                    <div className='flex items-center gap-1'>
                                        <MapPin className='w-4 h-4' />
                                        {selectedJob.location}
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <DollarSign className='w-4 h-4' />
                                        {formatSalary(selectedJob.salary)}
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <Clock className='w-4 h-4' />
                                        {new Date(selectedJob.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedJob(null)}
                                className='p-2 rounded-full hover:bg-glass-border'
                            >
                                <X className='w-5 h-5' />
                            </button>
                        </div>

                        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
                            <div className='space-y-6 lg:col-span-2'>
                                <div>
                                    <h3 className='mb-3 text-lg font-semibold'>Job Description</h3>
                                    <p className='leading-relaxed text-text-secondary'>
                                        {selectedJob.description}
                                    </p>
                                </div>

                                {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                                    <div>
                                        <h3 className='mb-3 text-lg font-semibold'>Requirements</h3>
                                        <ul className='space-y-2'>
                                            {selectedJob.requirements.map((req, index) => (
                                                <li key={index} className='flex items-start gap-2 text-text-secondary'>
                                                    <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0' />
                                                    {req}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                                    <div>
                                        <h3 className='mb-3 text-lg font-semibold'>Benefits</h3>
                                        <ul className='space-y-2'>
                                            {selectedJob.benefits.map((benefit, index) => (
                                                <li key={index} className='flex items-start gap-2 text-text-secondary'>
                                                    <Star className='w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0' />
                                                    {benefit}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className='space-y-4'>
                                <div className='p-4 rounded-lg bg-glass-border'>
                                    <h4 className='mb-3 font-semibold'>Job Details</h4>
                                    <div className='space-y-2 text-sm'>
                                        <div className='flex justify-between'>
                                            <span className='text-text-secondary'>Job Type:</span>
                                            <span className='font-medium'>{selectedJob.jobType}</span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-text-secondary'>Work Type:</span>
                                            <span className='font-medium'>{selectedJob.workType}</span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-text-secondary'>Experience:</span>
                                            <span className='font-medium'>
                                                {selectedJob.experience.min}-{selectedJob.experience.max} years
                                            </span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-text-secondary'>Applications:</span>
                                            <span className='font-medium'>{selectedJob.applicants?.length || 0}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className='space-y-3'>
                                    <button
                                        onClick={() => handleSaveJob(selectedJob._id)}
                                        className='flex items-center justify-center w-full gap-2 px-4 py-3 transition-colors border rounded-lg border-glass-border hover:bg-glass-border'
                                    >
                                        {isJobSaved(selectedJob._id) ? (
                                            <>
                                                <BookmarkCheck className='w-5 h-5 text-primary' />
                                                Saved
                                            </>
                                        ) : (
                                            <>
                                                <Bookmark className='w-5 h-5' />
                                                Save Job
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => handleApplyJob(selectedJob._id)}
                                        disabled={isJobApplied(selectedJob._id)}
                                        className='w-full px-4 py-3 font-medium text-white transition-colors rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed'
                                    >
                                        {isJobApplied(selectedJob._id) ? 'Already Applied' : 'Apply Now'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-bg-primary'>
            {/* Header */}
            <div className='sticky top-0 z-40 border-b bg-bg-primary/80 backdrop-blur-lg border-glass-border'>
                <div className='px-4 py-4 mx-auto max-w-7xl'>
                    <div className='flex items-center justify-between mb-4'>
                        <h1 className='text-2xl font-bold text-text-primary'>Jobs</h1>
                        <button
                            onClick={() => setShowFilters(true)}
                            className='flex items-center gap-2 px-4 py-2 transition-colors rounded-lg bg-glass-border hover:bg-glass-border/80'
                        >
                            <Filter className='w-4 h-4' />
                            Filters
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className='flex gap-1 p-1 rounded-lg bg-glass-border'>
                        {[
                            { id: 'browse', label: 'Browse Jobs', icon: Search },
                            { id: 'saved', label: 'Saved Jobs', icon: Bookmark },
                            { id: 'applied', label: 'Applied Jobs', icon: Briefcase }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    activeTab === tab.id
                                        ? 'bg-primary text-white'
                                        : 'text-text-secondary hover:text-text-primary'
                                }`}
                            >
                                <tab.icon className='w-4 h-4' />
                                {tab.label}
                            </button>
                        ))}
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
                        {/* Job Grid */}
                        <motion.div
                            className='grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3'
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
                            {(activeTab === 'browse' ? jobs : activeTab === 'saved' ? savedJobs : appliedJobs).map((job) => (
                                <JobCard key={job._id} job={job} showSaveButton={activeTab === 'browse'} />
                            ))}
                        </motion.div>

                        {/* Pagination */}
                        {activeTab === 'browse' && pagination.totalPages > 1 && (
                            <div className='flex items-center justify-center gap-2'>
                                <button
                                    onClick={() => dispatch(setCurrentPage(pagination.currentPage - 1))}
                                    disabled={!pagination.hasPrev}
                                    className='p-2 rounded-lg bg-glass-border hover:bg-glass-border/80 disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    <ChevronLeft className='w-5 h-5' />
                                </button>

                                <span className='px-4 py-2 text-text-secondary'>
                                    Page {pagination.currentPage} of {pagination.totalPages}
                                </span>

                                <button
                                    onClick={() => dispatch(setCurrentPage(pagination.currentPage + 1))}
                                    disabled={!pagination.hasNext}
                                    className='p-2 rounded-lg bg-glass-border hover:bg-glass-border/80 disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    <ChevronRight className='w-5 h-5' />
                                </button>
                            </div>
                        )}

                        {/* Empty State */}
                        {(activeTab === 'browse' ? jobs : activeTab === 'saved' ? savedJobs : appliedJobs).length === 0 && !loading && (
                            <div className='py-12 text-center'>
                                <Briefcase className='w-16 h-16 mx-auto mb-4 text-text-secondary' />
                                <h3 className='mb-2 text-xl font-semibold text-text-primary'>No jobs found</h3>
                                <p className='text-text-secondary'>
                                    {activeTab === 'browse' && 'Try adjusting your filters or search terms'}
                                    {activeTab === 'saved' && 'You haven\'t saved any jobs yet'}
                                    {activeTab === 'applied' && 'You haven\'t applied to any jobs yet'}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modals */}
            <FilterSidebar />
            <JobDetailsModal />

            {/* Overlay for mobile filters */}
            {showFilters && (
                <div
                    className='fixed inset-0 z-40 bg-black/50 lg:hidden'
                    onClick={() => setShowFilters(false)}
                />
            )}
        </div>
    )
}

export default Jobs
