import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ImageIcon, SendHorizonal, Mic, MicOff, Video, FileText, Paperclip, Smile, Reply, Forward, Edit, Trash2, Phone, PhoneOff, Users, Settings } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import api from '../api/axios';
import { addMessages, fetchMessages, resetMessages, sendMessage, sendImageMessage, sendDocumentMessage, sendVoiceMessage, sendVideoMessage, addReaction, replyToMessage, deleteMessage, editMessage } from '../features/messages/messagesSlice';
import { getGroupById } from '../features/groups/groupsSlice';
import toast from "react-hot-toast"
import { getProfileImageURL } from '../utils/imageUtils';

const GroupChat = () => {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { messages } = useSelector((state) => state.messages)
  const { currentGroup } = useSelector((state) => state.groups)
  const currentUser = useSelector((state) => state.user.value)

  const [text, setText] = useState("")
  const [image, setImage] = useState(null)
  const [document, setDocument] = useState(null)
  const [voiceFile, setVoiceFile] = useState(null)
  const [videoFile, setVideoFile] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [replyTo, setReplyTo] = useState(null)
  const [editMessageId, setEditMessageId] = useState(null)
  const [editText, setEditText] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isInCall, setIsInCall] = useState(false)

  const messageEndRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const recordedChunksRef = useRef([])
  const eventSourceRef = useRef(null)

  const fetchGroupMessages = useCallback(async () => {
    try {
      const result = await dispatch(fetchMessages({ groupId, isGroup: true }));
      console.log("Group messages fetch result:", result);
    } catch (error) {
      console.error("fetchGroupMessages error:", error);
      toast.error(error?.message || "Unknown error");
    }
  }, [groupId, dispatch])

  const fetchGroupDetails = useCallback(async () => {
    try {
      await dispatch(getGroupById(groupId));
    } catch (error) {
      console.error("fetchGroupDetails error:", error);
      toast.error("Failed to load group details");
    }
  }, [groupId, dispatch])

  // SSE connection for real-time updates
  useEffect(() => {
    if (currentUser?._id) {
      eventSourceRef.current = new EventSource(`${api.defaults.baseURL}/sse/${currentUser._id}`);

      eventSourceRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'message') {
            dispatch(addMessages(data.message));
          }
        } catch (error) {
          console.error('SSE message parse error:', error);
        }
      };

      eventSourceRef.current.onerror = (error) => {
        console.error('SSE error:', error);
      };

      return () => {
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }
      };
    }
  }, [currentUser?._id, dispatch]);

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      recordedChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/wav' });
        const file = new File([blob], 'voice-message.wav', { type: 'audio/wav' });
        setVoiceFile(file);
        setRecordingTime(0);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      // Recording timer
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    } catch (error) {
      console.error('Recording error:', error);
      toast.error('Failed to start recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  useEffect(() => {
    fetchGroupMessages()
    fetchGroupDetails()
    return () => {
      dispatch(resetMessages());
    };
  }, [groupId, dispatch, fetchGroupMessages, fetchGroupDetails])

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendTextMessage = async () => {
    try {
      if (!text.trim()) return

      let result
      if (replyTo) {
        result = await dispatch(replyToMessage({
          group_id: groupId,
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
          group_id: groupId,
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
        group_id: groupId,
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
        group_id: groupId,
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
        group_id: groupId,
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
        group_id: groupId,
        videoFile,
        duration: 0
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

  if (!currentGroup) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-center'>
          <div className='w-16 h-16 mx-auto mb-4 border-4 rounded-full border-primary border-t-transparent animate-spin'></div>
          <p className='text-text-secondary'>Loading group...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col h-screen mobile-fix'>
      {/* Top group header */}
      <div className='flex items-center justify-between p-3 border-b border-gray-300 md:p-4 md:px-10 xl:pl-42 bg-gradient-to-r from-indigo-50 to-purple-50'>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => navigate('/groups')}
            className='p-2 mr-2 rounded-full hover:bg-gray-100'
          >
            ←
          </button>
          <div className='flex -space-x-2'>
            {currentGroup.members?.slice(0, 4).map((member, idx) => (
              <img
                key={idx}
                src={getProfileImageURL(member.user?.profile_picture)}
                alt={member.user?.full_name}
                className='w-8 h-8 border-2 rounded-full border-bg-primary'
              />
            ))}
            {currentGroup.members?.length > 4 && (
              <div className='flex items-center justify-center w-8 h-8 text-xs font-medium text-white border-2 rounded-full bg-primary border-bg-primary'>
                +{currentGroup.members.length - 4}
              </div>
            )}
          </div>
          <div>
            <p className='text-sm font-medium md:text-base'>{currentGroup.name}</p>
            <p className='text-xs md:text-sm text-gray-500 -mt-1.5'>{currentGroup.members?.length} members</p>
          </div>
        </div>

        {/* Call buttons */}
        <div className='flex gap-2'>
          <button
            onClick={() => setIsInCall(!isInCall)}
            className={`p-2 rounded-full ${isInCall ? 'bg-red-500 text-white' : 'bg-green-500 text-white hover:bg-green-600'}`}
            title={isInCall ? 'End Call' : 'Start Group Call'}
          >
            {isInCall ? <PhoneOff className='w-5 h-5' /> : <Phone className='w-5 h-5' />}
          </button>
        </div>
      </div>

      {/* Video call interface */}
      {isInCall && (
        <div className='p-4 bg-black'>
          <div className='max-w-6xl mx-auto'>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
              {currentGroup.members?.map((member, idx) => (
                <div key={idx} className='p-4 text-center text-white bg-gray-800 rounded-lg'>
                  <div className='flex items-center justify-center w-full h-32 bg-gray-700 rounded-lg'>
                    <img
                      src={getProfileImageURL(member.user?.profile_picture)}
                      alt={member.user?.full_name}
                      className='object-cover w-16 h-16 rounded-full'
                    />
                  </div>
                  <p className='mt-2 text-sm'>{member.user?.full_name}</p>
                </div>
              ))}
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
      <div className='flex-1 p-3 overflow-y-scroll md:p-5 md:px-10 mobile-fix'>
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
                  {/* Sender name for group messages */}
                  {message.from_user_id._id !== currentUser._id && (
                    <div className='flex items-center gap-2 mb-1 ml-3'>
                      <img
                        src={getProfileImageURL(message.from_user_id.profile_picture)}
                        alt={message.from_user_id.full_name}
                        className='w-6 h-6 rounded-full'
                      />
                      <span className='text-xs font-medium text-text-secondary'>
                        {message.from_user_id.full_name}
                      </span>
                    </div>
                  )}

                  {/* Reply indicator */}
                  {message.replyTo && (
                    <div className={`mb-1 px-3 py-1 rounded text-xs text-gray-600 bg-gray-100 max-w-xs md:max-w-sm
                      ${message.from_user_id._id !== currentUser._id ? "self-start ml-3" : "self-end mr-3"}`}>
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

      {/* Reply/Edit indicator */}
      {(replyTo || editMessageId) && (
        <div className='px-3 py-2 border-t border-blue-200 bg-blue-50 md:px-10'>
          <div className='flex items-center justify-between max-w-xl mx-auto'>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-blue-600'>
                {replyTo ? 'Replying to' : 'Editing'}:
                <span className='ml-1 font-medium'>
                  {replyTo ? replyTo.text?.slice(0, 50) : editText?.slice(0, 50)}...
                </span>
              </span>
            </div>
            <button
              onClick={replyTo ? () => setReplyTo(null) : cancelEdit}
              className='text-blue-600 hover:text-blue-800'
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Media preview */}
      {(image || document || voiceFile || videoFile) && (
        <div className='px-3 py-2 border-t border-gray-200 bg-gray-50 md:px-10'>
          <div className='flex items-center justify-between max-w-xl mx-auto'>
            <div className='flex items-center gap-2'>
              {image && (
                <div className='flex items-center gap-2'>
                  <img src={URL.createObjectURL(image)} alt="Preview" className='object-cover w-8 h-8 rounded' />
                  <span className='text-sm text-gray-600'>Image ready to send</span>
                </div>
              )}
              {document && (
                <div className='flex items-center gap-2'>
                  <FileText className='w-4 h-4 text-blue-500' />
                  <span className='text-sm text-gray-600'>{document.name}</span>
                </div>
              )}
              {voiceFile && (
                <div className='flex items-center gap-2'>
                  <Mic className='w-4 h-4 text-green-500' />
                  <span className='text-sm text-gray-600'>Voice message ({recordingTime}s)</span>
                </div>
              )}
              {videoFile && (
                <div className='flex items-center gap-2'>
                  <Video className='w-4 h-4 text-red-500' />
                  <span className='text-sm text-gray-600'>{videoFile.name}</span>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                setImage(null)
                setDocument(null)
                setVoiceFile(null)
                setVideoFile(null)
              }}
              className='text-gray-500 hover:text-gray-700'
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Input field */}
      <div className='p-3 md:p-4'>
        <div className='flex items-center gap-2 md:gap-3 pl-3 md:pl-5 p-1.5 bg-white w-full max-w-xl mx-auto border border-gray-300 shadow rounded-full mb-3 md:mb-5'>
          <input
            type="text"
            placeholder='Type a message...'
            className='flex-1 text-sm outline-none text-slate-700 md:text-base'
            onKeyDown={e => e.key === "Enter" && sendTextMessage()}
            onChange={(e) => {
              setText(e.target.value)
              // Smart replies could be added here
            }}
            value={text}
          />

          {/* Voice recording */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-2 rounded-full ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-red-500'}`}
            title={isRecording ? 'Stop Recording' : 'Record Voice'}
          >
            {isRecording ? <MicOff className='w-5 h-5' /> : <Mic className='w-5 h-5' />}
          </button>

          {/* Document upload */}
          <label htmlFor="document">
            <Paperclip className='text-gray-400 cursor-pointer size-5 md:size-6 touch-manipulation hover:text-blue-500' />
            <input
              type="file"
              id='document'
              accept='.pdf,.doc,.docx,.txt,.zip,.rar'
              hidden
              onChange={(e) => setDocument(e.target.files[0])}
            />
          </label>

          {/* Video upload */}
          <label htmlFor="video">
            <Video className='text-gray-400 cursor-pointer size-5 md:size-6 touch-manipulation hover:text-red-500' />
            <input
              type="file"
              id='video'
              accept='video/*'
              capture="environment"
              hidden
              onChange={(e) => setVideoFile(e.target.files[0])}
            />
          </label>

          {/* Image upload */}
          <label htmlFor="image">
            <ImageIcon className='text-gray-400 cursor-pointer size-5 md:size-6 touch-manipulation hover:text-green-500' />
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
            onClick={() => {
              if (image) sendImageMessageHandler()
              else if (document) sendDocumentMessageHandler()
              else if (voiceFile) sendVoiceMessageHandler()
              else if (videoFile) sendVideoMessageHandler()
              else sendTextMessage()
            }}
            className='p-2 text-white rounded-full cursor-pointer bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 touch-manipulation'
          >
            <SendHorizonal size={16} className='md:w-5 md:h-5' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default GroupChat
