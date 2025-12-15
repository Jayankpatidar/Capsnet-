import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import {
  User,
  Briefcase,
  TrendingUp,
  Award,
  Upload,
  Target,
  Eye,
  Users,
  Calendar,
  MapPin,
  GraduationCap,
  Star,
  CheckCircle,
  Plus,
  Edit,
  BarChart3,
  MessageCircle,
  Heart,
  Share2
} from 'lucide-react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { fetchConnections } from '../features/connections/connectionsSlice'

const ProfessionalDashboard = () => {
  const user = useSelector((state) => state.user.value)
  const dispatch = useDispatch()
  const { pendingConnections } = useSelector((state) => state.connections)
  const [profileCompletion, setProfileCompletion] = useState(75)
  const [resumeScore, setResumeScore] = useState(85)
  const [showResumeUpload, setShowResumeUpload] = useState(false)
  const [resumeFile, setResumeFile] = useState(null)
  const [skills, setSkills] = useState(['React', 'JavaScript', 'Node.js', 'Python'])
  const [endorsements, setEndorsements] = useState({})

  useEffect(() => {
    dispatch(fetchConnections())
  }, [dispatch])

  const profileSections = [
    { name: 'Profile Photo', completed: !!user?.profile_picture, weight: 15 },
    { name: 'Bio', completed: !!user?.bio, weight: 10 },
    { name: 'Skills', completed: skills.length > 0, weight: 15 },
    { name: 'Experience', completed: true, weight: 20 },
    { name: 'Education', completed: true, weight: 15 },
    { name: 'Resume', completed: resumeScore > 0, weight: 25 }
  ]

  const experience = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      period: '2022 - Present',
      description: 'Led development of multiple React applications serving 100K+ users',
      skills: ['React', 'TypeScript', 'Redux']
    },
    {
      id: 2,
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      location: 'New York, NY',
      period: '2020 - 2022',
      description: 'Built scalable web applications using MERN stack',
      skills: ['Node.js', 'MongoDB', 'Express']
    }
  ]

  const certifications = [
    { name: 'AWS Certified Developer', issuer: 'Amazon Web Services', date: '2023' },
    { name: 'React Advanced Certification', issuer: 'Meta', date: '2022' },
    { name: 'MongoDB Certified Developer', issuer: 'MongoDB Inc.', date: '2021' }
  ]

  const profileInsights = [
    { label: 'Profile Views', value: '247', change: '+12%', icon: Eye },
    { label: 'Search Appearances', value: '89', change: '+8%', icon: TrendingUp },
    { label: 'Connection Requests', value: pendingConnections?.length || 0, change: '+5%', icon: Users }
  ]

  const handleResumeUpload = async (e) => {
    e.preventDefault()
    if (!resumeFile) return

    try {
      const formData = new FormData()
      formData.append('resume', resumeFile)

      const response = await api.post('/api/user/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (response.data.success) {
        toast.success('Resume uploaded and analyzed successfully!')
        setResumeFile(null)
        setShowResumeUpload(false)
        // Update resume score if provided in response
        if (response.data.resumeScore) {
          setResumeScore(response.data.resumeScore)
        }
      }
    } catch (error) {
      toast.error('Failed to upload resume')
      console.error('Resume upload error:', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-6 bg-bg-primary"
    > 
      <div className="mx-auto space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Professional Dashboard</h1>
            <p className="mt-1 text-text-secondary">Manage your professional profile and career growth</p>
          </div>
          <motion.button
            onClick={() => setShowResumeUpload(true)}
            className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-colors bg-primary rounded-xl hover:bg-primary/90"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Upload className="w-5 h-5" />
            Upload Resume
          </motion.button>
        </div>

        {/* Profile Completion */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 border bg-bg-secondary rounded-2xl border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-text-primary">Profile Completion</h2>
            <span className="text-2xl font-bold text-primary">{profileCompletion}%</span>
          </div>
          <div className="w-full h-3 mb-4 rounded-full bg-bg-primary">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${profileCompletion}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className="h-3 rounded-full bg-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {profileSections.map((section, index) => (
              <motion.div
                key={section.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`p-3 rounded-xl border-2 ${
                  section.completed ? 'border-success bg-success/10' : 'border-border bg-bg-primary'
                }`}
              >
                <div className="flex items-center gap-2">
                  {section.completed ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <div className="w-5 h-5 border-2 rounded-full border-border" />
                  )}
                  <span className="text-sm font-medium text-text-primary">{section.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Resume Score */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 border bg-bg-secondary rounded-2xl border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-text-primary">Resume Score</h2>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">{resumeScore}%</span>
              <Award className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="w-full h-3 mb-4 rounded-full bg-bg-primary">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${resumeScore}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-3 rounded-full bg-primary"
            />
          </div>
          <p className="text-sm text-text-secondary">
            Your resume is performing well! Consider adding more quantifiable achievements to reach 100%.
          </p>
        </motion.div>

        {/* Profile Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 border bg-bg-secondary rounded-2xl border-border"
        >
          <h2 className="mb-6 text-xl font-semibold text-text-primary">Profile Insights</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {profileInsights.map((insight, index) => (
              <motion.div
                key={insight.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="p-4 transition-shadow border bg-bg-primary rounded-xl border-border hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <insight.icon className="w-8 h-8 text-primary" />
                  <span className={`text-sm font-medium ${
                    insight.change.startsWith('+') ? 'text-success' : 'text-error'
                  }`}>
                    {insight.change}
                  </span>
                </div>
                <div className="mb-1 text-2xl font-bold text-text-primary">{insight.value}</div>
                <div className="text-sm text-text-secondary">{insight.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Skills & Endorsements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 border bg-bg-secondary rounded-2xl border-border"
        >
          <h2 className="mb-6 text-xl font-semibold text-text-primary">Skills & Endorsements</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {skills.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-4 text-center transition-shadow border bg-bg-primary rounded-xl border-border hover:shadow-md"
              >
                <div className="mb-1 text-lg font-semibold text-text-primary">{skill}</div>
                <div className="text-sm text-text-secondary">
                  {endorsements[skill] || 0} endorsements
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Experience */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 border bg-bg-secondary rounded-2xl border-border"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-primary">Experience</h2>
            <motion.button
              className="flex items-center gap-2 px-4 py-2 font-medium text-white transition-colors rounded-lg bg-primary hover:bg-primary/90"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4" />
              Add Experience
            </motion.button>
          </div>
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-6 transition-shadow border bg-bg-primary rounded-xl border-border hover:shadow-md"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">{exp.title}</h3>
                    <p className="font-medium text-primary">{exp.company}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-text-secondary">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {exp.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {exp.period}
                      </span>
                    </div>
                  </div>
                  <motion.button
                    className="p-2 transition-colors rounded-lg hover:bg-bg-secondary"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit className="w-5 h-5 text-text-secondary" />
                  </motion.button>
                </div>
                <p className="mb-4 text-text-secondary">{exp.description}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 border bg-bg-secondary rounded-2xl border-border"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-primary">Certifications</h2>
            <motion.button
              className="flex items-center gap-2 px-4 py-2 font-medium text-white transition-colors rounded-lg bg-primary hover:bg-primary/90"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4" />
              Add Certification
            </motion.button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="p-4 transition-shadow border bg-bg-primary rounded-xl border-border hover:shadow-md"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Award className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-text-primary">{cert.name}</h3>
                    <p className="text-sm text-text-secondary">{cert.issuer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-text-secondary">
                  <Calendar className="w-4 h-4" />
                  {cert.date}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Resume Upload Modal */}
      {showResumeUpload && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowResumeUpload(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md p-6 border bg-bg-secondary rounded-2xl border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-text-primary">Upload Resume</h3>
              <motion.button
                onClick={() => setShowResumeUpload(false)}
                className="p-2 transition-colors rounded-lg hover:bg-bg-primary"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>
            </div>

            <form onSubmit={handleResumeUpload} className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-text-primary">
                  Choose Resume File
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="w-full modern-input"
                  required
                />
                <p className="mt-1 text-xs text-text-secondary">Supported formats: PDF, DOC, DOCX (Max 5MB)</p>
              </div>

              <div className="p-4 bg-primary/10 rounded-xl">
                <h4 className="mb-2 font-semibold text-text-primary">AI Analysis Includes:</h4>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    Skills extraction and scoring
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    Experience analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    Job match recommendations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    Improvement suggestions
                  </li>
                </ul>
              </div>

              <div className="flex gap-3 mt-8">
                <motion.button
                  type="button"
                  onClick={() => setShowResumeUpload(false)}
                  className="flex-1 px-6 py-3 font-medium rounded-xl glass-button hover:bg-gray-100 dark:hover:bg-gray-700 text-text-primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  className="flex-1 px-6 py-3 font-semibold text-white modern-button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Analyze Resume
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default ProfessionalDashboard
