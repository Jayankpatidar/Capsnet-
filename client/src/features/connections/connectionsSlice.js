import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../api/axios"
import {toast} from "react-hot-toast"

const initialState = {
    connections: [],
    pendingConnections: [],
    followers: [],
    following: [],
    suggestedUsers: [],
    mutualConnections: [],
    blockedUsers: [],
    restrictedUsers: [],
    loading: false,
    error: null,
}

export const fetchConnections = createAsyncThunk("connections/fetchConnections", async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get("/user/connections")

        if (!data.success) {
            return rejectWithValue(data.message || 'Failed to fetch connections');
        }

        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Network error');
    }
})

export const followUser = createAsyncThunk("connections/followUser", async (userId, { rejectWithValue }) => {
    try {
        const { data } = await api.post("/user/follow", { id: userId })

        if (!data.success) {
            return rejectWithValue(data.message || 'Failed to follow user');
        }

        toast.success(data.message)
        return { userId, type: 'follow' };
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to follow user')
        return rejectWithValue(error.response?.data?.message || 'Network error');
    }
})

export const followBack = createAsyncThunk("connections/followBack", async (userId, { rejectWithValue }) => {
    try {
        const { data } = await api.post("/user/follow-back", { id: userId })

        if (!data.success) {
            return rejectWithValue(data.message || 'Failed to follow back');
        }

        toast.success(data.message)
        return { userId, type: 'followBack' };
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to follow back')
        return rejectWithValue(error.response?.data?.message || 'Network error');
    }
})

export const unfollowUser = createAsyncThunk("connections/unfollowUser", async (userId, { rejectWithValue }) => {
    try {
        const { data } = await api.post("/user/unfollow", { id: userId })

        if (!data.success) {
            return rejectWithValue(data.message || 'Failed to unfollow user');
        }

        toast.success(data.message)
        return { userId, type: 'unfollow' };
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to unfollow user')
        return rejectWithValue(error.response?.data?.message || 'Network error');
    }
})

export const removeFollower = createAsyncThunk("connections/removeFollower", async (userId, { rejectWithValue }) => {
    try {
        const { data } = await api.post("/user/remove-follower", { id: userId })

        if (!data.success) {
            return rejectWithValue(data.message || 'Failed to remove follower');
        }

        toast.success(data.message)
        return { userId, type: 'removeFollower' };
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to remove follower')
        return rejectWithValue(error.response?.data?.message || 'Network error');
    }
})

export const sendConnectionRequest = createAsyncThunk("connections/sendConnectionRequest", async (userId, { rejectWithValue }) => {
    try {
        const { data } = await api.post("/user/connect", { id: userId })

        if (!data.success) {
            return rejectWithValue(data.message || 'Failed to send connection request');
        }

        toast.success(data.message)
        return { userId, type: 'connect' };
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to send connection request')
        return rejectWithValue(error.response?.data?.message || 'Network error');
    }
})

export const acceptConnectionRequest = createAsyncThunk("connections/acceptConnectionRequest", async (userId, { rejectWithValue }) => {
    try {
        const { data } = await api.post("/user/accept", { id: userId })

        if (!data.success) {
            return rejectWithValue(data.message || 'Failed to accept connection request');
        }

        toast.success(data.message)
        return { userId, type: 'accept' };
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to accept connection request')
        return rejectWithValue(error.response?.data?.message || 'Network error');
    }
})

export const rejectConnectionRequest = createAsyncThunk("connections/rejectConnectionRequest", async (userId, { rejectWithValue }) => {
    try {
        const { data } = await api.post("/user/reject", { id: userId })

        if (!data.success) {
            return rejectWithValue(data.message || 'Failed to reject connection request');
        }

        toast.success(data.message)
        return { userId, type: 'reject' };
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to reject connection request')
        return rejectWithValue(error.response?.data?.message || 'Network error');
    }
})

export const getMutualConnections = createAsyncThunk("connections/getMutualConnections", async (targetUserId, { rejectWithValue }) => {
    try {
        const { data } = await api.get(`/user/mutual-connections/${targetUserId}`)

        if (!data.success) {
            return rejectWithValue(data.message || 'Failed to fetch mutual connections');
        }

        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Network error');
    }
})

export const fetchSuggestedUsers = createAsyncThunk("connections/fetchSuggestedUsers", async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get("/user/suggested-users")

        if (!data.success) {
            return rejectWithValue(data.message || 'Failed to fetch suggested users');
        }

        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Network error');
    }
})

export const blockUser = createAsyncThunk("connections/blockUser", async (userId, { rejectWithValue }) => {
    try {
        const { data } = await api.post("/user/block", { id: userId })

        if (!data.success) {
            return rejectWithValue(data.message || 'Failed to block user');
        }

        toast.success(data.message)
        return { userId, type: 'block' };
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to block user')
        return rejectWithValue(error.response?.data?.message || 'Network error');
    }
})

export const unblockUser = createAsyncThunk("connections/unblockUser", async (userId, { rejectWithValue }) => {
    try {
        const { data } = await api.post("/user/unblock", { id: userId })

        if (!data.success) {
            return rejectWithValue(data.message || 'Failed to unblock user');
        }

        toast.success(data.message)
        return { userId, type: 'unblock' };
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to unblock user')
        return rejectWithValue(error.response?.data?.message || 'Network error');
    }
})

export const restrictUser = createAsyncThunk("connections/restrictUser", async (userId, { rejectWithValue }) => {
    try {
        const { data } = await api.post("/user/restrict", { id: userId })

        if (!data.success) {
            return rejectWithValue(data.message || 'Failed to restrict user');
        }

        toast.success(data.message)
        return { userId, type: 'restrict' };
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to restrict user')
        return rejectWithValue(error.response?.data?.message || 'Network error');
    }
})

export const unrestrictUser = createAsyncThunk("connections/unrestrictUser", async (userId, { rejectWithValue }) => {
    try {
        const { data } = await api.post("/user/unrestrict", { id: userId })

        if (!data.success) {
            return rejectWithValue(data.message || 'Failed to unrestrict user');
        }

        toast.success(data.message)
        return { userId, type: 'unrestrict' };
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to unrestrict user')
        return rejectWithValue(error.response?.data?.message || 'Network error');
    }
})

const connectionSlice = createSlice({
    name: "connections",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchConnections.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchConnections.fulfilled, (state, action) => {
                state.loading = false;
                state.connections = action.payload.connections || [];
                state.pendingConnections = action.payload.pendingConnections || [];
                state.followers = action.payload.followers || [];
                state.following = action.payload.following || [];
            })
            .addCase(fetchConnections.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchSuggestedUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSuggestedUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.suggestedUsers = action.payload.users || [];
            })
            .addCase(fetchSuggestedUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getMutualConnections.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMutualConnections.fulfilled, (state, action) => {
                state.loading = false;
                state.mutualConnections = action.payload.mutualConnections || [];
            })
            .addCase(getMutualConnections.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(followUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(followUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(followUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(followBack.pending, (state) => {
                state.loading = true;
            })
            .addCase(followBack.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(followBack.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(unfollowUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(unfollowUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(unfollowUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(removeFollower.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeFollower.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(removeFollower.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(sendConnectionRequest.pending, (state) => {
                state.loading = true;
            })
            .addCase(sendConnectionRequest.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(sendConnectionRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(acceptConnectionRequest.pending, (state) => {
                state.loading = true;
            })
            .addCase(acceptConnectionRequest.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(acceptConnectionRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(rejectConnectionRequest.pending, (state) => {
                state.loading = true;
            })
            .addCase(rejectConnectionRequest.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(rejectConnectionRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(blockUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(blockUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(blockUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(unblockUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(unblockUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(unblockUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(restrictUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(restrictUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(restrictUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(unrestrictUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(unrestrictUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(unrestrictUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export const { clearError, setLoading } = connectionSlice.actions;

export default connectionSlice.reducer