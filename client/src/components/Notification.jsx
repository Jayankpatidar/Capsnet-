import React from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { getProfileImageURL } from '../utils/imageUtils';

const Notification = ({ t, message }) => {

    const navigate = useNavigate()

    return (
        <div className={`max-w-md w-full bg-white shadow-lg rounded-lg flex border
         border-gray-300 hover:scale-105 transition mobile-fix`}>
            <div className='flex-1 p-3 md:p-4'>
                <div className='flex items-start'>
                    <img src={getProfileImageURL(message.from_user_id.profile_picture)}
                        className='h-10 w-10 rounded-full flex-shrink-0 mt-0.5 object-cover' alt="" />
                    <div className='ml-3 flex-1'>
                        <p className='text-sm font-medium text-gray-900'>{message.from_user_id.full_name}</p>
                        <p className='text-sm text-gray-500'>{String(message.text || '').slice(0, 50)}</p>
                    </div>
                </div>
            </div>
            <div className='flex border-l border-gray-200'>
                <button onClick={() => {
                    navigate(`/message/${message.from_user_id._id}`)
                    toast.dismiss(t.id)
                }}
                    className='p-3 md:p-4 text-indigo-600 font-semibold touch-manipulation min-h-[44px] min-w-[44px]'>
                    Reply
                </button>
            </div>
        </div>
    )
}

export default Notification