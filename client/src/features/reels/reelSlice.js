import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

export const fetchReels = createAsyncThunk(
  'reels/fetchReels',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/reel/for-you')
      if (data.success) {
        return data.reels
      } else {
        return rejectWithValue(data.message)
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const addReel = createAsyncThunk(
  'reels/addReel',
  async (reelData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/reel/add', reelData)
      if (data.success) {
        return data.reel || data
      } else {
        return rejectWithValue(data.message)
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const toggleLikeReel = createAsyncThunk(
  'reels/toggleLike',
  async ({ reelId }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/reel/like', { reelId })
      if (data.success) {
        return { reelId, likes: data.likes }
      } else {
        return rejectWithValue(data.message)
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const incrementReelView = createAsyncThunk(
  'reels/incrementView',
  async ({ reelId }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/reel/view', { reelId })
      if (data.success) {
        return { reelId, views: data.views }
      } else {
        return rejectWithValue(data.message)
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const getReelAnalytics = createAsyncThunk(
  'reels/getAnalytics',
  async ({ reelId }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/reel/analytics/${reelId}`)
      if (data.success) {
        return { reelId, analytics: data.analytics }
      } else {
        return rejectWithValue(data.message)
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const addComment = createAsyncThunk(
  'reels/addComment',
  async ({ reelId, text }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/reel/comment', { reelId, text })
      if (data.success) {
        return { reelId, comment: data.comment }
      } else {
        return rejectWithValue(data.message)
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const shareReel = createAsyncThunk(
  'reels/shareReel',
  async ({ reelId }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/reel/share', { reelId })
      if (data.success) {
        return { reelId, shares: data.shares }
      } else {
        return rejectWithValue(data.message)
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const reelSlice = createSlice({
  name: 'reels',
  initialState: {
    reels: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReels.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchReels.fulfilled, (state, action) => {
        state.loading = false
        state.reels = action.payload
      })
      .addCase(fetchReels.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(addReel.pending, (state) => {
        state.loading = true
      })
      .addCase(addReel.fulfilled, (state, action) => {
        state.loading = false
        state.reels.unshift(action.payload)
      })
      .addCase(addReel.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(toggleLikeReel.pending, (state) => {
        state.loading = true
      })
      .addCase(toggleLikeReel.fulfilled, (state, action) => {
        state.loading = false
        const { reelId, likes } = action.payload
        const reel = state.reels.find(r => r._id === reelId)
        if (reel) {
          reel.likes = likes
        }
      })
      .addCase(toggleLikeReel.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(addComment.pending, (state) => {
        state.loading = true
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false
        const { reelId, comment } = action.payload
        const reel = state.reels.find(r => r._id === reelId)
        if (reel) {
          if (!reel.comments) reel.comments = []
          reel.comments.push(comment)
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(shareReel.pending, (state) => {
        state.loading = true
      })
      .addCase(shareReel.fulfilled, (state, action) => {
        state.loading = false
        const { reelId, shares } = action.payload
        const reel = state.reels.find(r => r._id === reelId)
        if (reel) {
          if (!reel.analytics) reel.analytics = {}
          reel.analytics.shares = shares
        }
      })
      .addCase(shareReel.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export default reelSlice.reducer
