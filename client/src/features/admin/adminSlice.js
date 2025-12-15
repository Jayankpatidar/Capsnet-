import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../api/axios"
import toast from "react-hot-toast"

const initialState = {
    analytics: null,
    loading: false,
    error: null
}

export const fetchAdminAnalytics = createAsyncThunk("admin/fetchAnalytics", async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get("/admin/analytics")
        if (data.success) {
            return data.analytics
        } else {
            return rejectWithValue(data.message || 'Failed to fetch analytics')
        }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Network error')
    }
})

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        clearAnalytics: (state) => {
            state.analytics = null
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminAnalytics.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchAdminAnalytics.fulfilled, (state, action) => {
                state.loading = false
                state.analytics = action.payload
            })
            .addCase(fetchAdminAnalytics.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
                toast.error("Failed to fetch analytics")
            })
    }
})

export const { clearAnalytics } = adminSlice.actions
export default adminSlice.reducer
