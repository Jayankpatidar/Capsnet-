import React from 'react'
import { Eye, MessageSquare, Users, MessageCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { getProfileImageURL } from '../utils/imageUtils';

const Message = () => {
  const { connections } = useSelector((state) => state.connections)
  const navigate = useNavigate()

  return (
    <motion.div
      className='min-h-full p-6 md:p-8 lg:p-12 mobile-fix'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className='max-w-6xl mx-auto'>
        {/* Header Section */}
        <motion.div
          className='mb-8'
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className='flex items-center gap-3 mb-4'>
            <motion.div
              className='p-3 rounded-2xl bg-gradient-primary'
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <MessageCircle className='w-8 h-8 text-white' />
            </motion.div>
            <div>
              <h1 className='text-3xl font-bold md:text-4xl text-text-primary font-poppins'>
                Messages
              </h1>
              <p className='mt-1 text-text-secondary'>Connect and chat with your network</p>
            </div>
          </div>
        </motion.div>

        {/* Connections List */}
        <motion.div
          className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          {connections.map((user, index) => (
            <motion.div
              key={user._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              className='modern-card group'
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className='p-6'>
                <div className='flex items-start gap-4 mb-4'>
                  <motion.div
                    className='relative'
                    whileHover={{ scale: 1.05 }}
                  >
                    <img
                      src={getProfileImageURL(user.profile_picture)}
                      alt={user.full_name}
                      className='object-cover w-16 h-16 border-2 rounded-full border-glass-border'
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/64'; }}
                    />
                    <motion.div
                      className='absolute w-5 h-5 border-2 rounded-full -bottom-1 -right-1 bg-success border-bg-primary'
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                  <div className='flex-1 min-w-0'>
                    <h3 className='font-semibold truncate transition-colors text-text-primary group-hover:text-primary'>
                      {user.full_name}
                    </h3>
                    <p className='text-sm truncate text-text-secondary'>@{user.username}</p>
                    <p className='mt-1 text-sm text-text-secondary line-clamp-2'>{user.bio?.slice(0, 60) || 'No bio available'}...</p>
                  </div>
                </div>

                <div className='flex gap-3'>
                  <motion.button
                    onClick={() => navigate(`/message/${user._id}`)}
                    className='flex-1 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium transition-all duration-200 flex items-center justify-center gap-2 touch-manipulation min-h-[44px]'
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MessageSquare className='w-4 h-4' />
                    Message
                  </motion.button>

                  <motion.button
                    onClick={() => navigate(`/profile/${user._id}`)}
                    className='p-2.5 rounded-xl glass-button hover:bg-bg-secondary text-text-primary transition-all duration-200 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center'
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Eye className='w-4 h-4' />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {connections.length === 0 && (
          <motion.div
            className='py-16 text-center'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className='flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-primary'
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Users className='w-12 h-12 text-white' />
            </motion.div>
            <h3 className='mb-2 text-2xl font-bold text-text-primary'>No connections yet</h3>
            <p className='text-text-secondary'>Start connecting with people to begin messaging</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default Message
