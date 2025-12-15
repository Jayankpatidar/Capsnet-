import { Calendar, MapPin, Pen, Verified, Award, Eye, Star, TrendingUp } from 'lucide-react'
import moment from 'moment'
import React from 'react'
import api, { BASE_URL } from '../api/axios'
import { useDispatch } from 'react-redux'
import { endorseSkill } from '../features/users/userSlice'
import { getProfileImageURL } from '../utils/imageUtils'

const UserProfileInfo = ({user,profileId,posts,setShowEdit}) => {
  const dispatch = useDispatch()
  const profileStrength = Math.min(100, (user.profile_picture ? 20 : 0) + (user.bio ? 10 : 0) + (user.skills.length * 5) + (user.experience.length * 10) + (user.certificates.length * 10) + (user.resumes.length * 10))
  return (
    <div className='relative px-6 py-4 bg-white md:px-8 '>
        <div className='flex flex-col items-start gap-6 md:flex-row'>
            <div className="absolute w-32 h-32 overflow-hidden bg-gray-100 border-4 border-white rounded-full shadow-lg -top-16">
                <img
                    src={getProfileImageURL(user.profile_picture)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.src = "/default.png")}
                />
            </div>
            <div className='w-full pt-16 md:pt-0 md:pl-36 '>
                <div className='flex flex-col items-start justify-between md:flex-row'>
                    <div>
                        <div className='flex items-center gap-3'>
                            <h1 className='text-2xl font-bold text-gray-900'>{user.full_name}</h1>
                            <Verified className='w-6 h-6 text-blue-500'/>
                        </div>
                        <p className='text-gray-600'>
                            {user.username ? `@${user.username}` : "Add username"}
                        </p>
                        {user.professional_headline && (
                            <p className='text-gray-700 font-medium'>
                                {user.professional_headline}
                            </p>
                        )}
                    </div>

                    {/* if user is on his profile then we will give edit button to him else not  */}
                    {
                        !profileId && (
                            <button onClick={()=>setShowEdit(true)}
                            className='flex items-center gap-2 px-4 py-2 mt-4 font-medium transition-colors border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 md:mt-0 touch-manipulation min-h-[44px]'>
                                <Pen className='w-4 h-4'/>
                                Edit
                            </button>
                        )
                    }

                </div>
                <p className='max-w-md mt-4 text-sm text-gray-700'>{user.bio}</p>
                <div className='flex flex-wrap items-center mt-4 text-sm text-gray-500 gap-x-6 gap-y-2'>
                    <span className='flex items-center gap-1.5'>
                        <MapPin className='w-4 h-4'/>
                        {user.location ?  user.location: "Add location "}
                    </span>
                    <span className='flex items-center gap-1.5'>
                        <Calendar className='w-4 h-4'/>
                        Joined <span className='font-medium'>{moment(user.createdAt).fromNow()}</span>
                    </span>
                </div>
                <div className='flex items-center gap-6 pt-4 mt-6 border-t border-gray-200 '>
                    <div>
                        <span className='font-bold text-gray-900 sm:text-xl'>{posts.length}</span>
                        <span className='text-xs sm:text-sm text-gray-500 ml-1.5'>Posts</span>
                    </div>
                    <div>
                        <span className='font-bold text-gray-900 sm:text-xl'>{user.followers.length}</span>
                        <span className='text-xs sm:text-sm text-gray-500 ml-1.5'>Followers</span>
                    </div>
                    <div>
                        <span className='font-bold text-gray-900 sm:text-xl'>{user.following.length}</span>
                        <span className='text-xs sm:text-sm text-gray-500 ml-1.5'>Following</span>
                    </div>
                    <div>
                        <span className='font-bold text-gray-900 sm:text-xl'>{user.connections?.length || 0}</span>
                        <span className='text-xs sm:text-sm text-gray-500 ml-1.5'>Connections</span>
                    </div>
                    <div>
                        <span className='font-bold text-gray-900 sm:text-xl'>{user.profileViews || 0}</span>
                        <span className='text-xs sm:text-sm text-gray-500 ml-1.5'>Profile Views</span>
                    </div>
                </div>
                {/* LinkedIn-style Profile Completeness */}
                <div className='mt-4'>
                    <div className='flex items-center gap-2'>
                        <Award className='w-5 h-5 text-blue-600' />
                        <span className='font-medium text-blue-600'>Profile {profileStrength}% complete</span>
                    </div>
                    <div className='w-full h-2 mt-2 bg-gray-200 rounded-full'>
                        <div className='strength-meter' style={{ width: `${profileStrength}%` }}></div>
                    </div>
                    <p className='mt-1 text-xs text-gray-500'>Complete your profile to stand out to recruiters</p>
                </div>
                {/* Skills with Endorsements Graph */}
                {user.skills && user.skills.length > 0 && (
                    <div className='mt-4'>
                        <h3 className='flex items-center gap-2 font-medium'>
                            <Star className='w-4 h-4' />
                            Skills & Endorsements
                        </h3>
                        <div className='flex flex-wrap gap-2 mt-2'>
                            {user.skills.map((skill, idx) => (
                                <div key={idx} className='flex items-center gap-1 px-2 py-1 bg-gray-100 rounded'>
                                    <span>{skill.name}</span>
                                    <span>({skill.endorsements.length})</span>
                                    <button onClick={() => dispatch(endorseSkill({ userIdToEndorse: user._id, skillName: skill.name }))} className='text-xs text-blue-500'>+ Endorse</button>
                                </div>
                            ))}
                        </div>
                        {/* Endorsement Graph */}
                        <div className='mt-3 endorsement-graph'>
                            {user.skills.map((skill, idx) => (
                                <div
                                    key={idx}
                                    className='flex-1 endorsement-bar'
                                    style={{ height: `${Math.max(10, skill.endorsements.length * 10)}px` }}
                                    title={`${skill.name}: ${skill.endorsements.length} endorsements`}
                                ></div>
                            ))}
                        </div>
                    </div>
                )}
                {/* Experience */}
                {user.experience && user.experience.length > 0 && (
                    <div className='mt-4'>
                        <h3 className='font-medium'>Experience</h3>
                        {user.experience.map((exp, idx) => (
                            <div key={idx} className='mt-2'>
                                <p className='font-medium'>{exp.role} at {exp.company}</p>
                                <p className='text-sm text-gray-500'>{moment(exp.start).format('MMM YYYY')} - {exp.end ? moment(exp.end).format('MMM YYYY') : 'Present'}</p>
                                <p className='text-sm'>{exp.description}</p>
                            </div>
                        ))}
                    </div>
                )}
                {/* Badges */}
                {user.badges && user.badges.length > 0 && (
                    <div className='mt-4'>
                        <h3 className='font-medium'>Badges</h3>
                        <div className='flex gap-2 mt-2'>
                            {user.badges.map((badge, idx) => (
                                <span key={idx} className='px-2 py-1 text-xs text-yellow-800 bg-yellow-100 rounded'>{badge}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default UserProfileInfo