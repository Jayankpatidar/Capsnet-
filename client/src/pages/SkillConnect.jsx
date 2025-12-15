import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSuggestedUsers } from '../features/users/userSlice'
import { fetchCollaborationPosts, createCollaborationPost, applyForCollaboration } from '../features/collaboration/collaborationSlice'
import UserCard from '../components/UserCard'
import { FiUsers, FiBriefcase, FiPlus } from 'react-icons/fi'

const SkillConnect = () => {
  const [activeTab, setActiveTab] = useState('people')
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [postForm, setPostForm] = useState({
    title: '',
    description: '',
    skillsNeeded: '',
    projectType: 'hackathon'
  })

  const dispatch = useDispatch()
  const { suggestedUsers } = useSelector(state => state.user)
  const { posts, loading } = useSelector(state => state.collaboration)

  useEffect(() => {
    if (activeTab === 'people') {
      dispatch(fetchSuggestedUsers())
    } else {
      dispatch(fetchCollaborationPosts())
    }
  }, [activeTab, dispatch])

  const handleCreatePost = async (e) => {
    e.preventDefault()
    const skillsArray = postForm.skillsNeeded.split(',').map(skill => skill.trim()).filter(skill => skill)
    const postData = {
      ...postForm,
      skillsNeeded: skillsArray
    }
    await dispatch(createCollaborationPost(postData))
    setPostForm({ title: '', description: '', skillsNeeded: '', projectType: 'hackathon' })
    setShowCreatePost(false)
  }

  const handleApply = (postId, message) => {
    dispatch(applyForCollaboration({ postId, message }))
  }

  const tabs = [
    { id: 'people', label: 'Similar Skills', icon: FiUsers },
    { id: 'projects', label: 'Projects', icon: FiBriefcase }
  ]

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Skill Connect</h1>
        <p className="text-gray-600">Find collaborators and work on exciting projects</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon size={20} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'people' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">People with Similar Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedUsers?.map(user => (
              <UserCard key={user._id} user={user} showSkills={true} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Collaboration Projects</h2>
            <button
              onClick={() => setShowCreatePost(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FiPlus size={20} />
              <span>Post Project</span>
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading projects...</div>
          ) : (
            <div className="space-y-6">
              {posts?.map(post => (
                <div key={post._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                      <p className="text-sm text-gray-600">by {post.userId.full_name}</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {post.projectType}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4">{post.description}</p>
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Skills Needed:</h4>
                    <div className="flex flex-wrap gap-2">
                      {post.skillsNeeded.map(skill => (
                        <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {post.applicants?.length || 0} applicants
                    </span>
                    <button
                      onClick={() => handleApply(post._id, 'I\'m interested in this project!')}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create Collaboration Post</h3>
            <form onSubmit={handleCreatePost}>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Project Title"
                  value={postForm.title}
                  onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <textarea
                  placeholder="Project Description"
                  value={postForm.description}
                  onChange={(e) => setPostForm({...postForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                  required
                />
                <input
                  type="text"
                  placeholder="Skills needed (comma separated)"
                  value={postForm.skillsNeeded}
                  onChange={(e) => setPostForm({...postForm, skillsNeeded: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <select
                  value={postForm.projectType}
                  onChange={(e) => setPostForm({...postForm, projectType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="hackathon">Hackathon</option>
                  <option value="startup">Startup</option>
                  <option value="academic">Academic</option>
                  <option value="personal">Personal</option>
                </select>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreatePost(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Create Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default SkillConnect
