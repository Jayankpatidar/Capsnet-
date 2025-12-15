import { configureStore } from '@reduxjs/toolkit'
import userSlice from '../features/users/userSlice'
import postsSlice from '../features/posts/postSlice'
import reelsSlice from '../features/reels/reelSlice'
import messagesSlice from '../features/messages/messagesSlice'
import groupsSlice from '../features/groups/groupSlice'
import notesSlice from '../features/notes/noteSlice'
import videoCallSlice from '../features/videoCall/videoCallSlice'
import notificationsSlice from '../features/notifications/notificationSlice'
import adminSlice from '../features/admin/adminSlice'
import aiSlice from '../features/ai/aiSlice'
import chatSlice from '../features/chat/chatSlice'
import collaborationSlice from '../features/collaboration/collaborationSlice'
import connectionsSlice from '../features/connections/connectionsSlice'
import jobsSlice from '../features/jobs/jobsSlice'
import companySlice from '../features/company/companySlice'
import searchSlice from '../features/search/searchSlice'

export const store = configureStore({
  reducer: {
    user: userSlice,
    posts: postsSlice,
    reels: reelsSlice,
    messages: messagesSlice,
    groups: groupsSlice,
    notes: notesSlice,
    videoCall: videoCallSlice,
    notifications: notificationsSlice,
    admin: adminSlice,
    ai: aiSlice,
    chat: chatSlice,
    collaboration: collaborationSlice,
    connections: connectionsSlice,
    jobs: jobsSlice,
    company: companySlice,
    search: searchSlice,
  },
})

export default store
