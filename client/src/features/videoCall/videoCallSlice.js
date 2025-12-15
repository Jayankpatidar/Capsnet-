import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../api/axios"

const initialState = {
    currentCall: null,
    callHistory: [],
    isInCall: false,
    loading: false,
    error: null
}

// Initiate call
export const initiateCall = createAsyncThunk(
    "videoCall/initiateCall",
    async ({ participant_ids, call_type, group_id }, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/video-call/initiate", {
                participant_ids,
                call_type,
                group_id
            });
            return data.success ? data : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Accept call
export const acceptCall = createAsyncThunk(
    "videoCall/acceptCall",
    async ({ call_id }, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/video-call/accept", { call_id });
            return data.success ? data : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Decline call
export const declineCall = createAsyncThunk(
    "videoCall/declineCall",
    async ({ call_id }, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/video-call/decline", { call_id });
            return data.success ? data : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// End call
export const endCall = createAsyncThunk(
    "videoCall/endCall",
    async ({ call_id }, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/video-call/end", { call_id });
            return data.success ? data : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Get call details
export const getCallDetails = createAsyncThunk(
    "videoCall/getCallDetails",
    async ({ call_id }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/video-call/${call_id}`);
            return data.success ? data : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Get call history
export const getCallHistory = createAsyncThunk(
    "videoCall/getCallHistory",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get("/video-call/history");
            return data.success ? data : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Send call message
export const sendCallMessage = createAsyncThunk(
    "videoCall/sendCallMessage",
    async ({ call_id, text }, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/video-call/message", { call_id, text });
            return data.success ? data : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Toggle recording
export const toggleRecording = createAsyncThunk(
    "videoCall/toggleRecording",
    async ({ call_id, recording }, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/video-call/recording", { call_id, recording });
            return data.success ? data : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const videoCallSlice = createSlice({
    name: "videoCall",
    initialState,
    reducers: {
        setCurrentCall: (state, action) => {
            state.currentCall = action.payload
            state.isInCall = !!action.payload
        },
        updateCallStatus: (state, action) => {
            if (state.currentCall) {
                state.currentCall.status = action.payload.status
                state.currentCall.participants = action.payload.participants
            }
        },
        addCallMessage: (state, action) => {
            if (state.currentCall) {
                state.currentCall.chat_messages.push(action.payload)
            }
        },
        endCurrentCall: (state) => {
            state.currentCall = null
            state.isInCall = false
        },
        resetVideoCall: (state) => {
            state.currentCall = null
            state.callHistory = []
            state.isInCall = false
            state.error = null
            state.loading = false
        },
    },
    extraReducers: (builder) => {
        builder
            // Initiate call
            .addCase(initiateCall.pending, (state) => {
                state.loading = true
            })
            .addCase(initiateCall.fulfilled, (state, action) => {
                state.loading = false
                if (action.payload) {
                    state.currentCall = action.payload.call
                    state.isInCall = true
                }
            })
            .addCase(initiateCall.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Accept call
            .addCase(acceptCall.fulfilled, (state, action) => {
                if (action.payload && state.currentCall) {
                    state.currentCall.status = "ongoing"
                }
            })

            // End call
            .addCase(endCall.fulfilled, (state) => {
                state.currentCall = null
                state.isInCall = false
            })

            // Get call details
            .addCase(getCallDetails.fulfilled, (state, action) => {
                if (action.payload) {
                    state.currentCall = action.payload.call
                }
            })

            // Get call history
            .addCase(getCallHistory.fulfilled, (state, action) => {
                if (action.payload) {
                    state.callHistory = action.payload.calls
                }
            })

            // Send call message
            .addCase(sendCallMessage.fulfilled, (state, action) => {
                if (action.payload && state.currentCall) {
                    state.currentCall.chat_messages.push(action.payload.message)
                }
            })
    }
})

export const {
    setCurrentCall,
    updateCallStatus,
    addCallMessage,
    endCurrentCall,
    resetVideoCall
} = videoCallSlice.actions

export default videoCallSlice.reducer
