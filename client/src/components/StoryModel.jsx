import { ArrowLeft, Sparkle, TextIcon, Upload, Music, Plus, MessageCircle, HelpCircle, Link, Users } from 'lucide-react'
import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import toast from 'react-hot-toast'
import api from '../api/axios'

const StoryModel = ({ setShowModel, fetchStories }) => {

  const bgColors = ["#4f46e5", "#7c3aed", "#db2777", "#e11d48", "#ca8a04", "#0d9488"]

  const [mode, setMode] = useState("text")
  const [background, setBackground] = useState(bgColors[0])
  const [text, setText] = useState("")
  const [media, setMedia] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  // Advanced features state
  const [musicUrl, setMusicUrl] = useState("")
  const [musicTitle, setMusicTitle] = useState("")
  const [pollOptions, setPollOptions] = useState(["", ""])
  const [quizQuestion, setQuizQuestion] = useState("")
  const [quizAnswers, setQuizAnswers] = useState([{ text: "", isCorrect: false }, { text: "", isCorrect: false }])
  const [qnaEnabled, setQnaEnabled] = useState(false)
  const [gifUrl, setGifUrl] = useState("")
  const [stickerUrl, setStickerUrl] = useState("")
  const [swipeLink, setSwipeLink] = useState("")
  const [swipeLinkText, setSwipeLinkText] = useState("")
  const [closeFriendsOnly, setCloseFriendsOnly] = useState(false)

  const MAX_VIDEO_DURATION = 60 //SECONDS
  const MAX_VIDEO_SIZE_MB = 50 //MB

  const handleMediaUpload = (e) => {
    const file = e.target.files?.[0]

    if (file) {

      if (file.type.startsWith("video")) {
        if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
          toast.error(`Video file cannot exceed ${MAX_VIDEO_SIZE_MB}MB`)
          setMedia(null);
          setPreviewUrl(null)
          return;
        }
        const video = document.createElement("video")
        video.preload = "metadata"
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src)
          if (video.duration > MAX_VIDEO_DURATION) {
            toast.error(`Video duration cannot exceed 1 minute`)
            setMedia(null);
            setPreviewUrl(null)
            return;
          }
          else {
            setMedia(file);
            setPreviewUrl(URL.createObjectURL(file))
            setText("")
            setMode("media")
          }
        }

        video.src = URL.createObjectURL(file)
      } else if (file.type.startsWith("image")) {
        setMedia(file);
        setPreviewUrl(URL.createObjectURL(file))
        setText("")
        setMode("media")
      }
    }
  }

  const handleCreateStory = async () => {
    const media_type = mode === "media" ? media?.type.startsWith("image") ? "image" : "video" : "text"

    if (media_type === "text" && !text) {
      throw new Error("Please add some text")
    }

    // Filter out empty poll options and validate
    const validPollOptions = pollOptions.filter(option => option.trim() !== "")
    if (validPollOptions.length > 0 && validPollOptions.length < 2) {
      throw new Error("Poll must have at least 2 options")
    }

    // Validate quiz answers
    const validQuizAnswers = quizAnswers.filter(answer => answer.text.trim() !== "")
    if (quizQuestion.trim() && validQuizAnswers.length < 2) {
      throw new Error("Quiz must have at least 2 answers")
    }

    const formData = new FormData()
    formData.append("content", text)
    formData.append("media_type", media_type)
    formData.append("media", media)
    formData.append("background_color", background)

    // Add advanced features - only include valid data
    if (musicUrl) formData.append("music_url", musicUrl)
    if (musicTitle) formData.append("music_title", musicTitle)
    if (validPollOptions.length >= 2) {
      console.log('Sending poll options:', validPollOptions.map(text => ({ text })))
      formData.append("poll_options", JSON.stringify(validPollOptions.map(text => ({ text }))))
    }
    if (quizQuestion.trim() && validQuizAnswers.length >= 2) formData.append("quiz_options", JSON.stringify([{ question: quizQuestion, answers: validQuizAnswers }]))
    if (qnaEnabled) formData.append("qna_enabled", "true")
    if (gifUrl) formData.append("gif_url", gifUrl)
    if (stickerUrl) formData.append("sticker_url", stickerUrl)
    if (swipeLink) formData.append("swipe_link", swipeLink)
    if (swipeLinkText) formData.append("swipe_link_text", swipeLinkText)
    if (closeFriendsOnly) formData.append("close_friends_only", "true")

    try {
      const { data } = await api.post("/story/create", formData)

      if (data.success) {
        setShowModel(false)
        toast.success(data.message)
        fetchStories()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

  }

  return createPortal(
    <div className='fixed inset-0 flex items-center justify-center min-h-screen p-4 text-white z-[9999] bg-black/80 backdrop-blur'>
      <div className='w-full max-w-md max-h-[90vh] bg-zinc-900 rounded-lg overflow-hidden'>
        <div className='flex items-center justify-between p-4 border-b border-zinc-700'>
          <button onClick={() => setShowModel(false)} className='p-2 text-white rounded-full cursor-pointer hover:bg-zinc-800'>
            <ArrowLeft />
          </button>
          <h2 className='text-lg font-semibold'>Create Story</h2>
          <span className="w-10"></span>
        </div>

        <div className='max-h-[70vh] overflow-y-auto'>
          <div className='relative flex items-center justify-center h-64 mx-4 mt-4 rounded-lg' style={{ backgroundColor: background }}>
            {
              mode === "text" && (
                <textarea className='w-full h-full p-6 text-lg bg-transparent resize-none focus:outline-none' placeholder="What's in your mind ?" onChange={(e) => setText(e.target.value)} value={text}></textarea>
              )
            }
            {
              mode === "media" && previewUrl && (
                media?.type.startsWith("image")
                  ? (
                    <img className='object-contain max-h-full rounded-lg' src={previewUrl} alt="Story preview" />
                  )
                  : (
                    <video className='object-contain max-h-full rounded-lg' src={previewUrl} />
                  )
              )
            }
          </div>

          <div className='flex gap-2 px-4 mt-4'>
            {bgColors.map((color) => (
              <button key={color} className='w-6 h-6 rounded-full cursor-pointer ring ring-white/20'
                onClick={() => setBackground(color)}
                style={{ backgroundColor: color }} />
            ))}
          </div>

          <div className='flex gap-2 px-4 mt-4'>
            <button onClick={() => {
              setMode("text"); setMedia(null); setPreviewUrl(null);
            }} className={` flex flex-1 items-center justify-center gap-2 p-2 rounded cursor-pointer
              ${mode === "text" ? " bg-white text-black" : "bg-zinc-800"}`}>
              <TextIcon size={18} /> Text
            </button>

            <label className={` flex flex-1 items-center justify-center gap-2 p-2 rounded cursor-pointer
              ${mode === "media" ? " bg-white text-black" : "bg-zinc-800"}`}>
              <input onChange={handleMediaUpload}
                type="file" accept='image/* ,video/*' capture="environment" className='hidden' />
              <Upload size={18} /> Photo/Video
            </label>
          </div>

          {/* Advanced Features */}
          <div className='px-4 pb-4 mt-4 space-y-3'>
          {/* Music */}
          <div className='flex items-center gap-2'>
            <Music size={18} />
            <input
              type="text"
              placeholder="Music URL"
              value={musicUrl}
              onChange={(e) => setMusicUrl(e.target.value)}
              className='flex-1 px-3 py-1 text-sm text-black rounded'
            />
            <input
              type="text"
              placeholder="Music Title"
              value={musicTitle}
              onChange={(e) => setMusicTitle(e.target.value)}
              className='flex-1 px-3 py-1 text-sm text-black rounded'
            />
          </div>

          {/* Poll */}
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <Plus size={18} />
              <span className='text-sm'>Poll Options</span>
            </div>
            {pollOptions.map((option, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => {
                  const newOptions = [...pollOptions]
                  newOptions[index] = e.target.value
                  setPollOptions(newOptions)
                }}
                className='w-full px-3 py-1 text-sm text-black rounded'
              />
            ))}
            <button
              onClick={() => setPollOptions([...pollOptions, ""])}
              className='text-xs text-blue-400'
            >
              + Add Option
            </button>
          </div>

          {/* Quiz */}
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <HelpCircle size={18} />
              <span className='text-sm'>Quiz</span>
            </div>
            <input
              type="text"
              placeholder="Quiz Question"
              value={quizQuestion}
              onChange={(e) => setQuizQuestion(e.target.value)}
              className='w-full px-3 py-1 text-sm text-black rounded'
            />
            {quizAnswers.map((answer, index) => (
              <div key={index} className='flex items-center gap-2'>
                <input
                  type="text"
                  placeholder={`Answer ${index + 1}`}
                  value={answer.text}
                  onChange={(e) => {
                    const newAnswers = [...quizAnswers]
                    newAnswers[index].text = e.target.value
                    setQuizAnswers(newAnswers)
                  }}
                  className='flex-1 px-3 py-1 text-sm text-black rounded'
                />
                <input
                  type="checkbox"
                  checked={answer.isCorrect}
                  onChange={(e) => {
                    const newAnswers = [...quizAnswers]
                    newAnswers[index].isCorrect = e.target.checked
                    setQuizAnswers(newAnswers)
                  }}
                />
                <span className='text-xs'>Correct</span>
              </div>
            ))}
          </div>

          {/* QnA */}
          <div className='flex items-center gap-2'>
            <MessageCircle size={18} />
            <label className='flex items-center gap-2 text-sm'>
              <input
                type="checkbox"
                checked={qnaEnabled}
                onChange={(e) => setQnaEnabled(e.target.checked)}
              />
              Enable Q&A
            </label>
          </div>

          {/* GIF and Sticker */}
          <div className='flex gap-2'>
            <input
              type="text"
              placeholder="GIF URL"
              value={gifUrl}
              onChange={(e) => setGifUrl(e.target.value)}
              className='flex-1 px-3 py-1 text-sm text-black rounded'
            />
            <input
              type="text"
              placeholder="Sticker URL"
              value={stickerUrl}
              onChange={(e) => setStickerUrl(e.target.value)}
              className='flex-1 px-3 py-1 text-sm text-black rounded'
            />
          </div>

          {/* Swipe Link */}
          <div className='flex gap-2'>
            <Link size={18} />
            <input
              type="url"
              placeholder="Swipe Link URL"
              value={swipeLink}
              onChange={(e) => setSwipeLink(e.target.value)}
              className='flex-1 px-3 py-1 text-sm text-black rounded'
            />
            <input
              type="text"
              placeholder="Link Text"
              value={swipeLinkText}
              onChange={(e) => setSwipeLinkText(e.target.value)}
              className='flex-1 px-3 py-1 text-sm text-black rounded'
            />
          </div>

          {/* Close Friends */}
          <div className='flex items-center gap-2'>
            <Users size={18} />
            <label className='flex items-center gap-2 text-sm'>
              <input
                type="checkbox"
                checked={closeFriendsOnly}
                onChange={(e) => setCloseFriendsOnly(e.target.checked)}
              />
              Close Friends Only
            </label>
          </div>
          </div>

          <div className='px-4 pb-4'>
            <button onClick={() => {
              toast.promise(handleCreateStory(), {
                loading: "Saving...",
              })
            }}
              className='flex items-center justify-center w-full gap-2 py-3 text-white transition rounded cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95'>
              <Sparkle size={18} /> Create Story
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default StoryModel