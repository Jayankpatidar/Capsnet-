import React, { useState, useEffect } from 'react'
import { Image, X, Video, FileText, BarChart3, Hash, MapPin, Music, Users, Calendar, Megaphone, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { useSelector, useDispatch } from "react-redux"
import { addPost } from '../features/posts/postSlice'
import api from '../api/axios'
import {useNavigate} from "react-router-dom"
import { getProfileImageURL } from '../utils/imageUtils'

const CreatePost = () => {

  const navigate = useNavigate()

  const [content, setContent] = useState("")
  const [images, setImages] = useState([])
  const [videos, setVideos] = useState([])
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const [postType, setPostType] = useState("text")
  const [pollOptions, setPollOptions] = useState([{ text: "" }, { text: "" }])
  const [hashtags, setHashtags] = useState("")
  const [location, setLocation] = useState("")
  const [musicUrl, setMusicUrl] = useState("")
  const [isArticle, setIsArticle] = useState(false)
  const [collabUsers, setCollabUsers] = useState([])
  const [scheduledAt, setScheduledAt] = useState("")
  const [isPromoted, setIsPromoted] = useState(false)
  const [isDraft, setIsDraft] = useState(false)
  const [taggedUsers, setTaggedUsers] = useState([])

  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  const handleSubmit = async (isDraft = false) => {
    if (!isDraft && !content.trim() && images.length === 0 && videos.length === 0 && documents.length === 0 && postType !== 'poll') {
      toast.error("Please add content, media, or poll options")
      return
    }

    setLoading(true)
    setIsDraft(isDraft)

    try {
      // Determine final post type - use selected post_type, but adjust for media if needed
      let finalPostType = postType
      if (images.length > 0) {
        if (finalPostType === 'text' || finalPostType === 'image') {
          finalPostType = images.length > 1 ? 'carousel' : 'image'
        }
      } else if (videos.length > 0) {
        if (finalPostType === 'text' || finalPostType === 'video') {
          finalPostType = 'video'
        }
      } else if (documents.length > 0) {
        if (finalPostType === 'text' || finalPostType === 'pdf') {
          finalPostType = 'pdf'
        }
      }

      const formData = new FormData()
      formData.append("content", content)
      formData.append("post_type", finalPostType)
      console.log("🔥 Frontend: Sending post_type:", finalPostType)
      console.log("🔥 Frontend: FormData content:", content)
      console.log("🔥 Frontend: Images:", images.length, "Videos:", videos.length, "Docs:", documents.length)
      formData.append("poll_options", JSON.stringify(pollOptions.filter(opt => opt.text.trim())))
      formData.append("hashtags", hashtags.split(',').map(h => h.trim()).filter(h => h))
      formData.append("location", location)
      formData.append("music_url", musicUrl)
      formData.append("is_article", isArticle)
      formData.append("collab_users", JSON.stringify(collabUsers))
      formData.append("scheduled_at", scheduledAt)
      formData.append("is_promoted", isPromoted)
      formData.append("is_draft", isDraft)
      formData.append("tagged_users", JSON.stringify(taggedUsers))

      // Append files
      images.forEach(image => formData.append("files", image))
      videos.forEach(video => formData.append("files", video))
      documents.forEach(doc => formData.append("files", doc))

      if (!isDraft) {
        const result = await dispatch(addPost(formData))
        if (addPost.fulfilled.match(result)) {
          console.log("✅ Frontend: Post created successfully. Received data:", result.payload.post)
          navigate("/")
          toast.success("Post created successfully!")
        } else {
          toast.error("Failed to create post")
        }
      } else {
        toast.success("Draft saved!")
      }

    } catch (error) {
      toast.error(error.message || "Failed to create post")
    } finally {
      setLoading(false)
    }
  }

  // Auto-save draft
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content || images.length > 0 || videos.length > 0 || documents.length > 0) {
        handleSubmit(true)
      }
    }, 30000) // Auto-save every 30 seconds
    return () => clearTimeout(timer)
  }, [content, images, videos, documents])

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white'>
      <div className='max-w-4xl p-6 mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='mb-2 text-3xl font-bold text-slate-900'>Create a post</h1>
          <p className='text-slate-600'>Share an article, photo, video, poll or idea</p>
        </div>

        {/* Post Type Selector */}
        <div className='mb-6'>
          <div className='flex flex-wrap gap-2'>
            {[
              { type: 'text', icon: FileText, label: 'Text' },
              { type: 'image', icon: Image, label: 'Photo' },
              { type: 'video', icon: Video, label: 'Video' },
              { type: 'carousel', icon: Image, label: 'Carousel' },
              { type: 'pdf', icon: FileText, label: 'PDF' },
              { type: 'poll', icon: BarChart3, label: 'Poll' },
              { type: 'article', icon: FileText, label: 'Article' },
              { type: 'collab', icon: Users, label: 'Collab' }
            ].map(({ type, icon: Icon, label }) => (
              <button
                key={type}
                onClick={() => setPostType(type)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                  postType === type ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className='w-4 h-4' />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className='max-w-2xl p-6 space-y-6 bg-white shadow-lg rounded-xl'>
          <div className='flex items-center gap-3'>
            <img src={getProfileImageURL(user?.profile_picture)} alt="User profile"
                className='rounded-full w-12 h-12 shadow mr-3 object-cover' />
            <div>
              <h1 className='font-semibold'>{user?.full_name || 'User'}</h1>
              <p className='text-sm text-gray-500'>@{user?.username || 'user'}</p>
            </div>
          </div>

          {/* Content Textarea */}
          <textarea
            className='w-full text-sm placeholder-gray-400 border-b border-gray-200 outline-none resize-none min-h-32'
            placeholder="What do you want to talk about?"
            onChange={(e) => setContent(e.target.value)}
            value={content}
          />

          {/* Conditional Fields Based on Post Type */}
          {postType === 'poll' && (
            <div className='space-y-3'>
              <h3 className='font-medium text-gray-700'>Poll Options</h3>
              {pollOptions.map((option, index) => (
                <div key={index} className='flex items-center gap-2'>
                  <input
                    type='text'
                    placeholder={`Option ${index + 1}`}
                    value={option.text}
                    onChange={(e) => {
                      const newOptions = [...pollOptions]
                      newOptions[index].text = e.target.value
                      setPollOptions(newOptions)
                    }}
                    className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                  {pollOptions.length > 2 && (
                    <button
                      onClick={() => setPollOptions(pollOptions.filter((_, i) => i !== index))}
                      className='p-2 text-red-500 rounded-md hover:bg-red-50'
                    >
                      <X className='w-4 h-4' />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => setPollOptions([...pollOptions, { text: '' }])}
                className='text-sm font-medium text-blue-600 hover:text-blue-700'
              >
                + Add option
              </button>
            </div>
          )}

          {/* Media Uploads */}
          {(postType === 'image' || postType === 'carousel' || postType === 'text_with_image') && (
            <div>
              <label htmlFor='images' className='flex items-center gap-2 text-sm text-gray-500 transition cursor-pointer hover:text-gray-700'>
                <Image className='w-5 h-5' />
                Add Photos
              </label>
              <input
                type="file"
                id="images"
                accept='image/*'
                hidden
                multiple={postType === 'carousel'}
                onChange={(e) => setImages((prev) => [...prev, ...Array.from(e.target.files)])}
              />
            </div>
          )}

          {postType === 'video' && (
            <div>
              <label htmlFor='videos' className='flex items-center gap-2 text-sm text-gray-500 transition cursor-pointer hover:text-gray-700'>
                <Video className='w-5 h-5' />
                Add Video
              </label>
              <input
                type="file"
                id="videos"
                accept='video/*'
                hidden
                onChange={(e) => setVideos((prev) => [...prev, ...Array.from(e.target.files)])}
              />
            </div>
          )}

          {postType === 'pdf' && (
            <div>
              <label htmlFor='documents' className='flex items-center gap-2 text-sm text-gray-500 transition cursor-pointer hover:text-gray-700'>
                <FileText className='w-5 h-5' />
                Add PDF/Document
              </label>
              <input
                type="file"
                id="documents"
                accept='.pdf,application/pdf'
                hidden
                multiple
                onChange={(e) => setDocuments((prev) => [...prev, ...Array.from(e.target.files)])}
              />
            </div>
          )}

          {/* Additional Options */}
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <input
                type='text'
                placeholder='Add hashtags (comma separated)'
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <input
                type='text'
                placeholder='Location'
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <input
                type='url'
                placeholder='Music URL'
                value={musicUrl}
                onChange={(e) => setMusicUrl(e.target.value)}
                className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <input
                type='datetime-local'
                placeholder='Schedule post'
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <div className='flex items-center gap-4'>
              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={isArticle}
                  onChange={(e) => setIsArticle(e.target.checked)}
                />
                Long article
              </label>
              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={isPromoted}
                  onChange={(e) => setIsPromoted(e.target.checked)}
                />
                Promote post
              </label>
            </div>
          </div>

          {/* Media Previews */}
          {images.length > 0 && (
            <div className='flex flex-wrap gap-2'>
              {images.map((image, i) => (
                <div key={i} className='relative group'>
                  <img src={URL.createObjectURL(image)} alt="Uploaded" className='h-20 rounded-md' />
                  <button
                    onClick={() => setImages(images.filter((_, index) => index !== i))}
                    className='absolute p-1 text-white transition bg-red-500 rounded-full opacity-0 top-1 right-1 group-hover:opacity-100'
                  >
                    <X className='w-3 h-3' />
                  </button>
                </div>
              ))}
            </div>
          )}

          {videos.length > 0 && (
            <div className='flex flex-wrap gap-2'>
              {videos.map((video, i) => (
                <div key={i} className='relative group'>
                  <video src={URL.createObjectURL(video)} className='h-20 rounded-md' />
                  <button
                    onClick={() => setVideos(videos.filter((_, index) => index !== i))}
                    className='absolute p-1 text-white transition bg-red-500 rounded-full opacity-0 top-1 right-1 group-hover:opacity-100'
                  >
                    <X className='w-3 h-3' />
                  </button>
                </div>
              ))}
            </div>
          )}

          {documents.length > 0 && (
            <div className='space-y-2'>
              {documents.map((doc, i) => (
                <div key={i} className='flex items-center gap-2 p-2 rounded-md bg-gray-50'>
                  <FileText className='w-4 h-4' />
                  <span className='text-sm'>{doc.name}</span>
                  <button
                    onClick={() => setDocuments(documents.filter((_, index) => index !== i))}
                    className='p-1 ml-auto text-red-500 rounded hover:bg-red-50'
                  >
                    <X className='w-3 h-3' />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Bar */}
          <div className='flex items-center justify-between pt-4 border-t border-gray-300'>
            <button
              onClick={() => handleSubmit(true)}
              className='flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800'
            >
              <Save className='w-4 h-4' />
              Save Draft
            </button>
            <button
              disabled={loading}
              onClick={() => handleSubmit(false)}
              className='px-6 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-full hover:bg-blue-700 disabled:opacity-50'
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePost