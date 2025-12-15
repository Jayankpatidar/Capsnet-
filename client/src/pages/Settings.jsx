import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import {
  User,
  Shield,
  Bell,
  Settings as SettingsIcon,
  Camera,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Globe,
  Moon,
  Sun,
  Volume2,
  Play,
  Save,
  CheckCircle,
  AlertCircle,
  QrCode
} from 'lucide-react'
import toast from 'react-hot-toast'
import ProfileQRCode from '../components/ProfileQRCode'
import { getProfileImageURL } from '../utils/imageUtils'

const Settings = () => {
  const user = useSelector((state) => state.user.value)
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    // Profile Settings
    full_name: user?.full_name || '',
    username: user?.username || '',
    bio: user?.bio || '',
    skills: user?.skills || [],
    location: user?.location || '',
    website: '',
    linkedin: '',
    twitter: '',

    // Account Settings
    email: user?.email || '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,

    // Privacy Settings
    profileVisibility: 'public',
    messagePermission: 'everyone',
    followPermission: 'everyone',
    storyPrivacy: 'public',

    // Notification Settings
    jobAlerts: true,
    messageNotifications: true,
    networkNotifications: true,
    emailNotifications: true,
    pushNotifications: true,

    // App Settings
    darkMode: localStorage.getItem('theme') === 'dark',
    language: 'en',
    dataSaver: false,
    autoPlayVideos: true
  })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Shield },
    { id: 'privacy', label: 'Privacy', icon: Eye },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'app', label: 'App Settings', icon: SettingsIcon },
    { id: 'qr', label: 'QR Code', icon: QrCode }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async (section) => {
    try {
      // Here you would make API calls to save settings
      toast.success(`${section} settings saved successfully!`)
    } catch (error) {
      toast.error(`Failed to save ${section} settings`)
    }
  }

  const handlePasswordChange = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    // API call to change password
    toast.success('Password changed successfully!')
  }

  const renderProfileSettings = () => (
    <motion.div
      className='space-y-6'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className='flex items-center gap-4 mb-6'>
        <div className='relative'>
          <img
            src={getProfileImageURL(user?.profile_picture)}
            alt='Profile'
            className='object-cover w-20 h-20 border-4 rounded-full border-primary'
          />
          <button className='absolute bottom-0 right-0 p-2 text-white transition-colors rounded-full bg-primary hover:bg-primary/80'>
            <Camera className='w-4 h-4' />
          </button>
        </div>
        <div>
          <h3 className='text-xl font-bold text-text-primary'>Profile Picture</h3>
          <p className='text-text-secondary'>Upload a new profile picture</p>
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <div>
          <label className='block mb-2 text-sm font-medium text-text-primary'>Full Name</label>
          <input
            type='text'
            value={formData.full_name}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
            className='w-full modern-input'
          />
        </div>
        <div>
          <label className='block mb-2 text-sm font-medium text-text-primary'>Username</label>
          <input
            type='text'
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            className='w-full modern-input'
          />
        </div>
      </div>

      <div>
        <label className='block mb-2 text-sm font-medium text-text-primary'>Bio</label>
        <textarea
          value={formData.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          className='w-full h-32 resize-none modern-input'
          placeholder='Tell us about yourself...'
        />
      </div>

      <div>
        <label className='block mb-2 text-sm font-medium text-text-primary'>Skills</label>
        <input
          type='text'
          placeholder='Add skills (comma separated)'
          className='w-full modern-input'
          onChange={(e) => handleInputChange('skills', e.target.value.split(',').map(s => s.trim()))}
        />
        <div className='flex flex-wrap gap-2 mt-2'>
          {formData.skills.map((skill, index) => (
            <span key={index} className='px-3 py-1 text-sm rounded-full bg-primary/10 text-primary'>
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <div>
          <label className='block mb-2 text-sm font-medium text-text-primary'>Location</label>
          <input
            type='text'
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className='w-full modern-input'
            placeholder='City, Country'
          />
        </div>
        <div>
          <label className='block mb-2 text-sm font-medium text-text-primary'>Website</label>
          <input
            type='url'
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            className='w-full modern-input'
            placeholder='https://yourwebsite.com'
          />
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <div>
          <label className='block mb-2 text-sm font-medium text-text-primary'>LinkedIn</label>
          <input
            type='url'
            value={formData.linkedin}
            onChange={(e) => handleInputChange('linkedin', e.target.value)}
            className='w-full modern-input'
            placeholder='https://linkedin.com/in/yourprofile'
          />
        </div>
        <div>
          <label className='block mb-2 text-sm font-medium text-text-primary'>Twitter</label>
          <input
            type='url'
            value={formData.twitter}
            onChange={(e) => handleInputChange('twitter', e.target.value)}
            className='w-full modern-input'
            placeholder='https://twitter.com/yourhandle'
          />
        </div>
      </div>

      <motion.button
        onClick={() => handleSave('Profile')}
        className='px-6 py-3 font-semibold text-white modern-button'
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Save className='inline w-4 h-4 mr-2' />
        Save Profile Settings
      </motion.button>
    </motion.div>
  )

  const renderAccountSettings = () => (
    <motion.div
      className='space-y-6'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className='grid gap-6 md:grid-cols-2'>
        <div>
          <label className='block mb-2 text-sm font-medium text-text-primary'>Email Address</label>
          <div className='relative'>
            <Mail className='absolute w-5 h-5 transform -translate-y-1/2 left-4 top-1/2 text-text-secondary' />
            <input
              type='email'
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className='w-full pl-12 modern-input'
            />
          </div>
        </div>
        <div>
          <label className='block mb-2 text-sm font-medium text-text-primary'>Phone Number</label>
          <div className='relative'>
            <Phone className='absolute w-5 h-5 transform -translate-y-1/2 left-4 top-1/2 text-text-secondary' />
            <input
              type='tel'
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className='w-full pl-12 modern-input'
              placeholder='+1 (555) 123-4567'
            />
          </div>
        </div>
      </div>

      <div className='pt-6 border-t border-border'>
        <h3 className='mb-4 text-lg font-semibold text-text-primary'>Change Password</h3>
        <div className='space-y-4'>
          <div>
            <label className='block mb-2 text-sm font-medium text-text-primary'>Current Password</label>
            <div className='relative'>
              <Lock className='absolute w-5 h-5 transform -translate-y-1/2 left-4 top-1/2 text-text-secondary' />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                className='w-full pl-12 pr-12 modern-input'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute transform -translate-y-1/2 right-4 top-1/2 text-text-secondary'
              >
                {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
              </button>
            </div>
          </div>
          <div className='grid gap-4 md:grid-cols-2'>
            <div>
              <label className='block mb-2 text-sm font-medium text-text-primary'>New Password</label>
              <input
                type='password'
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                className='w-full modern-input'
              />
            </div>
            <div>
              <label className='block mb-2 text-sm font-medium text-text-primary'>Confirm Password</label>
              <input
                type='password'
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className='w-full modern-input'
              />
            </div>
          </div>
          <motion.button
            onClick={handlePasswordChange}
            className='px-6 py-3 font-semibold text-white modern-button'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Change Password
          </motion.button>
        </div>
      </div>

      <div className='pt-6 border-t border-border'>
        <h3 className='mb-4 text-lg font-semibold text-text-primary'>Security</h3>
        <div className='flex items-center justify-between p-4 bg-primary/5 rounded-xl'>
          <div>
            <h4 className='font-medium text-text-primary'>Two-Factor Authentication</h4>
            <p className='text-sm text-text-secondary'>Add an extra layer of security to your account</p>
          </div>
          <label className='relative inline-flex items-center cursor-pointer'>
            <input
              type='checkbox'
              checked={formData.twoFactorEnabled}
              onChange={(e) => handleInputChange('twoFactorEnabled', e.target.checked)}
              className='sr-only peer'
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>

      <div className='pt-6 border-t border-border'>
        <h3 className='mb-4 text-lg font-semibold text-text-primary'>Login Activity</h3>
        <div className='space-y-3'>
          <div className='flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-slate-800'>
            <div>
              <p className='font-medium text-text-primary'>Current Session</p>
              <p className='text-sm text-text-secondary'>Chrome on Windows • Active now</p>
            </div>
            <span className='px-2 py-1 text-xs rounded-full bg-success/10 text-success'>Current</span>
          </div>
          <div className='flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-slate-800'>
            <div>
              <p className='font-medium text-text-primary'>Mobile App</p>
              <p className='text-sm text-text-secondary'>iPhone • 2 hours ago</p>
            </div>
            <button className='text-sm font-medium text-error hover:text-error/80'>Revoke</button>
          </div>
        </div>
      </div>
    </motion.div>
  )

  const renderPrivacySettings = () => (
    <motion.div
      className='space-y-6'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h3 className='mb-4 text-lg font-semibold text-text-primary'>Profile Visibility</h3>
        <div className='space-y-3'>
          {[
            { value: 'public', label: 'Public', desc: 'Anyone can see your profile' },
            { value: 'connections', label: 'Connections Only', desc: 'Only your connections can see your profile' },
            { value: 'private', label: 'Private', desc: 'Only you can see your profile' }
          ].map((option) => (
            <label key={option.value} className='flex items-center p-4 border cursor-pointer border-border rounded-xl hover:bg-primary/5'>
              <input
                type='radio'
                name='profileVisibility'
                value={option.value}
                checked={formData.profileVisibility === option.value}
                onChange={(e) => handleInputChange('profileVisibility', e.target.value)}
                className='mr-3'
              />
              <div>
                <p className='font-medium text-text-primary'>{option.label}</p>
                <p className='text-sm text-text-secondary'>{option.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className='mb-4 text-lg font-semibold text-text-primary'>Who can message you?</h3>
        <select
          value={formData.messagePermission}
          onChange={(e) => handleInputChange('messagePermission', e.target.value)}
          className='w-full max-w-md modern-input'
        >
          <option value='everyone'>Everyone</option>
          <option value='connections'>Connections only</option>
          <option value='none'>No one</option>
        </select>
      </div>

      <div>
        <h3 className='mb-4 text-lg font-semibold text-text-primary'>Who can follow you?</h3>
        <select
          value={formData.followPermission}
          onChange={(e) => handleInputChange('followPermission', e.target.value)}
          className='w-full max-w-md modern-input'
        >
          <option value='everyone'>Everyone</option>
          <option value='connections'>Connections only</option>
        </select>
      </div>

      <div>
        <h3 className='mb-4 text-lg font-semibold text-text-primary'>Story Privacy</h3>
        <select
          value={formData.storyPrivacy}
          onChange={(e) => handleInputChange('storyPrivacy', e.target.value)}
          className='w-full max-w-md modern-input'
        >
          <option value='public'>Public</option>
          <option value='connections'>Connections only</option>
          <option value='close_friends'>Close friends</option>
        </select>
      </div>

      <motion.button
        onClick={() => handleSave('Privacy')}
        className='px-6 py-3 font-semibold text-white modern-button'
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Save className='inline w-4 h-4 mr-2' />
        Save Privacy Settings
      </motion.button>
    </motion.div>
  )

  const renderNotificationSettings = () => (
    <motion.div
      className='space-y-6'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className='space-y-4'>
        {[
          { key: 'jobAlerts', label: 'Job Alerts', desc: 'Get notified about new job opportunities' },
          { key: 'messageNotifications', label: 'Messages', desc: 'Receive notifications for new messages' },
          { key: 'networkNotifications', label: 'Network Activity', desc: 'Updates about your network connections' },
          { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive email updates and newsletters' },
          { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications' }
        ].map((setting) => (
          <div key={setting.key} className='flex items-center justify-between p-4 border border-border rounded-xl'>
            <div>
              <p className='font-medium text-text-primary'>{setting.label}</p>
              <p className='text-sm text-text-secondary'>{setting.desc}</p>
            </div>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                checked={formData[setting.key]}
                onChange={(e) => handleInputChange(setting.key, e.target.checked)}
                className='sr-only peer'
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        ))}
      </div>

      <motion.button
        onClick={() => handleSave('Notification')}
        className='px-6 py-3 font-semibold text-white modern-button'
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Save className='inline w-4 h-4 mr-2' />
        Save Notification Settings
      </motion.button>
    </motion.div>
  )

  const renderAppSettings = () => (
    <motion.div
      className='space-y-6'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className='space-y-4'>
        <div className='flex items-center justify-between p-4 border border-border rounded-xl'>
          <div className='flex items-center gap-3'>
            {formData.darkMode ? <Moon className='w-5 h-5 text-primary' /> : <Sun className='w-5 h-5 text-primary' />}
            <div>
              <p className='font-medium text-text-primary'>Dark Mode</p>
              <p className='text-sm text-text-secondary'>Switch between light and dark themes</p>
            </div>
          </div>
          <label className='relative inline-flex items-center cursor-pointer'>
            <input
              type='checkbox'
              checked={formData.darkMode}
              onChange={(e) => handleInputChange('darkMode', e.target.checked)}
              className='sr-only peer'
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        <div className='p-4 border border-border rounded-xl'>
          <label className='block mb-2 text-sm font-medium text-text-primary'>Language</label>
          <select
            value={formData.language}
            onChange={(e) => handleInputChange('language', e.target.value)}
            className='w-full max-w-md modern-input'
          >
            <option value='en'>English</option>
            <option value='es'>Español</option>
            <option value='fr'>Français</option>
            <option value='de'>Deutsch</option>
            <option value='hi'>हिन्दी</option>
          </select>
        </div>

        <div className='flex items-center justify-between p-4 border border-border rounded-xl'>
          <div className='flex items-center gap-3'>
            <Globe className='w-5 h-5 text-primary' />
            <div>
              <p className='font-medium text-text-primary'>Data Saver</p>
              <p className='text-sm text-text-secondary'>Reduce data usage by compressing images</p>
            </div>
          </div>
          <label className='relative inline-flex items-center cursor-pointer'>
            <input
              type='checkbox'
              checked={formData.dataSaver}
              onChange={(e) => handleInputChange('dataSaver', e.target.checked)}
              className='sr-only peer'
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        <div className='flex items-center justify-between p-4 border border-border rounded-xl'>
          <div className='flex items-center gap-3'>
            <Play className='w-5 h-5 text-primary' />
            <div>
              <p className='font-medium text-text-primary'>Auto-play Videos</p>
              <p className='text-sm text-text-secondary'>Automatically play videos when in view</p>
            </div>
          </div>
          <label className='relative inline-flex items-center cursor-pointer'>
            <input
              type='checkbox'
              checked={formData.autoPlayVideos}
              onChange={(e) => handleInputChange('autoPlayVideos', e.target.checked)}
              className='sr-only peer'
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>

      <motion.button
        onClick={() => handleSave('App')}
        className='px-6 py-3 font-semibold text-white modern-button'
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Save className='inline w-4 h-4 mr-2' />
        Save App Settings
      </motion.button>
    </motion.div>
  )

  const renderQRSettings = () => (
    <motion.div
      className='space-y-6'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className='text-center'>
        <h3 className='mb-4 text-xl font-bold text-text-primary'>Your Profile QR Code</h3>
        <p className='mb-6 text-text-secondary'>Share your profile with others by scanning this QR code</p>
        <ProfileQRCode userId={user?._id} />
      </div>
    </motion.div>
  )

  return (
    <motion.div
      className='min-h-full p-6 md:p-8 lg:p-12 mobile-fix'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
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
            <SettingsIcon className='w-8 h-8 text-white' />
          </motion.div>
          <div>
            <h1 className='text-3xl font-bold md:text-4xl text-text-primary font-poppins'>
              Settings
            </h1>
            <p className='mt-1 text-text-secondary'>Manage your account and preferences</p>
          </div>
        </div>
      </motion.div>

      <div className='grid gap-8 lg:grid-cols-4'>
        {/* Sidebar */}
        <motion.div
          className='lg:col-span-1'
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className='sticky p-6 modern-card top-6'>
            <nav className='space-y-2'>
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary/10 text-primary shadow-sm'
                        : 'hover:bg-primary/5 text-text-primary'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className='w-5 h-5' />
                    <span className='font-medium'>{tab.label}</span>
                  </motion.button>
                )
              })}
            </nav>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          className='lg:col-span-3'
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className='p-8 modern-card'>
            {activeTab === 'profile' && renderProfileSettings()}
            {activeTab === 'account' && renderAccountSettings()}
            {activeTab === 'privacy' && renderPrivacySettings()}
            {activeTab === 'notifications' && renderNotificationSettings()}
            {activeTab === 'app' && renderAppSettings()}
            {activeTab === 'qr' && renderQRSettings()}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Settings
