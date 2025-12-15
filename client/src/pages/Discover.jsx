import React, { useEffect, useState } from 'react'
import { Search, Users, Sparkles, Compass } from 'lucide-react'
import UserCard from '../components/UserCard'
import Loading from '../components/Loading'
import api from '../api/axios'
import toast from "react-hot-toast"
import { useDispatch } from 'react-redux'
import { fetchUser } from '../features/users/userSlice'
import { motion } from 'framer-motion'

const Discover = () => {
  const dispatch = useDispatch()
  const [input, setInput] = useState("")
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)

  const handleInput = async (e) => {
    if (e.key === "Enter" && input.trim()) {
      try {
        setUsers([])
        setLoading(true)
        setSearchPerformed(true)
        const { data } = await api.post("/user/discover", { input })
        if (data.success) {
          setUsers(data.user)
        } else {
          toast.error(data.message)
        }
        setLoading(false)
      } catch (error) {
        toast.error(error.message)
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchUser())
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
              <Compass className='w-8 h-8 text-white' />
            </motion.div>
            <div>
              <h1 className='text-3xl font-bold md:text-4xl text-text-primary font-poppins'>
                Discover People
              </h1>
              <p className='mt-1 text-text-secondary'>Connect with amazing people and grow your professional network</p>
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className='mb-8'
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className='p-6 glass-card rounded-2xl'>
            <div className='relative'>
              <Search className='absolute w-5 h-5 transform -translate-y-1/2 left-4 top-1/2 text-text-secondary' />
              <input
                type="text"
                placeholder='Search people by name, username, bio or location...'
                className='w-full py-4 pl-12 pr-4 text-lg modern-input rounded-xl'
                onChange={(e) => setInput(e.target.value)}
                value={input}
                onKeyUp={handleInput}
              />
            </div>
            <motion.p
              className='flex items-center gap-2 mt-3 text-sm text-text-secondary'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Sparkles className='w-4 h-4' />
              Press Enter to search for people
            </motion.p>
          </div>
        </motion.div>

        {/* Results Header */}
        {searchPerformed && (
          <motion.div
            className='mb-6'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className='mb-2 text-xl font-semibold text-text-primary'>
              Search Results {users.length > 0 && `(${users.length})`}
            </h2>
          </motion.div>
        )}

        {/* User Cards Grid */}
        {users.length > 0 ? (
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
            {users.map((user, index) => (
              <motion.div
                key={user._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
              >
                <UserCard user={user} />
              </motion.div>
            ))}
          </motion.div>
        ) : searchPerformed && !loading ? (
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
            <h3 className='mb-2 text-2xl font-bold text-text-primary'>No people found</h3>
            <p className='text-text-secondary'>Try adjusting your search terms or explore different keywords</p>
          </motion.div>
        ) : !searchPerformed ? (
          <motion.div
            className='py-16 text-center'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className='flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-primary'
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Compass className='w-12 h-12 text-white' />
            </motion.div>
            <h3 className='mb-2 text-2xl font-bold text-text-primary'>Start Exploring</h3>
            <p className='text-text-secondary'>Search for people to connect with and expand your network</p>
          </motion.div>
        ) : null}

        {/* Loading State */}
        {loading && (
          <motion.div
            className='flex justify-center py-16'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Loading height='40vh' />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default Discover
