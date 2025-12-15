import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/post/feed')
      if (data.success) {
        return data.posts
      } else {
        return rejectWithValue(data.message)
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const addPost = createAsyncThunk(
  'posts/addPost',
  async (postData, { rejectWithValue }) => {
    try {
      console.log("📤 Frontend: Sending post data to /post/add")
      const { data } = await api.post('/post/add', postData)
      console.log("📥 Frontend: Received response from /post/add:", data)
      if (data.success) {
        return data.post || data
      } else {
        console.error("❌ Frontend: API returned success=false:", data.message)
        return rejectWithValue(data.message)
      }
    } catch (error) {
      console.error("❌ Frontend: API call failed:", error.response?.data || error.message)
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const addComment = createAsyncThunk(
  'posts/addComment',
  async ({ postId, content }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/post/comment', { postId, content })
      if (data.success) {
        return { postId, comment: data.comment }
      } else {
        return rejectWithValue(data.message)
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const toggleLikePost = createAsyncThunk(
  'posts/toggleLike',
  async ({ postId }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/post/toggle-like', { postId })
      if (data.success) {
        return { postId, likes: data.likes }
      } else {
        return rejectWithValue(data.message)
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const savePost = createAsyncThunk(
  'posts/save',
  async ({ postId }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/post/save', { postId })
      if (data.success) {
        return { postId }
      } else {
        return rejectWithValue(data.message)
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false
        state.posts = action.payload
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(addPost.pending, (state) => {
        state.loading = true
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.loading = false
        state.posts.unshift(action.payload)
      })
      .addCase(addPost.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(toggleLikePost.pending, (state) => {
        state.loading = true
      })
      .addCase(toggleLikePost.fulfilled, (state, action) => {
        state.loading = false
        // Update the post in state if needed
      })
      .addCase(toggleLikePost.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(savePost.pending, (state) => {
        state.loading = true
      })
      .addCase(savePost.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(savePost.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export default postSlice.reducer
