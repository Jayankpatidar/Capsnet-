import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../api/axios"

const initialState = {
    notifications: [],
    unreadCount: 0,
    loading: false
}

export const fetchNotifications = createAsyncThunk("notifications/fetchNotifications", async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get("/notifications")
        return data.notifications
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Network error')
    }
})

export const markAsRead = createAsyncThunk("notifications/markAsRead", async (notificationId, { rejectWithValue }) => {
    try {
        await api.put(`/notifications/${notificationId}/read`)
        return notificationId
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Network error')
    }
})

export const markAllAsRead = createAsyncThunk("notifications/markAllAsRead", async (_, { rejectWithValue }) => {
    try {
        await api.put("/notifications/read-all")
        return true
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Network error')
    }
})

export const fetchUnreadCount = createAsyncThunk("notifications/fetchUnreadCount", async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get("/notifications/unread-count")
        return data.count
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Network error')
    }
})

const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload)
            state.unreadCount += 1
        },
        clearNotifications: (state) => {
            state.notifications = []
            state.unreadCount = 0
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false
                state.notifications = action.payload
                state.unreadCount = action.payload.filter(n => !n.isRead).length
            })
            .addCase(fetchNotifications.rejected, (state) => {
                state.loading = false
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                const notification = state.notifications.find(n => n._id === action.payload)
                if (notification && !notification.isRead) {
                    notification.isRead = true
                    state.unreadCount -= 1
                }
            })
            .addCase(markAllAsRead.fulfilled, (state) => {
                state.notifications.forEach(n => n.isRead = true)
                state.unreadCount = 0
            })
            .addCase(fetchUnreadCount.fulfilled, (state, action) => {
                state.unreadCount = action.payload
            })
    }
})

export const { addNotification, clearNotifications } = notificationSlice.actions
export default notificationSlice.reducer
