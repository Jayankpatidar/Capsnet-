import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets';
import Loading from '../components/Loading';
import StoriesBar from '../components/StoriesBar';
import PostCard from '../components/PostCard';
import RecentMessages from '../components/RecentMessages';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Briefcase, Users, TrendingUp, MessageCircle, Sparkles, Zap, Heart, UserPlus } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { getImageURL } from '../utils/imageUtils';
import { fetchPosts } from '../features/posts/postSlice';

const Feed = () => {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state) => state.posts);
  const user = useSelector((state) => state.user.value);
  const [followSuggestions, setFollowSuggestions] = useState([]);
  const [sponsoredPosts, setSponsoredPosts] = useState([]);

  const fetchFeeds = async () => {
    dispatch(fetchPosts());
  }

  // Timeout to prevent infinite loading if server is down
  useEffect(() => {
    const timeout = setTimeout(() => {
      // Prevent infinite loading if server is down
    }, 5000)
    return () => clearTimeout(timeout)
  }, [])

  const fetchFollowSuggestions = async () => {
    try {
      const { data } = await api.get('/user/suggested-users')
      if (data.success) {
        setFollowSuggestions(data.users.slice(0, 5))
      }
    } catch (error) {
      console.error('Failed to fetch suggestions')
    }
  }

  const fetchSponsoredPosts = async () => {
    try {
      const { data } = await api.get('/post/sponsored')
      if (data.success) {
        setSponsoredPosts(data.posts.slice(0, 2))
      }
    } catch (error) {
      console.error('Failed to fetch sponsored posts')
    }
  }

  const handleFollow = async (userId) => {
    try {
      const { data } = await api.post('/user/follow', { userId })
      if (data.success) {
        setFollowSuggestions(prev => prev.filter(user => user._id !== userId))
        toast.success('Followed successfully!')
      }
    } catch (error) {
      toast.error('Failed to follow')
    }
  }

  useEffect(() => {
    if (user) {
      const loadFeed = async () => {
        await Promise.all([
          fetchFeeds(),
          fetchFollowSuggestions(),
          fetchSponsoredPosts()
        ])
      }
      loadFeed()
    }
  }, [user])

  return (
    <motion.div
      className='flex flex-col items-center justify-center py-6 overflow-y-scroll no-scrollbar md:py-8 lg:py-12 xl:pr-6 xl:flex-row xl:items-start xl:gap-8 mobile-fix'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Stories and Posts */}
      <motion.div
        className='w-full max-w-2xl px-4 md:px-6 xl:px-0'
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <StoriesBar/>
        {/* Follow Suggestions */}
        {followSuggestions.length > 0 && (
          <motion.div
            className='p-4 modern-card'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className='flex items-center gap-2 mb-4'>
              <UserPlus className='w-5 h-5 text-primary' />
              <h3 className='font-semibold text-text-primary'>People you may know</h3>
            </div>
            <div className='flex gap-4 pb-2 overflow-x-auto'>
              {followSuggestions.map((user) => (
                <motion.div
                  key={user._id}
                  className='flex flex-col items-center min-w-20'
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={getImageURL(user.profile_picture)}
                    alt={user.username}
                    className='object-cover w-12 h-12 mb-2 rounded-full'
                  />
                  <p className='text-sm font-medium truncate text-text-primary max-w-16'>
                    {user.username}
                  </p>
                  <motion.button
                    onClick={() => handleFollow(user._id)}
                    className='px-3 py-1 mt-2 text-xs text-white rounded-full bg-primary'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Follow
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          className='space-y-4 md:space-y-6 lg:space-y-8'
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          {/* Sponsored Posts */}
          {sponsoredPosts.map((post, index) => (
            <motion.div
              key={`sponsored-${post._id}`}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className='relative'>
                <PostCard post={post} />
                <motion.div
                  className='absolute flex items-center gap-1 px-2 py-1 text-xs font-medium text-white rounded-full top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500'
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Sparkles className='w-3 h-3' />
                  Sponsored
                </motion.div>
              </div>
            </motion.div>
          ))}

          {/* Regular Posts */}
          {posts.map((post, index)=>(
            <motion.div
              key={post._id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <PostCard post={post}/>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Right Sidebar - Hidden on mobile */}
      <motion.div
        className='hidden space-y-6 xl:block xl:sticky xl:top-0'
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {/* Modern Quick Actions */}
        <motion.div
          className='max-w-sm p-6 glass-card rounded-2xl modern-card'
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <motion.div
            className='flex items-center gap-2 mb-4'
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Zap className='w-5 h-5 text-accent' />
            </motion.div>
            <h3 className='text-lg font-bold text-text-primary'>Quick Actions</h3>
          </motion.div>

          <div className='space-y-3'>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/jobs" className='flex items-center gap-4 p-3 transition-all duration-200 rounded-xl glass-button hover:bg-primary/10 group'>
                <motion.div
                  className='p-2 transition-colors rounded-lg bg-primary/20 group-hover:bg-primary/30'
                  whileHover={{ rotate: 5 }}
                >
                  <Briefcase className='w-5 h-5 text-primary' />
                </motion.div>
                <span className='font-medium text-text-primary'>Find Jobs</span>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/connections" className='flex items-center gap-4 p-3 transition-all duration-200 rounded-xl glass-button hover:bg-accent/10 group'>
                <motion.div
                  className='p-2 transition-colors rounded-lg bg-accent/20 group-hover:bg-accent/30'
                  whileHover={{ rotate: 5 }}
                >
                  <Users className='w-5 h-5 text-accent' />
                </motion.div>
                <span className='font-medium text-text-primary'>Grow Network</span>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/reels" className='flex items-center gap-4 p-3 transition-all duration-200 rounded-xl glass-button hover:bg-warning/10 group'>
                <motion.div
                  className='p-2 transition-colors rounded-lg bg-warning/20 group-hover:bg-warning/30'
                  whileHover={{ rotate: 5 }}
                >
                  <TrendingUp className='w-5 h-5 text-warning' />
                </motion.div>
                <span className='font-medium text-text-primary'>Watch Videos</span>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/message" className='flex items-center gap-4 p-3 transition-all duration-200 rounded-xl glass-button hover:bg-success/10 group'>
                <motion.div
                  className='p-2 transition-colors rounded-lg bg-success/20 group-hover:bg-success/30'
                  whileHover={{ rotate: 5 }}
                >
                  <MessageCircle className='w-5 h-5 text-success' />
                </motion.div>
                <span className='font-medium text-text-primary'>Send Message</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* AI Features Spotlight */}
        <motion.div
          className='max-w-sm p-6 glass-card rounded-2xl modern-card'
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <motion.div
            className='flex items-center gap-2 mb-4'
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className='w-5 h-5 text-primary animate-glow' />
            </motion.div>
            <h3 className='text-lg font-bold text-text-primary'>AI Features</h3>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link to="/ai-dashboard" className='flex items-center gap-4 p-4 font-semibold text-white transition-all duration-300 rounded-xl bg-gradient-animated hover:shadow-lg group'>
              <motion.div
                className='p-2 rounded-lg bg-white/20'
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Sparkles className='w-5 h-5' />
              </motion.div>
              <span>Explore AI Tools</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Trending Topics */}
        <motion.div
          className='max-w-sm p-6 glass-card rounded-2xl modern-card'
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <motion.div
            className='flex items-center gap-2 mb-4'
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <TrendingUp className='w-5 h-5 text-primary' />
            <h3 className='text-lg font-bold text-text-primary'>Trending Topics</h3>
          </motion.div>
          <div className='space-y-2'>
            {['#TechInnovation', '#StartupLife', '#DigitalMarketing', '#RemoteWork'].map((topic, index) => (
              <motion.div
                key={topic}
                className='flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700'
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className='text-sm font-medium text-primary'>{topic}</span>
                <span className='text-xs text-text-secondary'>{Math.floor(Math.random() * 1000)} posts</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Sponsored Section */}
        <motion.div
          className='max-w-sm p-6 glass-card rounded-2xl modern-card'
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <motion.div
            className='flex items-center gap-2 mb-4'
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <Heart className='w-5 h-5 text-error animate-float' />
            <h3 className='text-lg font-bold text-text-primary'>Sponsored</h3>
          </motion.div>

          <motion.img
            src={assets.sponsored_img}
            className='object-cover w-full h-32 mb-4 rounded-xl'
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          />
          <p className='mb-2 font-medium text-text-secondary'>Email Marketing Platform</p>
          <p className='text-sm leading-relaxed text-text-secondary'>Supercharge your marketing with a powerful, easy-to-use platform built for results.</p>
        </motion.div>

        <RecentMessages/>
      </motion.div>
      {/* Debug: Add visible content */}
      <div className="text-black dark:text-white">Feed Page End</div>
    </motion.div>
  )
}

export default Feed
