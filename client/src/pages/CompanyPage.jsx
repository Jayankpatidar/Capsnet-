import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Building2,
  MapPin,
  Globe,
  Users,
  Calendar,
  Briefcase,
  Eye,
  Heart,
  Plus,
  Settings,
  BarChart3,
  UserPlus,
  UserMinus,
  Share2,
  MessageSquare
} from 'lucide-react'
import {
  getCompanyProfile,
  followCompany,
  getMyCompany
} from '../features/company/companySlice'
import { getCompanyAnalytics } from '../features/company/companySlice'
import toast from 'react-hot-toast'

const CompanyPage = () => {
  const { companyId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { currentCompany, myCompany, loading } = useSelector(state => state.company)
  const currentUser = useSelector(state => state.user.value)

  const [activeTab, setActiveTab] = useState('overview')
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    if (companyId) {
      dispatch(getCompanyProfile(companyId))
    }
  }, [companyId, dispatch])

  useEffect(() => {
    if (currentUser) {
      dispatch(getMyCompany())
    }
  }, [currentUser, dispatch])

  const handleFollow = async () => {
    if (!currentUser) {
      toast.error('Please login to follow companies')
      return
    }

    try {
      await dispatch(followCompany(companyId)).unwrap()
    } catch (error) {
      toast.error(error)
    }
  }

  const handleViewAnalytics = async () => {
    if (!currentCompany) return

    try {
      const result = await dispatch(getCompanyAnalytics(companyId)).unwrap()
      setAnalytics(result)
      setActiveTab('analytics')
    } catch (error) {
      toast.error('Failed to load analytics')
    }
  }

  const isOwner = currentCompany && currentUser && currentCompany.owner_id === currentUser._id
  const isFollowing = currentCompany && currentUser && currentCompany.followers.includes(currentUser._id)

  if (loading) {
    return (
      <div className="max-w-6xl p-6 mx-auto">
        <div className="animate-pulse">
          <div className="h-64 mb-6 bg-gray-300 rounded-lg"></div>
          <div className="w-1/3 h-8 mb-4 bg-gray-300 rounded"></div>
          <div className="w-1/2 h-4 mb-2 bg-gray-300 rounded"></div>
          <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    )
  }

  if (!currentCompany) {
    return (
      <div className="max-w-6xl p-6 mx-auto">
        <div className="py-12 text-center">
          <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h2 className="mb-2 text-xl font-semibold text-gray-900">Company Not Found</h2>
          <p className="text-gray-600">The company you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl p-6 mx-auto">
      {/* Cover Image */}
      <div className="relative h-64 mb-6 overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
        {currentCompany.cover_image && (
          <img
            src={currentCompany.cover_image}
            alt="Company cover"
            className="object-cover w-full h-full"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>

        {/* Company Logo */}
        <div className="absolute -bottom-8 left-6">
          <div className="flex items-center justify-center w-24 h-24 overflow-hidden bg-white rounded-lg shadow-lg">
            {currentCompany.logo ? (
              <img
                src={currentCompany.logo}
                alt="Company logo"
                className="object-cover w-full h-full"
              />
            ) : (
              <Building2 className="w-12 h-12 text-gray-400" />
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute flex gap-2 top-4 right-4">
          {isOwner ? (
            <button
              onClick={() => navigate('/company/edit')}
              className="flex items-center gap-2 px-4 py-2 font-medium text-gray-900 bg-white rounded-lg hover:bg-gray-50"
            >
              <Settings className="w-4 h-4" />
              Edit Company
            </button>
          ) : (
            <button
              onClick={handleFollow}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                isFollowing
                  ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  : 'bg-white text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFollowing ? 'fill-current text-red-500' : ''}`} />
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
          <button className="flex items-center gap-2 px-4 py-2 font-medium text-gray-900 bg-white rounded-lg hover:bg-gray-50">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>

      {/* Company Header */}
      <div className="mb-6 ml-32">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">{currentCompany.name}</h1>
            <div className="flex items-center gap-4 mb-3 text-gray-600">
              <div className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                <span>{currentCompany.industry}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{currentCompany.location}</span>
              </div>
              {currentCompany.website && (
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <a
                    href={currentCompany.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Website
                  </a>
                </div>
              )}
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{currentCompany.follower_count} followers</span>
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                <span>{currentCompany.jobs?.length || 0} jobs</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{currentCompany.profile_views} views</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex gap-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'posts', label: 'Posts' },
            { id: 'jobs', label: 'Jobs' },
            { id: 'team', label: 'Team' },
            ...(isOwner ? [{ id: 'analytics', label: 'Analytics' }] : [])
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                if (tab.id === 'analytics' && !analytics) {
                  handleViewAnalytics()
                }
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* About */}
              <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="mb-4 text-lg font-semibold">About</h3>
                <p className="mb-4 text-gray-700">{currentCompany.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  {currentCompany.founded_year && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">Founded {currentCompany.founded_year}</span>
                    </div>
                  )}
                  {currentCompany.company_size && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{currentCompany.company_size} employees</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Mission & Vision */}
              {(currentCompany.mission || currentCompany.vision) && (
                <div className="p-6 bg-white rounded-lg shadow">
                  <h3 className="mb-4 text-lg font-semibold">Mission & Vision</h3>
                  {currentCompany.mission && (
                    <div className="mb-4">
                      <h4 className="mb-2 font-medium text-gray-900">Mission</h4>
                      <p className="text-gray-700">{currentCompany.mission}</p>
                    </div>
                  )}
                  {currentCompany.vision && (
                    <div>
                      <h4 className="mb-2 font-medium text-gray-900">Vision</h4>
                      <p className="text-gray-700">{currentCompany.vision}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Values */}
              {currentCompany.values && currentCompany.values.length > 0 && (
                <div className="p-6 bg-white rounded-lg shadow">
                  <h3 className="mb-4 text-lg font-semibold">Our Values</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentCompany.values.map((value, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="flex items-center justify-center w-full gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </button>
                  {isOwner && (
                    <>
                      <button
                        onClick={() => navigate('/company/post')}
                        className="flex items-center justify-center w-full gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                      >
                        <Plus className="w-4 h-4" />
                        Create Post
                      </button>
                      <button
                        onClick={() => navigate('/company/job')}
                        className="flex items-center justify-center w-full gap-2 px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700"
                      >
                        <Briefcase className="w-4 h-4" />
                        Post Job
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Team Members */}
              {currentCompany.team_members && currentCompany.team_members.length > 0 && (
                <div className="p-6 bg-white rounded-lg shadow">
                  <h3 className="mb-4 text-lg font-semibold">Team Members</h3>
                  <div className="space-y-3">
                    {currentCompany.team_members.slice(0, 5).map((member, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
                          <span className="text-sm font-medium text-gray-600">
                            {member.user_id?.full_name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{member.user_id?.full_name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{member.role}</p>
                        </div>
                      </div>
                    ))}
                    {currentCompany.team_members.length > 5 && (
                      <button className="text-sm text-blue-600 hover:underline">
                        View all {currentCompany.team_members.length} members
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="py-12 text-center">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">Company Posts</h3>
            <p className="text-gray-600">Posts from this company will appear here.</p>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="py-12 text-center">
            <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">Company Jobs</h3>
            <p className="text-gray-600">Job postings from this company will appear here.</p>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="py-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">Team Members</h3>
            <p className="text-gray-600">Company team members will be listed here.</p>
          </div>
        )}

        {activeTab === 'analytics' && isOwner && (
          <div className="space-y-6">
            {analytics ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="p-6 bg-white rounded-lg shadow">
                  <h3 className="mb-2 text-lg font-semibold">Profile Views</h3>
                  <p className="text-3xl font-bold text-blue-600">{analytics.profile_views || 0}</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow">
                  <h3 className="mb-2 text-lg font-semibold">Post Views</h3>
                  <p className="text-3xl font-bold text-green-600">{analytics.post_views || 0}</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow">
                  <h3 className="mb-2 text-lg font-semibold">Job Views</h3>
                  <p className="text-3xl font-bold text-purple-600">{analytics.job_views || 0}</p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="mb-2 text-lg font-medium text-gray-900">Analytics</h3>
                <p className="text-gray-600">Loading analytics data...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CompanyPage
