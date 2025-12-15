import React, { useState } from 'react'
import { Video, X, Music, Hash, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import { useSelector, useDispatch } from "react-redux"
import { addReel } from '../features/reels/reelSlice'
import api from '../api/axios'
import { useNavigate } from "react-router-dom"
import { getProfileImageURL } from '../utils/imageUtils'

const CreateReel = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [content, setContent] = useState("")
  const [video, setVideo] = useState(null)
  const [musicUrl, setMusicUrl] = useState("")
  const [hashtags, setHashtags] = useState("")
  const [location, setLocation] = useState("")
  const [loading, setLoading] = useState(false)

  // New features state
  const [effects, setEffects] = useState([])
  const [template, setTemplate] = useState("")
  const [voiceoverUrl, setVoiceoverUrl] = useState("")
  const [voiceoverFile, setVoiceoverFile] = useState(null)
  const [captions, setCaptions] = useState("")
  const [remix, setRemix] = useState(false)
  const [greenScreen, setGreenScreen] = useState(false)
  const [autoCaptions, setAutoCaptions] = useState(false)
  const [volume, setVolume] = useState(true)

  const user = useSelector((state) => state.user.value);

  const handleSubmit = async () => {
    if (!video) {
      toast.error("Please add a video for the reel")
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("content", content)
      formData.append("hashtags", hashtags.split(',').map(h => h.trim()).filter(h => h))
      formData.append("location", location)
      formData.append("music_url", musicUrl)
      formData.append("video", video)
      formData.append("volume", volume)

      await dispatch(addReel(formData))
      navigate("/reels")
      toast.success("Reel created successfully!")

    } catch (error) {
      toast.error(error.message || "Failed to create reel")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white'>
      <div className='max-w-2xl p-6 mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='mb-2 text-3xl font-bold text-slate-900'>Create a Reel</h1>
          <p className='text-slate-600'>Share a short video with your audience</p>
        </div>

        {/* Form */}
        <div className='p-6 space-y-6 bg-white shadow-lg rounded-xl'>
          <div className='flex items-center gap-3'>
            <img src={getProfileImageURL(user?.profile_picture)} alt="User profile"
              className='w-12 h-12 rounded-full shadow mr-3 object-cover' />
            <div>
              <h1 className='font-semibold'>{user?.full_name || 'User'}</h1>
              <p className='text-sm text-gray-500'>@{user?.username || 'user'}</p>
            </div>
          </div>

          {/* Content Textarea */}
          <textarea
            className='w-full text-sm placeholder-gray-400 border-b border-gray-200 outline-none resize-none min-h-20'
            placeholder="Add a caption..."
            onChange={(e) => setContent(e.target.value)}
            value={content}
          />

          {/* Video Upload */}
          <div>
            <label htmlFor='video' className='flex items-center gap-2 text-sm text-gray-500 transition cursor-pointer hover:text-gray-700'>
              <Video className='w-5 h-5' />
              Add Video
            </label>
            <input
              type="file"
              id="video"
              accept='video/*'
              hidden
              onChange={(e) => setVideo(e.target.files[0])}
            />
          </div>

          {/* Additional Options */}
          <div className='space-y-4'>
            <div className='grid grid-cols-1 gap-4'>
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
              <input
                type='url'
                placeholder='Music URL'
                value={musicUrl}
                onChange={(e) => setMusicUrl(e.target.value)}
                className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            {/* Effects & Filters */}
            <div>
              <h3 className='mb-2 text-sm font-medium text-gray-700'>Effects & Filters</h3>
              <div className='flex flex-wrap gap-2'>
                {['brightness', 'contrast', 'saturation', 'blur', 'sepia', 'grayscale'].map((effect) => (
                  <button
                    key={effect}
                    type='button'
                    onClick={() => {
                      setEffects(prev =>
                        prev.includes(effect)
                          ? prev.filter(e => e !== effect)
                          : [...prev, effect]
                      )
                    }}
                    className={`px-3 py-1 text-xs rounded-full border ${
                      effects.includes(effect)
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-gray-100 text-gray-700 border-gray-300'
                    }`}
                  >
                    {effect}
                  </button>
                ))}
              </div>
            </div>

            {/* Templates */}
            <div>
              <h3 className='mb-2 text-sm font-medium text-gray-700'>Templates</h3>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value="">Select a template</option>
                <option value="funny">Funny</option>
                <option value="dance">Dance</option>
                <option value="educational">Educational</option>
                <option value="music">Music</option>
                <option value="travel">Travel</option>
                <option value="food">Food</option>
              </select>
            </div>

            {/* Voiceover */}
            <div>
              <h3 className='mb-2 text-sm font-medium text-gray-700'>Voiceover</h3>
              <div className='space-y-2'>
                <input
                  type='url'
                  placeholder='Voiceover URL'
                  value={voiceoverUrl}
                  onChange={(e) => setVoiceoverUrl(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                <div>
                  <label htmlFor='voiceover' className='flex items-center gap-2 text-sm text-gray-500 transition cursor-pointer hover:text-gray-700'>
                    <Music className='w-4 h-4' />
                    Upload Voiceover Audio
                  </label>
                  <input
                    type="file"
                    id="voiceover"
                    accept='audio/*'
                    hidden
                    onChange={(e) => setVoiceoverFile(e.target.files[0])}
                  />
                </div>
              </div>
            </div>

            {/* Captions */}
            <div>
              <h3 className='mb-2 text-sm font-medium text-gray-700'>Captions</h3>
              <div className='space-y-2'>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={autoCaptions}
                    onChange={(e) => setAutoCaptions(e.target.checked)}
                    className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                  />
                  <span className='text-sm text-gray-700'>Auto-generate captions</span>
                </label>
                <textarea
                  placeholder='Manual captions (optional)'
                  value={captions}
                  onChange={(e) => setCaptions(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  rows={3}
                />
              </div>
            </div>

            {/* Special Features */}
            <div>
              <h3 className='mb-2 text-sm font-medium text-gray-700'>Special Features</h3>
              <div className='space-y-2'>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={remix}
                    onChange={(e) => setRemix(e.target.checked)}
                    className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                  />
                  <span className='text-sm text-gray-700'>Mark as Remix</span>
                </label>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={greenScreen}
                    onChange={(e) => setGreenScreen(e.target.checked)}
                    className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                  />
                  <span className='text-sm text-gray-700'>Green Screen Effect</span>
                </label>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={volume}
                    onChange={(e) => setVolume(e.target.checked)}
                    className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                  />
                  <span className='text-sm text-gray-700'>Enable Volume</span>
                </label>
              </div>
            </div>
          </div>

          {/* Video Preview */}
          {video && (
            <div className='relative group'>
              <video src={URL.createObjectURL(video)} controls className='w-full rounded-md max-h-96' />
              <button
                onClick={() => setVideo(null)}
                className='absolute p-2 text-white transition bg-red-500 rounded-full opacity-0 top-2 right-2 group-hover:opacity-100'
              >
                <X className='w-4 h-4' />
              </button>
            </div>
          )}

          {/* Bottom Bar */}
          <div className='flex justify-end pt-4 border-t border-gray-300'>
            <button
              disabled={loading}
              onClick={handleSubmit}
              className='px-6 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-full hover:bg-blue-700 disabled:opacity-50'
            >
              {loading ? 'Posting...' : 'Post Reel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateReel
