import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Plus, MapPin, Building, DollarSign, Briefcase, Search, Filter, Upload, TrendingUp, Star, Users, Award } from 'lucide-react'

const JobsHome = () => {
  const [jobs, setJobs] = useState([])
  const [showResumeModal, setShowResumeModal] = useState(false)
  const [resumeFile, setResumeFile] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [salaryRange, setSalaryRange] = useState('')
  const currentUser = useSelector((state) => state.user.value)

  const jobCategories = [
    { name: 'IT', icon: '💻', count: 1250 },
    { name: 'Fresher', icon: '🌱', count: 890 },
    { name: 'Work from Home', icon: '🏠', count: 650 },
    { name: 'Government', icon: '🏛️', count: 320 },
    { name: 'Sales', icon: '📈', count: 580 },
    { name: 'Marketing', icon: '📢', count: 420 }
  ]

  const topCompanies = [
    { name: 'Infosys', logo: '🏢', hiring: 45 },
    { name: 'TCS', logo: '🏢', hiring: 38 },
    { name: 'Amazon', logo: '📦', hiring: 52 },
    { name: 'Wipro', logo: '🏢', hiring: 29 },
    { name: 'Google', logo: '🔍', hiring: 67 },
    { name: 'Microsoft', logo: '💻', hiring: 41 }
  ]

  useEffect(() => {
    fetchJobs()
    // Timeout to prevent infinite loading if server is down
    const timeout = setTimeout(() => {
      setJobs([])
    }, 5000)
    return () => clearTimeout(timeout)
  }, [])

  const fetchJobs = async () => {
    try {
      const { data } = await api.get('/jobs/list')
      if (data.success) {
        setJobs(data.jobs || [])
      }
    } catch (error) {
      toast.error('Failed to fetch jobs')
    }
  }

  const handleResumeUpload = async (e) => {
    e.preventDefault()
    if (!resumeFile) {
      toast.error('Please select a resume file')
      return
    }

    const formData = new FormData()
    formData.append('resume', resumeFile)

    try {
      const { data } = await api.post('/user/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (data.success) {
        toast.success('Resume uploaded successfully!')
        setShowResumeModal(false)
        setResumeFile(null)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to upload resume')
    }
  }

  const handleApply = async (jobId) => {
    try {
      const { data } = await api.post('/jobs/apply', { jobId })
      if (data.success) {
        toast.success('Applied successfully!')
        fetchJobs()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to apply')
    }
  }

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <motion.div
      className='min-h-full p-6 md:p-8 lg:p-12 mobile-fix md:min-h-full'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Hero Section */}
      <motion.div
        className='mb-12'
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className='mb-8 text-center'>
          <h1 className='mb-4 text-4xl font-bold md:text-5xl text-text-primary'>
            Find Your Dream Job
          </h1>
          <p className='max-w-2xl mx-auto text-lg text-text-secondary'>
            Discover opportunities that match your skills and aspirations
          </p>
        </div>

        {/* Search Bar */}
        <motion.div
          className='max-w-4xl mx-auto mb-8'
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className='flex flex-col gap-4 md:flex-row'>
            <div className='relative flex-1'>
              <Search className='absolute w-5 h-5 transform -translate-y-1/2 left-4 top-1/2 text-text-secondary' />
              <input
                type='text'
                placeholder='Job title, company, or keywords'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full py-4 pl-12 pr-4 text-lg rounded-xl glass-input focus-ring'
              />
            </div>
            <div className='flex gap-2'>
              <motion.button
                className='flex items-center gap-2 px-6 py-4 modern-button'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Search className='w-5 h-5' />
                Search Jobs
              </motion.button>
              <motion.button
                onClick={() => setShowResumeModal(true)}
                className='flex items-center gap-2 px-6 py-4 glass-button hover:bg-primary/10'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Upload className='w-5 h-5' />
                Upload Resume
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Job Categories */}
      <motion.div
        className='mb-12'
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className='mb-6 text-2xl font-bold text-text-primary'>Popular Job Categories</h2>
        <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6'>
          {jobCategories.map((category, index) => (
            <motion.div
              key={category.name}
              className='p-4 text-center transition-all duration-300 cursor-pointer glass-card rounded-xl hover:shadow-lg'
              whileHover={{ scale: 1.05, y: -2 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className='mb-2 text-3xl'>{category.icon}</div>
              <h3 className='mb-1 font-semibold text-text-primary'>{category.name}</h3>
              <p className='text-sm text-text-secondary'>{category.count} jobs</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Top Companies */}
      <motion.div
        className='mb-12'
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className='mb-6 text-2xl font-bold text-text-primary'>Top Companies Hiring</h2>
        <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6'>
          {topCompanies.map((company, index) => (
            <motion.div
              key={company.name}
              className='p-4 text-center transition-all duration-300 cursor-pointer glass-card rounded-xl hover:shadow-lg'
              whileHover={{ scale: 1.05, y: -2 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className='mb-2 text-3xl'>{company.logo}</div>
              <h3 className='mb-1 font-semibold text-text-primary'>{company.name}</h3>
              <div className='flex items-center justify-center gap-1 text-sm text-success'>
                <TrendingUp className='w-4 h-4' />
                {company.hiring} hiring
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recommended Jobs */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-2xl font-bold text-text-primary'>Recommended for You</h2>
          <motion.button
            className='flex items-center gap-2 px-4 py-2 glass-button hover:bg-primary/10'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Filter className='w-4 h-4' />
            Filter
          </motion.button>
        </div>

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {filteredJobs.slice(0, 6).map((job, index) => (
            <motion.div
              key={job._id}
              className='p-6 transition-all duration-300 glass-card rounded-xl hover:shadow-lg'
              whileHover={{ scale: 1.02, y: -2 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className='flex items-start justify-between mb-4'>
                <div className='flex items-center gap-3'>
                  <div className='flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10'>
                    <Building className='w-6 h-6 text-primary' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-text-primary'>{job.title}</h3>
                    <p className='text-text-secondary'>{job.company}</p>
                  </div>
                </div>
                <div className='flex items-center gap-1 text-yellow-500'>
                  <Star className='w-4 h-4 fill-current' />
                  <span className='text-sm'>4.5</span>
                </div>
              </div>

              <div className='mb-4 space-y-2'>
                <div className='flex items-center gap-2 text-text-secondary'>
                  <MapPin className='w-4 h-4' />
                  <span className='text-sm'>{job.location}</span>
                </div>
                <div className='flex items-center gap-2 text-text-secondary'>
                  <DollarSign className='w-4 h-4' />
                  <span className='text-sm'>{job.salary}</span>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2 text-text-secondary'>
                  <Users className='w-4 h-4' />
                  <span className='text-sm'>12 applicants</span>
                </div>
                <motion.button
                  onClick={() => handleApply(job._id)}
                  className='px-4 py-2 text-sm modern-button'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Apply Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Resume Upload Modal */}
      {showResumeModal && (
        <motion.div
          className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className='w-full max-w-md p-8 glass-card rounded-2xl'
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h3 className='mb-4 text-xl font-bold text-text-primary'>Upload Your Resume</h3>
            <p className='mb-6 text-text-secondary'>
              Get personalized job recommendations and apply faster
            </p>

            <form onSubmit={handleResumeUpload}>
              <div className='mb-6'>
                <label className='block mb-2 text-sm font-medium text-text-primary'>
                  Resume File
                </label>
                <input
                  type='file'
                  accept='.pdf,.doc,.docx'
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className='w-full p-3 rounded-lg glass-input file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80'
                  required
                />
                <p className='mt-2 text-xs text-text-secondary'>
                  Supported formats: PDF, DOC, DOCX (Max 5MB)
                </p>
              </div>

              <div className='flex gap-3'>
                <motion.button
                  type='button'
                  onClick={() => setShowResumeModal(false)}
                  className='flex-1 px-6 py-3 font-medium rounded-xl glass-button hover:bg-gray-100 dark:hover:bg-gray-700 text-text-primary'
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type='submit'
                  className='flex-1 px-6 py-3 font-semibold text-white modern-button'
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Upload
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
      {/* Debug: Add visible content */}
      <div className="text-black dark:text-white">Jobs Home Page End</div>
    </motion.div>
  )
}

export default JobsHome
