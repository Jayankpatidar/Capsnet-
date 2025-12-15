import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../api/axios"
import toast from "react-hot-toast"

const initialState = {
    posts: [],
    loading: false
}

export const fetchCollaborationPosts = createAsyncThunk("collaboration/fetchPosts", async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get("/api/collaboration/posts")
        if (data.success) {
            return data.posts
        } else {
            return rejectWithValue(data.message || 'Failed to fetch posts')
        }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Network error')
    }
})

export const createCollaborationPost = createAsyncThunk("collaboration/createPost", async (postData, { rejectWithValue }) => {
    try {
        const { data } = await api.post("/collaboration/posts", postData)
        if (data.success) {
            toast.success("Post created successfully")
            return data.post
        } else {
            return rejectWithValue(data.message || 'Failed to create post')
        }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Network error')
    }
})

export const applyForCollaboration = createAsyncThunk("collaboration/apply", async ({ postId, message }, { rejectWithValue }) => {
    try {
        const { data } = await api.post(`/collaboration/posts/${postId}/apply`, { message })
        if (data.success) {
            toast.success("Application sent")
            return { postId, applicant: data.applicant }
        } else {
            return rejectWithValue(data.message || 'Failed to apply')
        }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Network error')
    }
})

const collaborationSlice = createSlice({
    name: "collaboration",
    initialState,
    reducers: {
        clearPosts: (state) => {
            state.posts = []
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCollaborationPosts.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchCollaborationPosts.fulfilled, (state, action) => {
                state.loading = false
                state.posts = action.payload
            })
            .addCase(fetchCollaborationPosts.rejected, (state) => {
                state.loading = false
                toast.error("Failed to fetch posts")
            })
            .addCase(createCollaborationPost.fulfilled, (state, action) => {
                state.posts.unshift(action.payload)
            })
            .addCase(applyForCollaboration.fulfilled, (state, action) => {
                const post = state.posts.find(p => p._id === action.payload.postId)
                if (post) {
                    post.applicants.push(action.payload.applicant)
                }
            })
    }
})

export const { clearPosts } = collaborationSlice.actions
export default collaborationSlice.reducer
