import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../api/axios"
import toast from "react-hot-toast"

const initialState = {
    value: null
}

export const fetchUser = createAsyncThunk("user/fetchUser", async (token, { rejectWithValue }) => {
    try {
        const { data } = await api.get("/user/data")
        if (data.success) {
            return data.user
        } else {
            return rejectWithValue(data.message || 'Failed to fetch user data')
        }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Network error')
    }
})


export const updateUser = createAsyncThunk(
  "user/update",
  async ({ userData }, { getState }) => {
    try {
      const token = getState().user.value.token; // GET TOKEN

      const { data } = await api.post("/user/update", userData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        toast.success(data.message);
        return data.user;
      } else {
        toast.error(data.message);
        return null;
      }
    } catch (error) {
      toast.error("Update failed");
      return null;
    }
  }
);

export const fetchSuggestedUsers = createAsyncThunk("user/fetchSuggestedUsers", async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get("/user/suggested-users")
        if (data.success) {
            return data.users
        } else {
            return rejectWithValue(data.message || 'Failed to fetch suggested users')
        }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Network error')
    }
})

export const endorseSkill = createAsyncThunk("user/endorseSkill", async ({ userIdToEndorse, skillName }, { rejectWithValue }) => {
    try {
        const { data } = await api.post("/user/endorse-skill", { userIdToEndorse, skillName })
        if (data.success) {
            return data.user
        } else {
            return rejectWithValue(data.message || 'Failed to endorse skill')
        }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Network error')
    }
})

export const addExperience = createAsyncThunk("user/addExperience", async (experienceData, { rejectWithValue }) => {
    try {
        const { data } = await api.post("/user/add-experience", experienceData)
        if (data.success) {
            return data.experience
        } else {
            return rejectWithValue(data.message || 'Failed to add experience')
        }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Network error')
    }
})

export const uploadResume = createAsyncThunk("user/uploadResume", async (file, { rejectWithValue }) => {
    try {
        const fd = new FormData()
        fd.append('resume', file)
        const { data } = await api.post("/user/upload-resume", fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        if (data.success) {
            return data.user
        } else {
            return rejectWithValue(data.message || 'Failed to upload resume')
        }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Network error')
    }
})

export const uploadCertificate = createAsyncThunk("user/uploadCertificate", async ({ file, title, issuedBy, date }, { rejectWithValue }) => {
    try {
        const fd = new FormData()
        fd.append('certificate', file)
        fd.append('title', title)
        fd.append('issuedBy', issuedBy)
        fd.append('date', date)
        const { data } = await api.post("/user/upload-certificate", fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        if (data.success) {
            return data.user
        } else {
            return rejectWithValue(data.message || 'Failed to upload certificate')
        }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Network error')
    }
})

export const addEducation = createAsyncThunk("user/addEducation", async (educationData, { rejectWithValue }) => {
    try {
        const { data } = await api.post("/user/add-education", educationData)
        if (data.success) {
            return data.education
        } else {
            return rejectWithValue(data.message || 'Failed to add education')
        }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Network error')
    }
})

export const editEducation = createAsyncThunk("user/editEducation", async ({ educationId, educationData }, { rejectWithValue }) => {
    try {
        const { data } = await api.put(`/user/edit-education/${educationId}`, educationData)
        if (data.success) {
            return data.education
        } else {
            return rejectWithValue(data.message || 'Failed to edit education')
        }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Network error')
    }
})

export const deleteEducation = createAsyncThunk("user/deleteEducation", async (educationId, { rejectWithValue }) => {
    try {
        const { data } = await api.delete(`/user/delete-education/${educationId}`)
        if (data.success) {
            return data.education
        } else {
            return rejectWithValue(data.message || 'Failed to delete education')
        }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Network error')
    }
})

export const editExperience = createAsyncThunk("user/editExperience", async ({ experienceId, experienceData }, { rejectWithValue }) => {
    try {
        const { data } = await api.put(`/user/edit-experience/${experienceId}`, experienceData)
        if (data.success) {
            return data.experience
        } else {
            return rejectWithValue(data.message || 'Failed to edit experience')
        }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Network error')
    }
})

export const deleteExperience = createAsyncThunk("user/deleteExperience", async (experienceId, { rejectWithValue }) => {
    try {
        const { data } = await api.delete(`/user/delete-experience/${experienceId}`)
        if (data.success) {
            return data.experience
        } else {
            return rejectWithValue(data.message || 'Failed to delete experience')
        }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Network error')
    }
})

export const toggleAccountType = createAsyncThunk("user/toggleAccountType", async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.post("/user/toggle-account-type")
        if (data.success) {
            return data.account_type
        } else {
            return rejectWithValue(data.message || 'Failed to toggle account type')
        }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Network error')
    }
})

export const togglePrivacy = createAsyncThunk("user/togglePrivacy", async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.post("/user/toggle-privacy")
        if (data.success) {
            return data.is_private
        } else {
            return rejectWithValue(data.message || 'Failed to toggle privacy')
        }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Network error')
    }
})

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.value = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUser.fulfilled , (state, action) => {
            state.value = action.payload
        }).addCase(updateUser.fulfilled, (state, action) => {
            state.value = action.payload
        }).addCase(addExperience.fulfilled, (state, action) => {
            if (state.value) {
                state.value.experience = action.payload
            }
        }).addCase(addEducation.fulfilled, (state, action) => {
            if (state.value) {
                state.value.education = action.payload
            }
        })
    }
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
