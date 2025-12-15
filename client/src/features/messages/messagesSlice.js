import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../api/axios"

const initialState = {
    messages: [],
    recentMessages: [],
    loading: false,
    error: null
}

// Async thunk to fetch messages
export const fetchMessages = createAsyncThunk(
    "messages/fetchMessages",
    async ({ userId }, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/message/get", { to_user_id: userId });

            return data.success ? data : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Send text message
export const sendMessage = createAsyncThunk(
    "messages/sendMessage",
    async ({ to_user_id, text, group_id }, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/message/send", {
                to_user_id: group_id ? null : to_user_id,
                group_id: group_id || null,
                text,
                message_type: "text"
            });
            return data.success ? data : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Send image message
export const sendImageMessage = createAsyncThunk(
    "messages/sendImageMessage",
    async ({ to_user_id, image, group_id }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("to_user_id", group_id ? null : to_user_id);
            if (group_id) formData.append("group_id", group_id);
            formData.append("image", image);

            const { data } = await api.post("/message/send", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data.success ? data : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Send document message
export const sendDocumentMessage = createAsyncThunk(
    "messages/sendDocumentMessage",
    async ({ to_user_id, document, group_id }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("to_user_id", group_id ? null : to_user_id);
            if (group_id) formData.append("group_id", group_id);
            formData.append("document", document);

            const { data } = await api.post("/message/document", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data.success ? data : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Send voice message
export const sendVoiceMessage = createAsyncThunk(
    "messages/sendVoiceMessage",
    async ({ to_user_id, voiceFile, duration, group_id }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("to_user_id", group_id ? null : to_user_id);
            if (group_id) formData.append("group_id", group_id);
            formData.append("voice", voiceFile);
            formData.append("duration", duration);

            const { data } = await api.post("/message/voice", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data.success ? data : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Send video message
export const sendVideoMessage = createAsyncThunk(
    "messages/sendVideoMessage",
    async ({ to_user_id, videoFile, duration, group_id }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("to_user_id", group_id ? null : to_user_id);
            if (group_id) formData.append("group_id", group_id);
            formData.append("video", videoFile);
            formData.append("duration", duration);

            const { data } = await api.post("/message/video", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data.success ? data : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Share content (post/reel/article)
export const shareContent = createAsyncThunk(
    "messages/shareContent",
    async ({ to_user_id, content_type, content_id, group_id }, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/message/share", {
                to_user_id: group_id ? null : to_user_id,
                group_id: group_id || null,
                content_type,
                content_id
            });
            return data.success ? data : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Add reaction to message
export const addReaction = createAsyncThunk(
    "messages/addReaction",
    async ({ message_id, emoji }, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/message/reaction", { message_id, emoji });
            return data.success ? { message_id, emoji } : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Reply to message
export const replyToMessage = createAsyncThunk(
    "messages/replyToMessage",
    async ({ to_user_id, text, reply_to_id, group_id }, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/message/reply", {
                to_user_id: group_id ? null : to_user_id,
                group_id: group_id || null,
                text,
                reply_to_id
            });
            return data.success ? data : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Forward message
export const forwardMessage = createAsyncThunk(
    "messages/forwardMessage",
    async ({ message_id, to_user_ids, group_ids }, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/message/forward", {
                message_id,
                to_user_ids,
                group_ids
            });
            return data.success ? data : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Delete message
export const deleteMessage = createAsyncThunk(
    "messages/deleteMessage",
    async ({ message_id }, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/message/delete", { message_id });
            return data.success ? { message_id } : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Edit message
export const editMessage = createAsyncThunk(
    "messages/editMessage",
    async ({ message_id, new_text }, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/message/edit", { message_id, new_text });
            return data.success ? { message_id, new_text } : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Send InMail
export const sendInMail = createAsyncThunk(
    "messages/sendInMail",
    async ({ to_user_id, subject, text }, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/message/inmail", { to_user_id, subject, text });
            return data.success ? data : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Fetch recent messages
export const fetchRecentMessages = createAsyncThunk(
    "messages/fetchRecentMessages",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get("/message/recent");
            return data.success ? data : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        setMessages: (state, action) => {
            state.messages = action.payload
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload)
        },
        updateMessage: (state, action) => {
            const index = state.messages.findIndex(msg => msg._id === action.payload._id)
            if (index !== -1) {
                state.messages[index] = { ...state.messages[index], ...action.payload }
            }
        },
        removeMessage: (state, action) => {
            state.messages = state.messages.filter(msg => msg._id !== action.payload)
        },
        resetMessages: (state) => {
            state.messages = []
            state.error = null
            state.loading = false
        },
        setRecentMessages: (state, action) => {
            state.recentMessages = action.payload
        },
        addRecentMessage: (state, action) => {
            const existingIndex = state.recentMessages.findIndex(
                msg => msg.from_user_id === action.payload.from_user_id ||
                       msg.to_user_id === action.payload.from_user_id
            )
            if (existingIndex !== -1) {
                state.recentMessages[existingIndex] = action.payload
            } else {
                state.recentMessages.unshift(action.payload)
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.fulfilled, (state, action) => {
                if (action.payload) {
                    state.messages = action.payload.messages
                }
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                if (action.payload) {
                    state.messages.push(action.payload.message)
                }
            })
            .addCase(sendImageMessage.fulfilled, (state, action) => {
                if (action.payload) {
                    state.messages.push(action.payload.message)
                }
            })
            .addCase(sendDocumentMessage.fulfilled, (state, action) => {
                if (action.payload) {
                    state.messages.push(action.payload.message)
                }
            })
            .addCase(sendVoiceMessage.fulfilled, (state, action) => {
                if (action.payload) {
                    state.messages.push(action.payload.message)
                }
            })
            .addCase(sendVideoMessage.fulfilled, (state, action) => {
                if (action.payload) {
                    state.messages.push(action.payload.message)
                }
            })
            .addCase(shareContent.fulfilled, (state, action) => {
                if (action.payload) {
                    state.messages.push(action.payload.message)
                }
            })
            .addCase(replyToMessage.fulfilled, (state, action) => {
                if (action.payload) {
                    state.messages.push(action.payload.message)
                }
            })
            .addCase(forwardMessage.fulfilled, (state, action) => {
                if (action.payload) {
                    action.payload.messages.forEach(msg => {
                        state.messages.push(msg)
                    })
                }
            })
            .addCase(deleteMessage.fulfilled, (state, action) => {
                if (action.payload) {
                    const index = state.messages.findIndex(msg => msg._id === action.payload.message_id)
                    if (index !== -1) {
                        state.messages[index].is_deleted = true
                    }
                }
            })
            .addCase(editMessage.fulfilled, (state, action) => {
                if (action.payload) {
                    const index = state.messages.findIndex(msg => msg._id === action.payload.message_id)
                    if (index !== -1) {
                        state.messages[index].text = action.payload.new_text
                        state.messages[index].edited = true
                    }
                }
            })
            .addCase(fetchRecentMessages.fulfilled, (state, action) => {
                if (action.payload) {
                    state.recentMessages = action.payload.messages
                }
            })
    }
})

export const {
    setMessages,
    addMessage,
    addMessages,
    updateMessage,
    removeMessage,
    resetMessages,
    setRecentMessages,
    addRecentMessage
} = messagesSlice.actions

export default messagesSlice.reducer
