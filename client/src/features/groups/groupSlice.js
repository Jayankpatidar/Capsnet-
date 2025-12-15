import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../api/axios"

const initialState = {
    groups: [],
    currentGroup: null,
    groupMessages: [],
    loading: false,
    error: null
}

// Create group
export const createGroup = createAsyncThunk(
    "groups/createGroup",
    async ({ name, description, member_ids, is_private, avatar }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("name", name);
            if (description) formData.append("description", description);
            if (member_ids) formData.append("member_ids", JSON.stringify(member_ids));
            if (is_private !== undefined) formData.append("is_private", is_private);
            if (avatar) formData.append("avatar", avatar);

            const { data } = await api.post("/groups/create", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data.success ? data : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Fetch user groups
export const fetchUserGroups = createAsyncThunk(
    "groups/fetchUserGroups",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get("/groups/my-groups");
            return data.success ? data : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Fetch group details
export const fetchGroupDetails = createAsyncThunk(
    "groups/fetchGroupDetails",
    async ({ group_id }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/groups/${group_id}`);
            return data.success ? data : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Add group members
export const addGroupMembers = createAsyncThunk(
    "groups/addGroupMembers",
    async ({ group_id, member_ids }, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/groups/add-members", { group_id, member_ids });
            return data.success ? { group_id, ...data } : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Remove group member
export const removeGroupMember = createAsyncThunk(
    "groups/removeGroupMember",
    async ({ group_id, member_id }, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/groups/remove-member", { group_id, member_id });
            return data.success ? { group_id, member_id } : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Update group settings
export const updateGroupSettings = createAsyncThunk(
    "groups/updateGroupSettings",
    async ({ group_id, name, description, theme, settings }, { rejectWithValue }) => {
        try {
            const { data } = await api.put("/groups/settings", { group_id, name, description, theme, settings });
            return data.success ? { group_id, ...data } : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Leave group
export const leaveGroup = createAsyncThunk(
    "groups/leaveGroup",
    async ({ group_id }, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/groups/leave", { group_id });
            return data.success ? { group_id } : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Make member admin
export const makeAdmin = createAsyncThunk(
    "groups/makeAdmin",
    async ({ group_id, member_id }, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/groups/make-admin", { group_id, member_id });
            return data.success ? { group_id, member_id } : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Toggle mute notifications
export const toggleMuteGroup = createAsyncThunk(
    "groups/toggleMuteGroup",
    async ({ group_id, mute }, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/groups/toggle-mute", { group_id, mute });
            return data.success ? { group_id, mute } : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Send group message
export const sendGroupMessage = createAsyncThunk(
    "groups/sendGroupMessage",
    async ({ group_id, text, message_type = "text" }, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/message/send", {
                group_id,
                text,
                message_type
            });
            return data.success ? data : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const groupsSlice = createSlice({
    name: "groups",
    initialState,
    reducers: {
        setCurrentGroup: (state, action) => {
            state.currentGroup = action.payload
        },
        addGroupMessage: (state, action) => {
            if (state.currentGroup && state.currentGroup._id === action.payload.group_id) {
                state.groupMessages.push(action.payload.message)
            }
        },
        updateGroup: (state, action) => {
            const index = state.groups.findIndex(group => group._id === action.payload._id)
            if (index !== -1) {
                state.groups[index] = { ...state.groups[index], ...action.payload }
            }
        },
        removeGroup: (state, action) => {
            state.groups = state.groups.filter(group => group._id !== action.payload)
            if (state.currentGroup && state.currentGroup._id === action.payload) {
                state.currentGroup = null
                state.groupMessages = []
            }
        },
        resetGroups: (state) => {
            state.groups = []
            state.currentGroup = null
            state.groupMessages = []
            state.error = null
            state.loading = false
        },
    },
    extraReducers: (builder) => {
        builder
            // Create group
            .addCase(createGroup.pending, (state) => {
                state.loading = true
            })
            .addCase(createGroup.fulfilled, (state, action) => {
                state.loading = false
                if (action.payload) {
                    state.groups.push(action.payload.group)
                }
            })
            .addCase(createGroup.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Fetch user groups
            .addCase(fetchUserGroups.fulfilled, (state, action) => {
                if (action.payload) {
                    state.groups = action.payload.groups
                }
            })

            // Fetch group details
            .addCase(fetchGroupDetails.fulfilled, (state, action) => {
                if (action.payload) {
                    state.currentGroup = action.payload.group
                }
            })

            // Add group members
            .addCase(addGroupMembers.fulfilled, (state, action) => {
                if (action.payload && state.currentGroup && state.currentGroup._id === action.payload.group_id) {
                    state.currentGroup = action.payload.group
                }
            })

            // Remove group member
            .addCase(removeGroupMember.fulfilled, (state, action) => {
                if (action.payload && state.currentGroup && state.currentGroup._id === action.payload.group_id) {
                    state.currentGroup.members = state.currentGroup.members.filter(
                        member => member.user !== action.payload.member_id
                    )
                }
            })

            // Leave group
            .addCase(leaveGroup.fulfilled, (state, action) => {
                if (action.payload) {
                    state.groups = state.groups.filter(group => group._id !== action.payload.group_id)
                    if (state.currentGroup && state.currentGroup._id === action.payload.group_id) {
                        state.currentGroup = null
                        state.groupMessages = []
                    }
                }
            })

            // Send group message
            .addCase(sendGroupMessage.fulfilled, (state, action) => {
                if (action.payload) {
                    state.groupMessages.push(action.payload.message)
                }
            })
    }
})

export const {
    setCurrentGroup,
    addGroupMessage,
    updateGroup,
    removeGroup,
    resetGroups
} = groupsSlice.actions

export default groupsSlice.reducer
