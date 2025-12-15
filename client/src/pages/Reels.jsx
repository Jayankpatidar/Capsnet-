import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MoreHorizontal, Heart, MessageCircle, Share, Play, Volume2, VolumeX } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getProfileImageURL } from '../utils/imageUtils';
import { fetchReels, toggleLikeReel, addComment, shareReel } from '../features/reels/reelSlice';

const Reels = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { reels, loading } = useSelector((state) => state.reels);
  const user = useSelector((state) => state.user.value);
  const videoRefs = useRef({});
  const [analytics, setAnalytics] = useState({});
  const [viewedReels, setViewedReels] = useState(new Set());
  const [mutedVideos, setMutedVideos] = useState({});
  const [commentText, setCommentText] = useState('');
  const [activeReelId, setActiveReelId] = useState(null);

  useEffect(() => {
    dispatch(fetchReels());
  }, [dispatch, location.pathname]);

  const handleLike = (reelId) => {
    dispatch(toggleLikeReel({ reelId }));
  };

  const toggleMute = (reelId) => {
    const video = videoRefs.current[reelId];
    if (video) {
      video.muted = !video.muted;
      setMutedVideos(prev => ({ ...prev, [reelId]: video.muted }));
    }
  };

  const handleComment = (reelId) => {
    if (commentText.trim()) {
      dispatch(addComment({ reelId, text: commentText.trim() }));
      setCommentText('');
      setActiveReelId(null);
    }
  };

  const handleShare = (reelId) => {
    dispatch(shareReel({ reelId }));
  };

  return (
    <div className='min-h-screen text-white bg-black'>
      {/* Header */}
      <div className='sticky top-0 z-10 flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-pink-600 backdrop-blur-sm'>
        <h1 className='text-xl font-bold text-white'>Reels & Shorts</h1>
        <div className='flex gap-2'>
          <motion.button
            onClick={() => navigate('/create-reel')}
            className='p-2 rounded-full bg-white/10 backdrop-blur-sm'
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Plus className='w-5 h-5' />
          </motion.button>
          <motion.button
            className='p-2 rounded-full bg-white/10 backdrop-blur-sm'
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <MoreHorizontal className='w-5 h-5' />
          </motion.button>
        </div>
      </div>

      {/* Reels Feed */}
      <div className='flex flex-col'>
        {loading ? (
          <div className='flex items-center justify-center h-64'>
            <div className='w-8 h-8 border-b-2 border-white rounded-full animate-spin'></div>
          </div>
        ) : reels.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-64 text-gray-400'>
            <Play className='w-16 h-16 mb-4' />
            <p>No reels yet</p>
            <p className='text-sm'>Be the first to create a reel!</p>
          </div>
        ) : (
          reels.map((reel) => (
            <div key={reel._id} className='relative flex items-center justify-center h-screen bg-black'>
              <video
                ref={(el) => (videoRefs.current[reel._id] = el)}
                src={reel.video_url}
                className='object-cover w-full h-full'
                loop
                playsInline
                autoPlay
                onClick={() => {
                  const video = videoRefs.current[reel._id];
                  if (video) {
                    // Try to enable sound on user interaction
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                      playPromise.then(() => {
                        video.muted = false;
                        setMutedVideos(prev => ({ ...prev, [reel._id]: false }));
                      }).catch(error => {
                        console.log('Video play failed:', error);
                      });
                    }
                  }
                }}
                onLoadedData={() => {
                  const video = videoRefs.current[reel._id];
                  if (video) {
                    // Start with sound enabled
                    video.muted = false;
                    setMutedVideos(prev => ({ ...prev, [reel._id]: false }));
                  }
                }}
              />
              
              {/* Volume Button */}
              <div className='absolute top-4 right-4'>
                <motion.button
                  onClick={() => toggleMute(reel._id)}
                  className='p-2 rounded-full bg-black/50 backdrop-blur-sm'
                  whileTap={{ scale: 0.9 }}
                >
                  {mutedVideos[reel._id] !== false ? <VolumeX className='w-5 h-5' /> : <Volume2 className='w-5 h-5' />}
                </motion.button>
              </div>

              {/* Overlay */}
              <div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50' />
              
              {/* Content */}
              <div className='absolute text-white bottom-20 left-4 right-16'>
                <div className='flex items-center gap-2 mb-2'>
                  <img 
                    src={getProfileImageURL(reel.user?.profile_picture)} 
                    alt={reel.user?.username}
                    className='w-8 h-8 rounded-full object-cover'
                  />
                  <span className='font-semibold'>{reel.user?.username}</span>
                </div>
                <p className='mb-2 text-sm'>{reel.caption || reel.content || 'No caption'}</p>
                <p className='text-xs text-gray-300'>Video URL: {reel.video_url || reel.mediaUrl}</p>
                {reel.hashtags && reel.hashtags.length > 0 && (
                  <div className='flex flex-wrap gap-1 mb-2'>
                    {reel.hashtags.map((tag, index) => (
                      <span key={index} className='text-sm text-blue-400'>#{tag}</span>
                    ))}
                  </div>
                )}

                {/* Comment Input */}
                {activeReelId === reel._id && (
                  <div className='p-3 mt-4 rounded-lg bg-black/50 backdrop-blur-sm'>
                    <div className='flex gap-2'>
                      <input
                        type='text'
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder='Add a comment...'
                        className='flex-1 px-3 py-2 text-white placeholder-gray-400 rounded-lg bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        onKeyPress={(e) => e.key === 'Enter' && handleComment(reel._id)}
                      />
                      <motion.button
                        onClick={() => handleComment(reel._id)}
                        className='px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg'
                        whileTap={{ scale: 0.9 }}
                      >
                        Post
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className='absolute flex flex-col gap-4 right-4 bottom-20'>
                <motion.button
                  onClick={() => handleLike(reel._id)}
                  className='flex flex-col items-center gap-1'
                  whileTap={{ scale: 0.9 }}
                >
                  <div className='p-2 rounded-full bg-black/20'>
                    <Heart className={`w-6 h-6 ${reel.likes?.includes(user?._id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </div>
                  <span className='text-xs'>{reel.likes?.length || 0}</span>
                </motion.button>
                
                <motion.button
                  onClick={() => setActiveReelId(activeReelId === reel._id ? null : reel._id)}
                  className='flex flex-col items-center gap-1'
                  whileTap={{ scale: 0.9 }}
                >
                  <div className='p-2 rounded-full bg-black/20'>
                    <MessageCircle className='w-6 h-6' />
                  </div>
                  <span className='text-xs'>{reel.comments?.length || 0}</span>
                </motion.button>

                <motion.button
                  onClick={() => handleShare(reel._id)}
                  className='flex flex-col items-center gap-1'
                  whileTap={{ scale: 0.9 }}
                >
                  <div className='p-2 rounded-full bg-black/20'>
                    <Share className='w-6 h-6' />
                  </div>
                  <span className='text-xs'>{reel.analytics?.shares || 0}</span>
                </motion.button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reels;
