import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, Download } from 'lucide-react'

const VoiceMessage = ({ audioUrl, duration, messageId }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(duration || 0)
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.addEventListener('loadedmetadata', () => {
        setAudioDuration(audio.duration)
      })

      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime)
      })

      audio.addEventListener('ended', () => {
        setIsPlaying(false)
        setCurrentTime(0)
      })
    }

    return () => {
      if (audio) {
        audio.removeEventListener('loadedmetadata', () => {})
        audio.removeEventListener('timeupdate', () => {})
        audio.removeEventListener('ended', () => {})
      }
    }
  }, [audioUrl])

  const togglePlayback = () => {
    const audio = audioRef.current
    if (audio) {
      if (isPlaying) {
        audio.pause()
      } else {
        audio.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = audioUrl
    link.download = `voice-message-${messageId}.wav`
    link.click()
  }

  return (
    <div className="flex items-center max-w-xs gap-3 p-3 bg-gray-100 rounded-lg dark:bg-gray-800">
      <button
        onClick={togglePlayback}
        className="flex items-center justify-center w-10 h-10 transition-colors bg-blue-500 rounded-full hover:bg-blue-600"
      >
        {isPlaying ? (
          <Pause size={16} className="text-white" />
        ) : (
          <Play size={16} className="text-white ml-0.5" />
        )}
      </button>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex-1 bg-gray-300 dark:bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-100"
              style={{ width: `${audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0}%` }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>{formatTime(currentTime)} / {formatTime(audioDuration)}</span>
          <button
            onClick={handleDownload}
            className="transition-colors hover:text-blue-500"
            title="Download voice message"
          >
            <Download size={14} />
          </button>
        </div>
      </div>

      <audio ref={audioRef} src={audioUrl} preload="metadata" />
    </div>
  )
}

export default VoiceMessage
