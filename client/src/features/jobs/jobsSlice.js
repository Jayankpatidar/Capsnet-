import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../api/axios'

// Initial state
const initialState = {
    jobs: [],
    savedJobs: [],
    appliedJobs: [],
    myJobs: [],
    recommendedJobs: [],
    salaryInsights: null,
    interviewQuestions: [],
    loading: false,
    error: null,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
        totalJobs: 0
    },
    filters: {
        search: '',
        location: '',
        salaryMin: '',
        salaryMax: '',
        experience: '',
        jobType: '',
        workType: ''
    }
}

// Async thunks
export const fetchJobs = createAsyncThunk(
    'jobs/fetchJobs',
    async ({ page = 1, ...filters }, { rejectWithValue }) => {
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                ...Object.fromEntries(
                    Object.entries(filters).filter(([_, value]) => value !== '' && value !== null)
                )
            })

            const response = await axios.get(`/jobs/list?${queryParams}`)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch jobs')
        }
    }
)

export const fetchJobDetails = createAsyncThunk(
    'jobs/fetchJobDetails',
    async (jobId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/jobs/${jobId}`)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch job details')
        }
    }
)

export const postJob = createAsyncThunk(
    'jobs/postJob',
    async (jobData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/jobs/post', jobData)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to post job')
        }
    }
)

export const applyForJob = createAsyncThunk(
    'jobs/applyForJob',
    async ({ jobId, resume }, { rejectWithValue }) => {
        try {
            const formData = new FormData()
            formData.append('jobId', jobId)
            if (resume) {
                formData.append('resume', resume)
            }

            const response = await axios.post('/jobs/apply', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to apply for job')
        }
    }
)

export const saveJob = createAsyncThunk(
    'jobs/saveJob',
    async (jobId, { rejectWithValue }) => {
        try {
            const response = await axios.post('/jobs/save', { jobId })
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to save job')
        }
    }
)

export const fetchSavedJobs = createAsyncThunk(
    'jobs/fetchSavedJobs',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/jobs/saved')
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch saved jobs')
        }
    }
)

export const fetchAppliedJobs = createAsyncThunk(
    'jobs/fetchAppliedJobs',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/jobs/applied')
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch applied jobs')
        }
    }
)

export const withdrawApplication = createAsyncThunk(
    'jobs/withdrawApplication',
    async (jobId, { rejectWithValue }) => {
        try {
            const response = await axios.post('/jobs/withdraw', { jobId })
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to withdraw application')
        }
    }
)

export const fetchMyJobs = createAsyncThunk(
    'jobs/fetchMyJobs',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/jobs/my-jobs')
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch my jobs')
        }
    }
)

export const updateJobStatus = createAsyncThunk(
    'jobs/updateJobStatus',
    async ({ jobId, isActive }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/jobs/${jobId}/status`, { isActive })
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update job status')
        }
    }
)

export const updateApplicationStatus = createAsyncThunk(
    'jobs/updateApplicationStatus',
    async ({ jobId, userId, status }, { rejectWithValue }) => {
        try {
            const response = await axios.put('/jobs/application/status', { jobId, userId, status })
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update application status')
        }
    }
)

export const fetchRecommendedJobs = createAsyncThunk(
    'jobs/fetchRecommendedJobs',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/jobs/recommended')
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch recommended jobs')
        }
    }
)

export const fetchSalaryInsights = createAsyncThunk(
    'jobs/fetchSalaryInsights',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/jobs/salary-insights')
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch salary insights')
        }
    }
)

export const fetchInterviewQuestions = createAsyncThunk(
    'jobs/fetchInterviewQuestions',
    async (jobId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/jobs/interview/${jobId}`)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch interview questions')
        }
    }
)

// Slice
const jobsSlice = createSlice({
    name: 'jobs',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload }
        },
        clearFilters: (state) => {
            state.filters = initialState.filters
        },
        setCurrentPage: (state, action) => {
            state.pagination.currentPage = action.payload
        },
        clearJobs: (state) => {
            state.jobs = []
            state.pagination = initialState.pagination
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Jobs
            .addCase(fetchJobs.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchJobs.fulfilled, (state, action) => {
                state.loading = false
                state.jobs = action.payload.jobs || []
                state.pagination = action.payload.pagination || initialState.pagination
            })
            .addCase(fetchJobs.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Fetch Job Details
            .addCase(fetchJobDetails.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchJobDetails.fulfilled, (state, action) => {
                state.loading = false
                // Job details can be handled in component state
            })
            .addCase(fetchJobDetails.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Post Job
            .addCase(postJob.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(postJob.fulfilled, (state, action) => {
                state.loading = false
                state.myJobs.unshift(action.payload.job)
            })
            .addCase(postJob.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Apply for Job
            .addCase(applyForJob.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(applyForJob.fulfilled, (state, action) => {
                state.loading = false
                // Update the job in the jobs array to reflect application
                const jobIndex = state.jobs.findIndex(job => job._id === action.payload.job._id)
                if (jobIndex !== -1) {
                    state.jobs[jobIndex] = action.payload.job
                }
                // Add to applied jobs if not already there
                const existingIndex = state.appliedJobs.findIndex(job => job._id === action.payload.job._id)
                if (existingIndex === -1) {
                    state.appliedJobs.unshift(action.payload.job)
                }
            })
            .addCase(applyForJob.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Save Job
            .addCase(saveJob.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(saveJob.fulfilled, (state, action) => {
                state.loading = false
                // Update the job in the jobs array to reflect save status
                const jobIndex = state.jobs.findIndex(job => job._id === action.payload.job._id)
                if (jobIndex !== -1) {
                    state.jobs[jobIndex] = action.payload.job
                }
                // Add to saved jobs if not already there
                const existingIndex = state.savedJobs.findIndex(job => job._id === action.payload.job._id)
                if (existingIndex === -1) {
                    state.savedJobs.unshift(action.payload.job)
                }
            })
            .addCase(saveJob.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Fetch Saved Jobs
            .addCase(fetchSavedJobs.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchSavedJobs.fulfilled, (state, action) => {
                state.loading = false
                state.savedJobs = action.payload.jobs || []
            })
            .addCase(fetchSavedJobs.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Fetch Applied Jobs
            .addCase(fetchAppliedJobs.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchAppliedJobs.fulfilled, (state, action) => {
                state.loading = false
                state.appliedJobs = action.payload.jobs || []
            })
            .addCase(fetchAppliedJobs.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Withdraw Application
            .addCase(withdrawApplication.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(withdrawApplication.fulfilled, (state, action) => {
                state.loading = false
                // Remove from applied jobs
                state.appliedJobs = state.appliedJobs.filter(job => job._id !== action.payload.jobId)
                // Update the job in the jobs array to reflect withdrawal
                const jobIndex = state.jobs.findIndex(job => job._id === action.payload.jobId)
                if (jobIndex !== -1) {
                    state.jobs[jobIndex] = action.payload.job
                }
            })
            .addCase(withdrawApplication.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Fetch My Jobs
            .addCase(fetchMyJobs.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchMyJobs.fulfilled, (state, action) => {
                state.loading = false
                state.myJobs = action.payload.jobs || []
            })
            .addCase(fetchMyJobs.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Update Job Status
            .addCase(updateJobStatus.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateJobStatus.fulfilled, (state, action) => {
                state.loading = false
                // Update the job in myJobs array
                const jobIndex = state.myJobs.findIndex(job => job._id === action.payload.job._id)
                if (jobIndex !== -1) {
                    state.myJobs[jobIndex] = action.payload.job
                }
            })
            .addCase(updateJobStatus.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Update Application Status
            .addCase(updateApplicationStatus.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateApplicationStatus.fulfilled, (state, action) => {
                state.loading = false
                // Update the job in myJobs array to reflect application status change
                const jobIndex = state.myJobs.findIndex(job => job._id === action.payload.job._id)
                if (jobIndex !== -1) {
                    state.myJobs[jobIndex] = action.payload.job
                }
            })
            .addCase(updateApplicationStatus.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Fetch Recommended Jobs
            .addCase(fetchRecommendedJobs.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchRecommendedJobs.fulfilled, (state, action) => {
                state.loading = false
                state.recommendedJobs = action.payload.jobs || []
            })
            .addCase(fetchRecommendedJobs.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Fetch Salary Insights
            .addCase(fetchSalaryInsights.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchSalaryInsights.fulfilled, (state, action) => {
                state.loading = false
                state.salaryInsights = action.payload.insights
            })
            .addCase(fetchSalaryInsights.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Fetch Interview Questions
            .addCase(fetchInterviewQuestions.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchInterviewQuestions.fulfilled, (state, action) => {
                state.loading = false
                state.interviewQuestions = action.payload.questions || []
            })
            .addCase(fetchInterviewQuestions.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export const {
    clearError,
    setFilters,
    clearFilters,
    setCurrentPage,
    clearJobs
} = jobsSlice.actions

export default jobsSlice.reducer
