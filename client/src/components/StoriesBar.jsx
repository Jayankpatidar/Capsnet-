import React, { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import moment from "moment"
import StoryModel from './StoryModel'
import StoryViewer from './StoryViewer'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { getProfileImageURL } from '../utils/imageUtils';

const StoriesBar = () => {

    const [stories, setStories] = useState([])
    const [showModel, setShowModel] = useState(false)
    const [activeStory, setActiveStory] = useState(null)

    const user = useSelector(state => state.auth?.user)

    const fetchStories = async () => {
        try {
            const { data } = await api.get("/story/get")
            if (data.success) {
                // Filter out expired stories
                const now = new Date()
                const activeStories = data.stories.filter(story => !story.expiresAt || new Date(story.expiresAt) > now)
                setStories([...activeStories].reverse())
            } else {
                toast(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }

    }

    useEffect(() => {
        // Fetch stories on mount and whenever `user` changes.
        // This avoids referencing an undefined `user` and refreshes stories after login/logout.
        fetchStories()
    }, [user])

    const handleViewStory = (story) => {
        setActiveStory(story)
    }

    const handleDelete = (deletedStoryId) => {
        setStories(prev => prev.filter(story => story._id !== deletedStoryId))
        if (activeStory && activeStory._id === deletedStoryId) {
            setActiveStory(null)
        }
    }

    return (
        <div className='w-full max-w-2xl px-3 overflow-x-auto no-scrollbar md:px-4 mobile-fix'>

            <div className='flex gap-3 pb-5 md:gap-4'>
                {/* Add Story Card */}
                <div onClick={() => setShowModel(true)} className='rounded-lg shadow-sm min-w-24 md:min-w-30 max-w-24 md:max-w-30 max-h-32 md:max-h-40 aspect-[3/4] cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-dashed border-indigo-300 bg-gradient-to-b from-indigo-50 to-white touch-manipulation'>

                    <div className='flex flex-col items-center justify-center h-full p-3 md:p-4'>
                        <div className='flex items-center justify-center mb-2 bg-indigo-500 rounded-full size-8 md:size-10 md:mb-3'>
                            <Plus className='w-4 h-4 text-white md:w-5 md:h-5' />
                        </div>
                        <p className='text-xs font-medium text-center md:text-sm text-slate-700'>Create Story</p>
                    </div>

                </div>
                {/* Others Story Card */}
                {
                    stories.map((story, index) => (
                        <div onClick={() => handleViewStory(story)}
                            key={story._id || index} className='relative transition-all duration-200 rounded-lg shadow cursor-pointer min-w-24 md:min-w-30 max-w-24 md:max-w-30 max-h-32 md:max-h-40 hover:shadow-lg bg-gradient-to-b from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 touch-manipulation'>
                            {/* guard profile_picture access */}
                            <img src={getProfileImageURL(story.user?.profile_picture)} alt="" className='absolute z-10 object-cover rounded-full shadow size-6 md:size-8 top-2 md:top-3 left-2 md:left-3 ring ring-gray-100' />
                            <p className='absolute text-xs truncate top-14 md:top-18 left-2 md:left-3 text-white/60 md:text-sm max-w-20 md:max-w-24'>{story.content}</p>
                            <p className='absolute z-10 text-xs text-white bottom-1 right-2'>{moment(story.createdAt).fromNow()}</p>
                            {
                                story.media_type !== "text" && (
                                    <div className='absolute inset-0 overflow-hidden bg-black rounded-lg z-1'>
                                        {
                                            story.media_type === "image"
                                                ? <img src={story.media_url} alt="" className='object-cover w-full h-full transition duration-500 hover:scale-110 opacity-70 hover:opacity-80' />
                                                : <video src={story.media_url} className='object-cover w-full h-full transition duration-500 hover:scale-110 opacity-70 hover:opacity-80' />
                                        }
                                    </div>
                                )
                            }
                        </div>
                    ))
                }
            </div>
            {/* Add Story Model */}
            {showModel && <StoryModel setShowModel={setShowModel} fetchStories={fetchStories} />}

            {/* SINGLE STORY VIEWER */}
            {activeStory && (
                <StoryViewer
                    story={activeStory}
                    onClose={() => setActiveStory(null)}
                    onNext={() => {
                        const currentIndex = stories.findIndex(s => s._id === activeStory._id);
                        if (currentIndex < stories.length - 1) {
                            setActiveStory(stories[currentIndex + 1]);
                        } else {
                            setActiveStory(null);
                        }
                    }}
                    onPrevious={() => {
                        const currentIndex = stories.findIndex(s => s._id === activeStory._id);
                        if (currentIndex > 0) {
                            setActiveStory(stories[currentIndex - 1]);
                        }
                    }}
                    onDelete={handleDelete}
                />
            )}
        </div>
    )
}

export default StoriesBar
