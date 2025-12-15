import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ImageIcon, SendHorizonal, Mic, MicOff, Video, FileText, Paperclip, Smile, Reply, Forward, Edit, Trash2, Phone, PhoneOff } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import api from '../api/axios';
import { getProfileImageURL } from '../utils/imageUtils';
import { addMessages, fetchMessages, resetMessages, sendMessage, sendImageMessage, sendDocumentMessage, sendVoiceMessage, sendVideoMessage, addReaction, replyToMessage, deleteMessage, editMessage } from '../features/messages/messagesSlice';
import toast from "react-hot-toast"

const ChatBot = () => {

  const { messages } = useSelector((state) => state.messages)
  const connections = useSelector((state) => state.connections.connections)
  const currentUser = useSelector((state) => state.user.value)
  const { userId } = useParams()
  const dispatch = useDispatch()

  const [text, setText] = useState("")
  const [image, setImage] = useState(null)
  const [document, setDocument] = useState(null)
  const [voiceFile, setVoiceFile] = useState(null)
  const [videoFile, setVideoFile] = useState(null)
  const [user, setUser] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [replyTo, setReplyTo] = useState(null)
  const [editMessageId, setEditMessageId] = useState(null)
  const [editText, setEditText] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isInCall, setIsInCall] = useState(false)
  const [vanishMode, setVanishMode] = useState(false)
  const [chatTheme, setChatTheme] = useState('default')
  const [smartReplies, setSmartReplies] = useState([])
  const [showSmartReplies, setShowSmartReplies] = useState(false)

  const messageEndRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const recordedChunksRef = useRef([])
  const eventSourceRef = useRef(null)

  const fetchUserMessages = useCallback(async () => {
    try {
      const result = await dispatch(fetchMessages({ userId }));
      console.log("Dispatch result:", result);
    } catch (error) {
      console.error("fetchUserMessages error:", error);
      toast.error(error?.message || "Unknown error");
    }
  }, [userId, dispatch])

  const sendTextMessage = async () => {
    try {
      if (!text.trim()) return

      let result
      if (replyTo) {
        result = await dispatch(replyToMessage({
          to_user_id: userId,
          text: text.trim(),
          reply_to_id: replyTo._id
        }))
      } else if (editMessageId) {
        result = await dispatch(editMessage({
          message_id: editMessageId,
          new_text: text.trim()
        }))
        setEditMessageId(null)
        setEditText("")
      } else {
        result = await dispatch(sendMessage({
          to_user_id: userId,
          text: text.trim()
        }))
      }

      if (result.payload?.success !== false) {
        setText("")
        setReplyTo(null)
      }
    } catch (error) {
      console.error(error.message)
      toast.error(error.message)
    }
  }

  const sendImageMessageHandler = async () => {
    if (!image) return
    try {
      const result = await dispatch(sendImageMessage({
        to_user_id: userId,
        image
      }))
      if (result.payload?.success !== false) {
        setImage(null)
      }
    } catch (error) {
      console.error(error.message)
      toast.error(error.message)
    }
  }

  const sendDocumentMessageHandler = async () => {
    if (!document) return
    try {
      const result = await dispatch(sendDocumentMessage({
        to_user_id: userId,
        document
      }))
      if (result.payload?.success !== false) {
        setDocument(null)
      }
    } catch (error) {
      console.error(error.message)
      toast.error(error.message)
    }
  }

  const sendVoiceMessageHandler = async () => {
    if (!voiceFile) return
    try {
      const result = await dispatch(sendVoiceMessage({
        to_user_id: userId,
        voiceFile,
        duration: recordingTime
      }))
      if (result.payload?.success !== false) {
        setVoiceFile(null)
        setRecordingTime(0)
      }
    } catch (error) {
      console.error(error.message)
      toast.error(error.message)
    }
  }

  const sendVideoMessageHandler = async () => {
    if (!videoFile) return
    try {
      const result = await dispatch(sendVideoMessage({
        to_user_id: userId,
        videoFile,
        duration: 0 // Will be calculated on backend
      }))
      if (result.payload?.success !== false) {
        setVideoFile(null)
      }
    } catch (error) {
      console.error(error.message)
      toast.error(error.message)
    }
  }

  const handleReaction = async (messageId, emoji) => {
    try {
      await dispatch(addReaction({ message_id: messageId, emoji }))
    } catch (error) {
      console.error(error.message)
      toast.error('Failed to add reaction')
    }
  }

  const handleDeleteMessage = async (messageId) => {
    try {
      await dispatch(deleteMessage({ message_id: messageId }))
    } catch (error) {
      console.error(error.message)
      toast.error('Failed to delete message')
    }
  }

  const handleEditMessage = (message) => {
    setEditMessageId(message._id)
    setEditText(message.text)
    setText(message.text)
  }

  const cancelEdit = () => {
    setEditMessageId(null)
    setEditText("")
    setText("")
  }

  const generateSmartReplies = async (messageText) => {
    try {
      // Simple smart replies based on message content
      const replies = []
      const lowerText = messageText.toLowerCase()

      if (lowerText.includes('hello') || lowerText.includes('hi')) {
        replies.push('Hello!', 'Hi there!', 'Hey!')
      } else if (lowerText.includes('how are you') || lowerText.includes('how\'s it going')) {
        replies.push('I\'m good, thanks!', 'Doing well, how about you?', 'Great, thanks for asking!')
      } else if (lowerText.includes('thank') || lowerText.includes('thanks')) {
        replies.push('You\'re welcome!', 'No problem!', 'My pleasure!')
      } else if (lowerText.includes('yes') || lowerText.includes('yeah')) {
        replies.push('Great!', 'Awesome!', 'Perfect!')
      } else if (lowerText.includes('no') || lowerText.includes('nope')) {
        replies.push('Okay', 'Alright', 'Understood')
      } else {
        replies.push('Okay', 'Thanks', 'Got it', 'Interesting')
      }

      setSmartReplies(replies.slice(0, 3)) // Show max 3 replies
      setShowSmartReplies(true)
    } catch (error) {
      console.error('Smart replies error:', error)
    }
  }

  const selectSmartReply = (reply) => {
    setText(reply)
    setShowSmartReplies(false)
  }

  useEffect(() => {
    fetchUserMessages()
    return () => {
      dispatch(resetMessages());
    };
  }, [userId, dispatch, fetchUserMessages])

  useEffect(() => {
    if (connections.length > 0) {
      const user = connections.find(connection => connection._id === userId)
      setUser(user)
    }
  }, [userId, connections]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return user && (
    <div className='flex flex-col h-screen mobile-fix'>
      {/* Top user header */}
      <div className='flex items-center justify-between p-3 border-b border-gray-300 md:p-4 md:px-10 xl:pl-42 bg-gradient-to-r from-indigo-50 to-purple-50'>
        <div className='flex items-center gap-2'>
          <img
            src={getProfileImageURL(user._id === currentUser._id ? currentUser.profile_picture : user.profile_picture)}
            alt=""
            className='object-cover rounded-full size-8 md:size-10'
          />
          <div>
            <p className='text-sm font-medium md:text-base'>{user.full_name}</p>
            <p className='text-xs md:text-sm text-gray-500 -mt-1.5'>@{user.username}</p>
          </div>
        </div>

        {/* Call buttons and settings */}
        <div className='flex gap-2'>
          <button
            onClick={() => setVanishMode(!vanishMode)}
            className={`p-2 rounded-full ${vanishMode ? 'bg-purple-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
            title={vanishMode ? 'Disable Vanish Mode' : 'Enable Vanish Mode'}
          >
            ⏰
          </button>
          <button
            onClick={() => setChatTheme(chatTheme === 'default' ? 'dark' : 'default')}
            className='p-2 text-gray-500 rounded-full hover:bg-gray-100'
            title='Change Theme'
          >
            🎨
          </button>
          <button
            onClick={() => setIsInCall(!isInCall)}
            className={`p-2 rounded-full ${isInCall ? 'bg-red-500 text-white' : 'bg-green-500 text-white hover:bg-green-600'}`}
            title={isInCall ? 'End Call' : 'Start Video Call'}
          >
            {isInCall ? <PhoneOff className='w-5 h-5' /> : <Phone className='w-5 h-5' />}
          </button>
        </div>
      </div>

      {/* Video call interface */}
      {isInCall && (
        <div className='p-4 bg-black'>
          <div className='max-w-4xl mx-auto'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='p-4 text-center text-white bg-gray-800 rounded-lg'>
                <div className='flex items-center justify-center w-full h-64 bg-gray-700 rounded-lg'>
                  <Video className='w-16 h-16 text-gray-400' />
                </div>
                <p className='mt-2'>Your Camera</p>
              </div>
              <div className='p-4 text-center text-white bg-gray-800 rounded-lg'>
                <div className='flex items-center justify-center w-full h-64 bg-gray-700 rounded-lg'>
                  <img
                    src={getProfileImageURL(user.profile_picture)}
                    alt={user.full_name}
                    className='object-cover w-16 h-16 rounded-full'
                  />
                </div>
                <p className='mt-2'>{user.full_name}</p>
              </div>
            </div>
            <div className='flex justify-center mt-4'>
              <button
                onClick={() => setIsInCall(false)}
                className='px-6 py-2 text-white bg-red-500 rounded-full hover:bg-red-600'
              >
                End Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages area */}
      <div className='h-full p-3 overflow-y-scroll md:p-5 md:px-10 mobile-fix'>
        <div className='max-w-4xl mx-auto space-y-3 md:space-y-4'>
          {
            [...messages]
              .filter(msg => !msg.is_deleted)
              .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
              .map((message, index) => (
                <div
                  key={message._id || index}
                  className={`flex flex-col ${message.from_user_id._id !== currentUser._id ? "items-start" : "items-end"} mb-4`}
                >
                  {/* Reply indicator */}
                  {message.replyTo && (
                    <div className={`mb-1 px-3 py-1 rounded text-xs text-gray-600 bg-gray-100 max-w-xs md:max-w-sm
                      ${message.from_user_id._id !== currentUser._id ? "self-start" : "self-end"}`}>
                      Replying to: {message.replyTo.text?.slice(0, 50)}...
                    </div>
                  )}

                  <div className={`group relative max-w-xs md:max-w-sm ${message.from_user_id._id !== currentUser._id ? "self-start" : "self-end"}`}>
                    {/* Message bubble */}
                    <div className={`p-3 text-sm bg-white text-slate-700 rounded-lg shadow relative
                      ${message.from_user_id._id !== currentUser._id ? "rounded-bl-none" : "rounded-br-none"}
                      ${message.is_deleted ? "opacity-50" : ""}`}>

                      {/* Media content */}
                      {message.message_type === "image" && message.media_url && (
                        <img
                          src={message.media_url}
                          alt="Message image"
                          className='object-cover w-full mb-2 rounded-lg max-h-64'
                          onError={(e) => { e.target.src = '/placeholder-image.png'; }}
                        />
                      )}

                      {message.message_type === "video" && message.media_url && (
                        <video
                          src={message.media_url}
                          controls
                          className='w-full mb-2 rounded-lg max-h-64'
                        />
                      )}

                      {message.message_type === "voice" && message.media_url && (
                        <div className='mb-2'>
                          <audio controls src={message.media_url} className='w-full' />
                          {message.duration && <span className='text-xs text-gray-500'>{message.duration}s</span>}
                        </div>
                      )}

                      {message.message_type === "document" && (
                        <div className='flex items-center gap-2 p-2 mb-2 rounded bg-gray-50'>
                          <FileText className='w-4 h-4 text-blue-500' />
                          <div>
                            <p className='text-sm font-medium truncate'>{message.media_name}</p>
                            <p className='text-xs text-gray-500'>{message.media_size} bytes</p>
                          </div>
                          <a href={message.media_url} download className='text-blue-500 hover:text-blue-700'>Download</a>
                        </div>
                      )}

                      {/* Message text */}
                      <p className='break-words'>{message.text}</p>

                      {/* Edited indicator */}
                      {message.edited && <span className='ml-1 text-xs text-gray-400'>(edited)</span>}

                      {/* Reactions */}
                      {message.reactions && message.reactions.length > 0 && (
                        <div className='flex flex-wrap gap-1 mt-2'>
                          {message.reactions.map((reaction, idx) => (
                            <span key={idx} className='px-2 py-1 text-xs bg-gray-100 rounded-full'>
                              {reaction.emoji}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Message actions */}
                    <div className={`absolute top-0 ${message.from_user_id._id !== currentUser._id ? "-right-12" : "-left-12"} opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1`}>
                      <button
                        onClick={() => handleReaction(message._id, '👍')}
                        className='p-1 bg-white rounded-full shadow hover:bg-gray-50'
                        title='Like'
                      >
                        👍
                      </button>
                      <button
                        onClick={() => setReplyTo(message)}
                        className='p-1 bg-white rounded-full shadow hover:bg-gray-50'
                        title='Reply'
                      >
                        <Reply className='w-3 h-3' />
                      </button>
                      {message.from_user_id._id === currentUser._id && (
                        <>
                          <button
                            onClick={() => handleEditMessage(message)}
                            className='p-1 bg-white rounded-full shadow hover:bg-gray-50'
                            title='Edit'
                          >
                            <Edit className='w-3 h-3' />
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(message._id)}
                            className='p-1 text-red-500 bg-white rounded-full shadow hover:bg-gray-50'
                            title='Delete'
                          >
                            <Trash2 className='w-3 h-3' />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
          }
          <div ref={messageEndRef} />
        </div>
      </div>

      {/* Input field */}
      <div className='p-3 md:p-4'>
        <div className='flex items-center gap-2 md:gap-3 pl-3 md:pl-5 p-1.5 bg-white w-full max-w-xl mx-auto
        border border-gray-300 shadow rounded-full mb-3 md:mb-5'>
          <input
            type="text"
            placeholder='Type a message...'
            className='flex-1 text-sm outline-none text-slate-700 md:text-base'
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            onChange={(e) => {
              setText(e.target.value)
              if (e.target.value.trim().length > 2) {
                generateSmartReplies(e.target.value)
              } else {
                setShowSmartReplies(false)
              }
            }}
            value={text}
          />

          <label htmlFor="image">
            {
              image
                ? <img
                    src={URL.createObjectURL(image)}
                    alt="Selected preview"
                    className='object-cover h-6 ml-2 rounded md:h-8 md:ml-5'
                  />
                : <ImageIcon className='text-gray-400 cursor-pointer size-6 md:size-7 touch-manipulation' />
            }
            <input
              type="file"
              id='image'
              accept='image/*'
              capture="environment"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>

          <button
            onClick={() => sendMessage()}
            className='p-2 text-white rounded-full cursor-pointer bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 touch-manipulation'
          >
            <SendHorizonal size={16} className='md:w-5 md:h-5' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatBot
