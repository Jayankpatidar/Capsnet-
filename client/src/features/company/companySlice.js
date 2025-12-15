import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import toast from "react-hot-toast";

const initialState = {
  companies: [],
  currentCompany: null,
  myCompany: null,
  suggestedCompanies: [],
  loading: false,
  error: null
};

// Create Company
export const createCompany = createAsyncThunk(
  "company/create",
  async (companyData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Add basic company data
      Object.keys(companyData).forEach(key => {
        if (key === 'values' && Array.isArray(companyData[key])) {
          formData.append(key, companyData[key].join(','));
        } else if (key === 'logo' || key === 'cover_image') {
          if (companyData[key]) {
            formData.append(key, companyData[key]);
          }
        } else {
          formData.append(key, companyData[key]);
        }
      });

      const { data } = await api.post("/company/create", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (data.success) {
        toast.success("Company created successfully!");
        return data.company;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create company');
    }
  }
);

// Update Company
export const updateCompany = createAsyncThunk(
  "company/update",
  async ({ companyId, companyData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      Object.keys(companyData).forEach(key => {
        if (key === 'values' && Array.isArray(companyData[key])) {
          formData.append(key, companyData[key].join(','));
        } else if (key === 'logo' || key === 'cover_image') {
          if (companyData[key]) {
            formData.append(key, companyData[key]);
          }
        } else {
          formData.append(key, companyData[key]);
        }
      });

      const { data } = await api.put(`/company/update/${companyId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (data.success) {
        toast.success("Company updated successfully!");
        return data.company;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update company');
    }
  }
);

// Get Company Profile
export const getCompanyProfile = createAsyncThunk(
  "company/getProfile",
  async (companyId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/company/profile/${companyId}`);
      if (data.success) {
        return data.company;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch company profile');
    }
  }
);

// Get My Company
export const getMyCompany = createAsyncThunk(
  "company/getMyCompany",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/company/my-company");
      if (data.success) {
        return data.company;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your company');
    }
  }
);

// Follow/Unfollow Company
export const followCompany = createAsyncThunk(
  "company/follow",
  async (companyId, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/company/follow", { companyId });
      if (data.success) {
        toast.success(data.message);
        return { companyId, isFollowing: data.isFollowing };
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to follow company');
    }
  }
);

// Add Team Member
export const addTeamMember = createAsyncThunk(
  "company/addTeamMember",
  async ({ companyId, userId, role }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/company/add-team-member", { companyId, userId, role });
      if (data.success) {
        toast.success("Team member added successfully!");
        return data.company;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add team member');
    }
  }
);

// Remove Team Member
export const removeTeamMember = createAsyncThunk(
  "company/removeTeamMember",
  async ({ companyId, userId }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/company/remove-team-member", { companyId, userId });
      if (data.success) {
        toast.success("Team member removed successfully!");
        return data.company;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove team member');
    }
  }
);

// Create Company Post
export const createCompanyPost = createAsyncThunk(
  "company/createPost",
  async (postData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/company/post", postData);
      if (data.success) {
        toast.success("Post created successfully!");
        return data.post;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create post');
    }
  }
);

// Get Company Analytics
export const getCompanyAnalytics = createAsyncThunk(
  "company/getAnalytics",
  async (companyId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/company/analytics/${companyId}`);
      if (data.success) {
        return data.analytics;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
    }
  }
);

// Search Companies
export const searchCompanies = createAsyncThunk(
  "company/search",
  async (query, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/company/search?q=${encodeURIComponent(query)}`);
      if (data.success) {
        return data.companies;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search companies');
    }
  }
);

// Get Suggested Companies
export const getSuggestedCompanies = createAsyncThunk(
  "company/getSuggested",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/company/suggested");
      if (data.success) {
        return data.companies;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch suggested companies');
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    clearCompanyError: (state) => {
      state.error = null;
    },
    setCurrentCompany: (state, action) => {
      state.currentCompany = action.payload;
    },
    clearCurrentCompany: (state) => {
      state.currentCompany = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Company
      .addCase(createCompany.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.myCompany = action.payload;
        state.error = null;
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Company
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.myCompany = action.payload;
        state.currentCompany = action.payload;
        state.error = null;
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Company Profile
      .addCase(getCompanyProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCompanyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCompany = action.payload;
        state.error = null;
      })
      .addCase(getCompanyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get My Company
      .addCase(getMyCompany.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.myCompany = action.payload;
        state.error = null;
      })
      .addCase(getMyCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Follow Company
      .addCase(followCompany.fulfilled, (state, action) => {
        if (state.currentCompany && state.currentCompany._id === action.payload.companyId) {
          state.currentCompany.follower_count = action.payload.isFollowing
            ? state.currentCompany.follower_count + 1
            : state.currentCompany.follower_count - 1;
        }
      })

      // Search Companies
      .addCase(searchCompanies.fulfilled, (state, action) => {
        state.companies = action.payload;
      })

      // Get Suggested Companies
      .addCase(getSuggestedCompanies.fulfilled, (state, action) => {
        state.suggestedCompanies = action.payload;
      });
  }
});

export const { clearCompanyError, setCurrentCompany, clearCurrentCompany } = companySlice.actions;
export default companySlice.reducer;
