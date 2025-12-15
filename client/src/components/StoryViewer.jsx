import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, MessageCircle, Send, MoreHorizontal, Music, Play, Pause } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { BASE_URL } from '../api/axios';
import { getImageURL } from '../utils/imageUtils';

// Helper function to get media URL with correct base
const getMediaURL = (mediaUrl) => {
  if (!mediaUrl) return '';
  if (typeof mediaUrl !== 'string') return '';
  if (mediaUrl.startsWith('http')) return mediaUrl;
  if (mediaUrl.startsWith('/')) {
    const serverRoot = BASE_URL.replace('/api', '');
    return `${serverRoot}${mediaUrl}`;
  }
  return mediaUrl;
};

export default function StoryViewer({ story, onClose, onNext, onPrevious, onDelete }) {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const progressInterval = useRef(null);

  const STORY_DURATION = 5000; // 5 seconds for images



  useEffect(() => {
    if (story.media_type === 'video' && videoRef.current) {
      const video = videoRef.current;
      video.onloadedmetadata = () => {
        setDuration(video.duration * 1000);
      };
      video.onended = () => {
        onNext && onNext();
      };

      // Try to play video programmatically if autoplay fails
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('Video autoplay successful');
        }).catch(error => {
          console.log('Video autoplay failed, user interaction required:', error);
          // Video will show controls and user can click to play
        });
      }
    } else if (story.media_type === 'image') {
      startProgressTimer();
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [story]);

  const startProgressTimer = () => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    setProgress(0);
    const startTime = Date.now();
    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercent = (elapsed / STORY_DURATION) * 100;
      setProgress(progressPercent);
      if (progressPercent >= 100) {
        clearInterval(progressInterval.current);
        onNext && onNext();
      }
    }, 50);
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    }
  };

  const togglePlayPause = () => {
    if (story.media_type === 'video' && videoRef.current) {
      const video = videoRef.current;
      if (isPlaying) {
        video.pause();
      } else {
        // Try to play and enable sound on user interaction
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            video.muted = false; // Enable sound after user interaction
          }).catch(error => {
            console.log('Video play failed:', error);
          });
        }
      }
      setIsPlaying(!isPlaying);
    } else if (story.media_type === 'image') {
      if (isPlaying) {
        clearInterval(progressInterval.current);
      } else {
        startProgressTimer();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = (clickX / rect.width) * 100;
    setProgress(newProgress);

    if (story.media_type === 'video' && videoRef.current) {
      const newTime = (newProgress / 100) * duration;
      videoRef.current.currentTime = newTime / 1000;
    } else if (story.media_type === 'image') {
      // For images, restart timer from clicked position
      clearInterval(progressInterval.current);
      const remainingTime = STORY_DURATION * (1 - newProgress / 100);
      setTimeout(() => {
        onNext && onNext();
      }, remainingTime);
    }
  };

  const handleSwipe = (direction) => {
    if (direction === 'left') {
      onNext && onNext();
    } else if (direction === 'right') {
      onPrevious && onPrevious();
    }
  };

  const handlePollVote = async (optionIndex) => {
    try {
      const { data } = await api.post("/story/poll/vote", {
        storyId: story._id,
        optionIndex
      });
      if (data.success) {
        toast.success("Vote recorded!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to vote");
    }
  };

  const handleQuizAnswer = async (answerIndex) => {
    try {
      const { data } = await api.post("/story/quiz/answer", {
        storyId: story._id,
        questionIndex: 0,
        answerIndex
      });
      if (data.success) {
        toast.success(data.isCorrect ? "Correct answer!" : "Wrong answer!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to submit answer");
    }
  };

  const handleQnaSubmit = async (question) => {
    if (!question.trim()) return;
    try {
      const { data } = await api.post("/story/qna/submit", {
        storyId: story._id,
        response: question
      });
      if (data.success) {
        toast.success("Question submitted!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to submit question");
    }
  };

  const handleKeyPress = (e) => {
    switch (e.key) {
      case 'ArrowRight':
        onNext && onNext();
        break;
      case 'ArrowLeft':
        onPrevious && onPrevious();
        break;
      case ' ':
        e.preventDefault();
        togglePlayPause();
        break;
      case 'Escape':
        onClose();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="story-modal" onClick={onClose}>
      {/* PROGRESS BAR */}
      <div className="absolute z-50 top-4 left-4 right-4">
        <div className="w-full h-1 rounded-full cursor-pointer bg-white/30" onClick={handleProgressClick}>
          <div
            className="h-full transition-all duration-100 bg-white rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* CLOSE BUTTON */}
      <button className="close-btn" onClick={onClose}>
        <X size={24} />
      </button>

      {/* STORY CONTENT */}
      <div className="story-media-container" onClick={(e) => e.stopPropagation()}>
        {story.media_type === "image" && (
          <img src={getMediaURL(story.media_url)} className="story-media" />
        )}

        {story.media_type === "video" && (
          <video
            ref={videoRef}
            src={getMediaURL(story.media_url)}
            autoPlay
            playsInline
            controls
            onTimeUpdate={handleVideoTimeUpdate}
            className="story-media"
            onClick={togglePlayPause}

          />
        )}

        {story.media_type === "text" && (
          <div
            className="flex items-center justify-center p-8 text-2xl text-center text-white story-media"
            style={{ backgroundColor: story.background_color || '#000' }}
          >
            {story.content}
          </div>
        )}

        {/* PLAY/PAUSE OVERLAY */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <button
              onClick={togglePlayPause}
              className="flex items-center justify-center w-16 h-16 rounded-full bg-white/20"
            >
              <Play size={32} className="ml-1 text-white" />
            </button>
          </div>
        )}

        {/* MUSIC OVERLAY */}
        {story.music_url && (
          <div className="absolute flex items-center gap-3 p-3 rounded-lg bottom-20 left-4 right-4 bg-black/70">
            <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full">
              <Music size={16} className="text-black" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{story.music_title || 'Music'}</p>
              <p className="text-xs text-white/70">Now Playing</p>
            </div>
          </div>
        )}

        {/* POLL OVERLAY */}
        {story.poll_options && story.poll_options.length > 0 && (
          <div className="absolute p-3 rounded-lg bottom-16 left-4 right-4 bg-black/70">
            <h3 className="mb-2 text-sm font-medium text-white">Poll</h3>
            <div className="space-y-2">
              {story.poll_options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handlePollVote(index)}
                  className="w-full p-2 text-sm text-left text-white rounded bg-white/20 hover:bg-white/30"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* QUIZ OVERLAY */}
        {story.quiz_options && story.quiz_options.length > 0 && (
          <div className="absolute p-3 rounded-lg bottom-16 left-4 right-4 bg-black/70">
            <h3 className="mb-2 text-sm font-medium text-white">{story.quiz_options[0]?.question}</h3>
            <div className="space-y-2">
              {story.quiz_options[0]?.answers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => handleQuizAnswer(index)}
                  className="w-full p-2 text-sm text-left text-white rounded bg-white/20 hover:bg-white/30"
                >
                  {answer.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Q&A OVERLAY */}
        {story.qna_enabled && (
          <div className="absolute p-3 rounded-lg bottom-16 left-4 right-4 bg-black/70">
            <h3 className="mb-2 text-sm font-medium text-white">Q&A</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask a question..."
                className="flex-1 px-3 py-1 text-sm text-black rounded"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleQnaSubmit(e.target.value);
                    e.target.value = '';
                  }
                }}
              />
              <button
                className="px-3 py-1 text-sm text-white bg-blue-500 rounded"
                onClick={(e) => {
                  const input = e.target.previousElementSibling;
                  handleQnaSubmit(input.value);
                  input.value = '';
                }}
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* SWIPE LINK OVERLAY */}
        {story.swipe_link && (
          <div className="absolute p-2 text-center rounded-lg top-16 left-4 right-4 bg-black/70">
            <a
              href={story.swipe_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white underline"
            >
              {story.swipe_link_text || 'Learn More'}
            </a>
          </div>
        )}

        {/* USER INFO */}
        <div className="absolute flex items-center gap-3 px-3 py-1 rounded-full top-8 left-4 bg-black/50">
          <img
            src={getImageURL(story.user?.profile_picture)}
            alt=""
            className="w-8 h-8 border-2 border-white rounded-full"
          />
          <div className="text-white">
            <p className="text-sm font-medium">{story.user?.full_name}</p>
            <p className="text-xs opacity-70">{new Date(story.createdAt).toLocaleTimeString()}</p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="absolute flex flex-col gap-3 bottom-4 right-4">
          <button className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-black/50">
            <Heart size={20} />
          </button>
          <button className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-black/50">
            <MessageCircle size={20} />
          </button>
          <button className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-black/50">
            <Send size={20} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (videoRef.current) {
                videoRef.current.muted = !videoRef.current.muted;
              }
            }}
            className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-black/50"
          >
            🔊
          </button>
          <button className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-black/50">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* NAVIGATION AREAS */}
        <div
          className="absolute top-0 bottom-0 left-0 w-1/2 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleSwipe('right');
          }}
        />
        <div
          className="absolute top-0 bottom-0 right-0 w-1/2 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleSwipe('left');
          }}
        />
      </div>
    </div>
  );
}
