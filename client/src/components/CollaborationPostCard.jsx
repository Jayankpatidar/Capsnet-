import React from 'react'
import { getProfileImageURL } from '../utils/imageUtils';
import { useDispatch, useSelector } from 'react-redux'
import { applyForCollaboration } from '../features/collaboration/collaborationSlice'
import toast from 'react-hot-toast'
import { User, Calendar, MapPin, Users } from 'lucide-react'

const CollaborationPostCard = ({ post }) => {
  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.user.value)

  const handleApply = async () => {
    try {
      await dispatch(applyForCollaboration({ postId: post._id, message: 'Interested in collaborating!' })).unwrap()
      toast.success('Application sent successfully!')
    } catch (error) {
      toast.error('Failed to apply: ' + error.message)
    }
  }

  const isOwner = post.userId === currentUser._id
  const hasApplied = post.applicants?.some(app => app.userId === currentUser._id)

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={getProfileImageURL(post.userId?.profile_picture)}
            alt={post.userId?.full_name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{post.userId?.full_name}</h3>
            <p className="text-sm text-gray-500">@{post.userId?.username}</p>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${
          post.status === 'open' ? 'bg-green-100 text-green-800' :
          post.status === 'closed' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {post.status}
        </span>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
      <p className="text-gray-600 mb-4">{post.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="w-4 h-4 mr-2" />
          {post.projectType}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-2" />
          Posted {new Date(post.createdAt).toLocaleDateString()}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Users className="w-4 h-4 mr-2" />
          {post.applicants?.length || 0} applicants
        </div>
      </div>

      {post.skillsNeeded && post.skillsNeeded.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Required Skills:</h4>
          <div className="flex flex-wrap gap-2">
            {post.skillsNeeded.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {!isOwner && post.status === 'open' && (
        <button
          onClick={handleApply}
          disabled={hasApplied}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            hasApplied
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {hasApplied ? 'Already Applied' : 'Apply to Collaborate'}
        </button>
      )}

      {isOwner && (
        <div className="text-sm text-gray-500">
          {post.applicants?.length > 0 ? (
            <div>
              <p className="font-medium mb-2">Applicants:</p>
              {post.applicants.map((applicant, index) => (
                <div key={index} className="flex items-center justify-between py-1">
                  <span>{applicant.userId?.full_name}</span>
                  <span className="text-xs">{applicant.message}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>No applicants yet</p>
          )}
        </div>
      )}
    </div>
  )
}

export default CollaborationPostCard
