import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../api/axios"

const initialState = {
    groups: [],
    currentGroup: null,
    loading: false,
    error: null
}

// Async thunk to create group
export const createGroup = createAsyncThunk(
    "groups/createGroup",
    async ({ name }, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/group/create", { name });
            return data.success ? data : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Get user groups
export const getUserGroups = createAsyncThunk(
    "groups/getUserGroups",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get("/group/user-groups");
            return data.success ? data : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Get group by ID
export const getGroupById = createAsyncThunk(
    "groups/getGroupById",
    async (groupId, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/group/${groupId}`);
            return data.success ? data : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Add member to group
export const addMemberToGroup = createAsyncThunk(
    "groups/addMember",
    async ({ groupId, memberId }, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/group/${groupId}/add-member`, { memberId });
            return data.success ? data : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Remove member from group
export const removeMemberFromGroup = createAsyncThunk(
    "groups/removeMember",
    async ({ groupId, memberId }, { rejectWithValue }) => {
        try {
            const { data } = await api.delete(`/group/${groupId}/remove-member/${memberId}`);
            return data.success ? data : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Leave group
export const leaveGroup = createAsyncThunk(
    "groups/leaveGroup",
    async (groupId, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/group/${groupId}/leave`);
            return data.success ? data : rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Delete group
export const deleteGroup = createAsyncThunk(
    "groups/deleteGroup",
    async (groupId, { rejectWithValue }) => {
        try {
            const { data } = await api.delete(`/group/${groupId}`);
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
        clearCurrentGroup: (state) => {
            state.currentGroup = null
        },
        resetGroups: (state) => {
            state.groups = []
            state.currentGroup = null
            state.error = null
            state.loading = false
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createGroup.fulfilled, (state, action) => {
                if (action.payload) {
                    state.groups.push(action.payload.group)
                }
            })
            .addCase(getUserGroups.fulfilled, (state, action) => {
                if (action.payload) {
                    state.groups = action.payload.groups
                }
            })
            .addCase(getGroupById.fulfilled, (state, action) => {
                if (action.payload) {
                    state.currentGroup = action.payload.group
                }
            })
    }
})

export const {
    setCurrentGroup,
    clearCurrentGroup,
    resetGroups
} = groupsSlice.actions

export default groupsSlice.reducer
