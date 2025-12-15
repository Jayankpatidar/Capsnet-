import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  UserPlus, UserCheck, UserRoundPen, MessageSquare, User, Users, Sparkles,
  Shield, ShieldCheck, X, Check, Eye, EyeOff, UserMinus, UserX
} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchConnections,
  followUser,
  followBack,
  unfollowUser,
  removeFollower,
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  fetchSuggestedUsers,
  blockUser,
  unblockUser,
  restrictUser,
  unrestrictUser,
  getMutualConnections
} from '../features/connections/connectionsSlice'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { motion } from 'framer-motion'
import { getProfileImageURL } from '../utils/imageUtils';

const Connections = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [currentTab, setCurrentTab] = useState("Connections")
  const [selectedUser, setSelectedUser] = useState(null)
  const [showMutual, setShowMutual] = useState(false)

  const {
    connections = [],
    pendingConnections = [],
    followers = [],
    following = [],
    suggestedUsers = [],
    mutualConnections = [],
    loading
  } = useSelector((state) => state.connections || {})

  const dataArray = [
    { label: "Connections", value: connections, icon: Users },
    { label: "Pending", value: pendingConnections, icon: UserRoundPen },
    { label: "Followers", value: followers, icon: User },
    { label: "Following", value: following, icon: UserCheck },
    { label: "Suggested", value: suggestedUsers, icon: Sparkles },
  ]

  const handleUnfollow = async (userId) => {
    try {
      const { data } = await api.post("/user/unfollow", { id: userId })
      if (data.success) {
        toast.success(data.message)
      } else {
        toast.success(data.message)
        console.log(data.message)
      }
      await dispatch(fetchConnections())
    } catch (error) {
      console.log(error.message)
      toast.error(error.message)
    }
  }

  const acceptConnection = async (userId) => {
    try {
      const { data } = await api.post("/user/accept", { id: userId })
      if (data.success) {
        toast.success(data.message)
        await dispatch(fetchConnections())
      } else {
        toast.success(data.message)
      }
    } catch (error) {
      console.log(error.message)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchConnections())
      await dispatch(fetchSuggestedUsers())
    }
    fetchData()
  }, [dispatch])

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
              <Users className='w-8 h-8 text-white' />
            </motion.div>
            <div>
              <h1 className='text-3xl font-bold md:text-4xl text-text-primary font-poppins'>
                My Network
              </h1>
              <p className='mt-1 text-text-secondary'>Manage your connections and grow your professional network</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className='grid grid-cols-2 gap-4 mb-8 md:grid-cols-4'
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
          {dataArray.map((item, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              className='flex flex-col items-center justify-center p-6 cursor-pointer modern-card group'
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <motion.div
                className='p-3 mb-3 rounded-xl bg-primary/10 group-hover:bg-primary/20'
                whileHover={{ rotate: 5 }}
              >
                <item.icon className='w-6 h-6 text-primary' />
              </motion.div>
              <span className='mb-1 text-2xl font-bold text-text-primary'>{item.value.length}</span>
              <span className='text-sm font-medium text-text-secondary'>{item.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div
          className='flex flex-wrap gap-2 p-2 mb-8 glass-card rounded-2xl'
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {dataArray.map((tab) => (
            <motion.button
              key={tab.label}
              onClick={() => setCurrentTab(tab.label)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 touch-manipulation min-h-[48px] ${
                currentTab === tab.label
                  ? "bg-primary text-white shadow-lg"
                  : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon className='w-5 h-5' />
              <span>{tab.label}</span>
              <span className='px-2 py-1 ml-2 text-xs rounded-full bg-white/20'>
                {tab.value.length}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Connections Grid */}
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
          {dataArray.find((item) => item.label === currentTab)?.value?.map((user, index) => (
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
                      className='object-cover w-16 h-16 border-2 rounded-full border-glass-border'
                      src={getProfileImageURL(user.profile_picture)}
                      alt={user.full_name}
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

                <div className='space-y-3'>
                  <motion.button
                    onClick={() => navigate(`/profile/${user._id}`)}
                    className='w-full py-2.5 px-4 rounded-xl glass-button hover:bg-primary/10 text-text-primary font-medium transition-all duration-200 touch-manipulation min-h-[44px]'
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Profile
                  </motion.button>

                  {currentTab === "Connections" && (
                    <>
                      <motion.button
                        onClick={() => handleViewMutual(user._id)}
                        className='w-full py-2.5 px-4 rounded-xl glass-button hover:bg-blue-50 text-blue-600 font-medium transition-all duration-200 touch-manipulation min-h-[44px]'
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Eye className='inline w-4 h-4 mr-2' />
                        Mutual Connections
                      </motion.button>
                      <motion.button
                        onClick={() => navigate(`/message/${user._id}`)}
                        className='w-full py-2.5 px-4 rounded-xl glass-button hover:bg-accent/10 text-accent font-medium transition-all duration-200 flex items-center justify-center gap-2 touch-manipulation min-h-[44px]'
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <MessageSquare className='w-4 h-4' />
                        Message
                      </motion.button>
                    </>
                  )}

                  {currentTab === "Following" && (
                    <motion.button
                      onClick={() => handleUnfollow(user._id)}
                      className='w-full py-2.5 px-4 rounded-xl bg-error/10 hover:bg-error/20 text-error font-medium transition-all duration-200 touch-manipulation min-h-[44px]'
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <UserMinus className='inline w-4 h-4 mr-2' />
                      Unfollow
                    </motion.button>
                  )}

                  {currentTab === "Followers" && (
                    <>
                      <motion.button
                        onClick={() => handleFollowBack(user._id)}
                        className='w-full py-2.5 px-4 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium transition-all duration-200 touch-manipulation min-h-[44px]'
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <UserPlus className='inline w-4 h-4 mr-2' />
                        Follow Back
                      </motion.button>
                      <motion.button
                        onClick={() => handleRemoveFollower(user._id)}
                        className='w-full py-2.5 px-4 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-medium transition-all duration-200 touch-manipulation min-h-[44px]'
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <UserX className='inline w-4 h-4 mr-2' />
                        Remove
                      </motion.button>
                    </>
                  )}

                  {currentTab === "Pending" && (
                    <>
                      <motion.button
                        onClick={() => handleAcceptRequest(user._id)}
                        className='w-full py-2.5 px-4 rounded-xl bg-success/10 hover:bg-success/20 text-success font-medium transition-all duration-200 touch-manipulation min-h-[44px]'
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Check className='inline w-4 h-4 mr-2' />
                        Accept
                      </motion.button>
                      <motion.button
                        onClick={() => handleRejectRequest(user._id)}
                        className='w-full py-2.5 px-4 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-medium transition-all duration-200 touch-manipulation min-h-[44px]'
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <X className='inline w-4 h-4 mr-2' />
                        Reject
                      </motion.button>
                    </>
                  )}

                  {currentTab === "Suggested" && (
                    <>
                      <motion.button
                        onClick={() => handleFollow(user._id)}
                        className='w-full py-2.5 px-4 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium transition-all duration-200 touch-manipulation min-h-[44px]'
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <UserPlus className='inline w-4 h-4 mr-2' />
                        Follow
                      </motion.button>
                      <motion.button
                        onClick={() => handleSendRequest(user._id)}
                        className='w-full py-2.5 px-4 rounded-xl bg-green-100 hover:bg-green-200 text-green-700 font-medium transition-all duration-200 touch-manipulation min-h-[44px]'
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Users className='inline w-4 h-4 mr-2' />
                        Connect
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {dataArray.find((item) => item.label === currentTab).value.length === 0 && (
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
            <h3 className='mb-2 text-2xl font-bold text-text-primary'>No {currentTab.toLowerCase()} yet</h3>
            <p className='text-text-secondary'>Start building your network to see connections here</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default Connections
