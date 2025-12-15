import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { useSelector } from 'react-redux'
import api from '../api/axios'
import toast, { } from "react-hot-toast"
import { getProfileImageURL } from '../utils/imageUtils';

const RecentMessages = () => {

    const [messages, setMessages] = useState([])
    const user = useSelector((state) => state.user.value)

    const fetchRecentMessages = async () => {
        try {
            const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null
            const { data } = await api.get("/user/recent-messages", {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                const groupedMessages = data.messages.reduce((acc, message) => {
                    const senderId = message.from_user_id._id

                    if (!acc[senderId] || new Date(message.createdAt) > new Date(acc[senderId].createdAt)) {
                        acc[senderId] = message
                    }
                    return acc
                }, {})

                const sortedMessages = Object.values(groupedMessages).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

                setMessages(sortedMessages)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (user) {
            fetchRecentMessages()
            setInterval(fetchRecentMessages, 30000);
            return () => { clearInterval() }
        }
    }, [user])

    return (
        <div className='max-w-xs p-4 mt-4 text-xs bg-white rounded-md shadow min-h-20 text-slate-800'>
            <h3 className='mb-4 font-semibold text-slate-8'>
                Recent Messages
            </h3>
            <div className='flex flex-col overflow-y-scroll max-h-56 no-scrollbar'>
                {
                    messages.map((message, index) => (
                        <Link to={`/message/${message.from_user_id._id}`} key={index} className='flex items-start gap-2 py-2 hover:bg-slate-100'>
                            <img src={getProfileImageURL(message.from_user_id.profile_picture)} alt={`${message.from_user_id.full_name} profile`} className='w-8 h-8 rounded-full' />
                            <div className='w-full'>
                                <div className='flex justify-between'>
                                    <p className='font-medium'>{message.from_user_id.full_name}</p>
                                    <p className='text-[10px] text-slate-400'>{moment(message.createdAt).fromNow()}</p>
                                </div>
                                <div className='flex justify-between'>
                                    <p className='text-gray-500'>{message.text ? message.text : "Media"}</p>
                                    {!message.seen && <p className='bg-indigo-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-[10px]'>1</p>}
                                </div>
                            </div>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default RecentMessages