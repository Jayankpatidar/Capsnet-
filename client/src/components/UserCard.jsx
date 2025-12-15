import React from 'react'
import { getProfileImageURL } from '../utils/imageUtils';
import { MapPin, MessagesSquare, Plus, UserPlus } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux"
import api from '../api/axios';
import toast from "react-hot-toast"
import { fetchUser } from '../features/users/userSlice';
import { useNavigate } from "react-router-dom";

const UserCard = ({ user, showSkills = false }) => {

    const currentUser = useSelector((state) => state.user.value);;

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleFollow = async () => {
        try {
            const { data } = await api.post("/ user/follow", { id: user._id })
            if (data.success) {
                toast.success(data.message)
                dispatch(fetchUser())
            } else {
                toast(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong')
        }
    }
    const handleConnectionRequest = async () => {

        if(currentUser.connections.includes(user._id)){
            return navigate("/message/" + user._id)
        }

        try {
            const { data } = await api.post("/user/connect", { id: user._id })
            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div key={user._id}
            className='flex flex-col justify-between p-4 pt-6 border border-gray-200 rounded-md shadow w-72'>
            <div className='text-center'>
                <img src={getProfileImageURL(user.profile_picture)} alt={`${user.full_name} profile`} className='w-16 mx-auto rounded-full shadow-md object-cover' />
                <p className='mt-4 font-semibold'>{user.full_name}</p>
                {
                    user.username && (<p className='font-light text-gray-500 '>@{user.username}</p>)
                }
                {
                    user.bio && (<p className='px-4 mt-2 text-sm text-center text-gray-600'>{user.bio}</p>)
                }
                {showSkills && user.skills && user.skills.length > 0 && (
                    <div className='mt-3'>
                        <p className='mb-2 text-sm font-medium text-gray-700'>Skills:</p>
                        <div className='flex flex-wrap justify-center gap-1'>
                            {user.skills.slice(0, 3).map(skill => (
                                <span key={skill} className='px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full'>
                                    {skill}
                                </span>
                            ))}
                            {user.skills.length > 3 && (
                                <span className='px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full'>
                                    +{user.skills.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                )}

            </div>
            <div className='flex items-center justify-center gap-2 mt-2 text-xs text-gray-600'>
                <div className='flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-full'>
                    <MapPin className='w-4 h-4 ' /> {user.location}
                </div>
                <div className='flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-full'>
                    <span>{user.followers.length}</span> Followers
                </div>
            </div>

            <div className='flex gap-2 mt-4 '>
                {/* Follow Button */}
                <button onClick={handleFollow} disabled={currentUser?.following.includes(user._id)}
                    className='flex items-center justify-center w-full gap-2 py-2 text-white transition rounded-full cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95'>
                    <UserPlus className="w-4 h-4" />
                    {currentUser?.following.includes(user._id) ? "Following" : "Follow"}
                </button>
                {/* Connection request and message button */}
                <button onClick={handleConnectionRequest}
                    className='flex items-center justify-center w-16 transition border rounded-md cursor-pointer text-slate-500 group active:scale-95'>
                    {
                        currentUser?.connections.includes(user._id)
                            ? (
                                <MessagesSquare className='w-5 h-5 transition group-hover:scale-105' />
                            )
                            : (
                                <Plus className='w-5 h-5 transition group-hover:scale-105' />
                            )
                    }
                </button>
            </div>

        </div>
    )
}

export default UserCard
