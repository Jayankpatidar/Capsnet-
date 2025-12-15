import React, { useEffect, useRef, useState } from 'react'
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, MessageSquare, Users, Settings } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { initiateCall, acceptCall, declineCall, endCall, sendCallMessage } from '../features/videoCall/videoCallSlice'

const VideoCall = ({ isOpen, onClose, participantIds, callType = 'video', groupId = null }) => {
  const dispatch = useDispatch()
  const { currentCall, isInCall } = useSelector(state => state.videoCall)
  const currentUser = useSelector(state => state.user.value)

  const [localStream, setLocalStream] = useState(null)
  const [remoteStreams, setRemoteStreams] = useState([])
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [showChat, setShowChat] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)

  const localVideoRef = useRef(null)
  const remoteVideoRefs = useRef([])

  useEffect(() => {
    if (isOpen && !isInCall) {
      startCall()
    }
  }, [isOpen])

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream])

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: callType === 'video',
        audio: true
      })
      setLocalStream(stream)

      // Dispatch initiate call action
      dispatch(initiateCall({
        participant_ids: participantIds,
        call_type: callType,
        group_id: groupId
      }))
    } catch (error) {
      console.error('Error starting call:', error)
    }
  }

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = isMuted
      })
      setIsMuted(!isMuted)
    }
  }

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = isVideoOff
      })
      setIsVideoOff(!isVideoOff)
    }
  }

  const handleEndCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
    }
    dispatch(endCall({ call_id: currentCall?._id }))
    setLocalStream(null)
    setRemoteStreams([])
    onClose()
  }

  const sendMessage = () => {
    if (chatInput.trim() && currentCall) {
      dispatch(sendCallMessage({
        call_id: currentCall._id,
        text: chatInput
      }))
      setChatMessages(prev => [...prev, {
        text: chatInput,
        sender: currentUser.full_name,
        timestamp: new Date()
      }])
      setChatInput('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black bg-opacity-90">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800 bg-opacity-50">
        <div className="flex items-center gap-4">
          <div className="text-white">
            <h3 className="font-semibold">
              {callType === 'video' ? 'Video Call' : 'Voice Call'}
            </h3>
            <p className="text-sm text-gray-300">
              {currentCall?.participants?.length || 0} participants
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className="p-2 text-white rounded-lg hover:bg-gray-700"
          >
            <Users size={20} />
          </button>
          <button
            onClick={() => setShowChat(!showChat)}
            className="p-2 text-white rounded-lg hover:bg-gray-700"
          >
            <MessageSquare size={20} />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-white rounded-lg hover:bg-gray-700"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="relative flex flex-1">
        {/* Remote Videos */}
        <div className="grid flex-1 grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
          {remoteStreams.map((stream, index) => (
            <div key={index} className="relative overflow-hidden bg-gray-800 rounded-lg">
              <video
                ref={el => remoteVideoRefs.current[index] = el}
                autoPlay
                playsInline
                className="object-cover w-full h-full"
              />
              <div className="absolute px-2 py-1 text-sm text-white bg-black bg-opacity-50 rounded bottom-2 left-2">
                Participant {index + 1}
              </div>
            </div>
          ))}

          {/* Local Video (Picture-in-Picture) */}
          {localStream && callType === 'video' && (
            <div className="absolute w-48 overflow-hidden bg-gray-800 border-2 border-white rounded-lg bottom-4 right-4 h-36">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="object-cover w-full h-full"
              />
              <div className="absolute px-1 text-xs text-white bg-black bg-opacity-50 rounded bottom-1 left-1">
                You
              </div>
            </div>
          )}
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="flex flex-col bg-gray-800 w-80">
            <div className="p-4 border-b border-gray-700">
              <h4 className="font-semibold text-white">Chat</h4>
            </div>

            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {chatMessages.map((msg, index) => (
                <div key={index} className="text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{msg.sender}</span>
                    <span className="text-xs text-gray-400">
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="p-2 text-sm bg-gray-700 rounded">{msg.text}</p>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Participants Sidebar */}
        {showParticipants && (
          <div className="flex flex-col bg-gray-800 w-80">
            <div className="p-4 border-b border-gray-700">
              <h4 className="font-semibold text-white">Participants</h4>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-3">
                {currentCall?.participants?.map((participant, index) => (
                  <div key={index} className="flex items-center gap-3 text-white">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-600 rounded-full">
                      {participant.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-medium">{participant.name}</p>
                      <p className="text-sm text-gray-400">
                        {participant.is_host ? 'Host' : 'Participant'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-6 bg-gray-800 bg-opacity-50">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full transition-colors ${
              isMuted
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {isMuted ? <MicOff size={24} className="text-white" /> : <Mic size={24} className="text-white" />}
          </button>

          {callType === 'video' && (
            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full transition-colors ${
                isVideoOff
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {isVideoOff ? <VideoOff size={24} className="text-white" /> : <Video size={24} className="text-white" />}
            </button>
          )}

          <button
            onClick={handleEndCall}
            className="p-4 transition-colors bg-red-600 rounded-full hover:bg-red-700"
          >
            <PhoneOff size={24} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default VideoCall
