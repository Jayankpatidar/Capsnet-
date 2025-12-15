import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../api/axios"
import toast from "react-hot-toast"

const initialState = {
    messages: [],
    loading: false
}

export const sendAIMessage = createAsyncThunk("chat/sendAIMessage", async ({ message, language = 'en' }, { rejectWithValue }) => {
    try {
        console.log('Sending AI message:', { message, language })
        const { data } = await api.post("/ai/ai-assistant", { message, language })
        console.log('AI response received:', data)

        if (data.success && data.reply) {
            return {
                userMessage: message,
                aiReply: data.reply,
                timestamp: new Date()
            }
        } else {
            console.error('AI API error:', data)
            return rejectWithValue(data.message || 'AI service error')
        }
    } catch (error) {
        console.error('AI message error:', error)
        return rejectWithValue(error.response?.data?.message || 'Failed to send message')
    }
})

export const fetchChatHistory = createAsyncThunk("chat/fetchHistory", async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get("/ai/chat-history")
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Network error')
    }
})

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        clearChat: (state) => {
            state.messages = []
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendAIMessage.pending, (state) => {
                state.loading = true
            })
            .addCase(sendAIMessage.fulfilled, (state, action) => {
                state.loading = false
                state.messages.push(action.payload)
            })
            .addCase(sendAIMessage.rejected, (state) => {
                state.loading = false
                toast.error("Failed to send message")
            })
            .addCase(fetchChatHistory.fulfilled, (state, action) => {
                state.messages = action.payload.messages || []
            })
    }
})

export const { clearChat } = chatSlice.actions
export default chatSlice.reducer
