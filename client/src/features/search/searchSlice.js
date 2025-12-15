import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

// Async thunks for search operations
export const searchUsers = createAsyncThunk(
  "search/searchUsers",
  async ({ query, limit = 20, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/search/users`, {
        params: { query, limit, page },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to search users");
    }
  }
);

export const searchPosts = createAsyncThunk(
  "search/searchPosts",
  async ({ query, limit = 20, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/search/posts`, {
        params: { query, limit, page },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to search posts");
    }
  }
);

export const searchJobs = createAsyncThunk(
  "search/searchJobs",
  async ({ query, location, jobType, workType, limit = 20, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/search/jobs`, {
        params: { query, location, jobType, workType, limit, page },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to search jobs");
    }
  }
);

export const searchCompanies = createAsyncThunk(
  "search/searchCompanies",
  async ({ query, industry, location, limit = 20, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/search/companies`, {
        params: { query, industry, location, limit, page },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to search companies");
    }
  }
);

export const searchReels = createAsyncThunk(
  "search/searchReels",
  async ({ query, limit = 20, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/search/reels`, {
        params: { query, limit, page },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to search reels");
    }
  }
);

export const searchHashtags = createAsyncThunk(
  "search/searchHashtags",
  async ({ query, limit = 20, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/search/hashtags`, {
        params: { query, limit, page },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to search hashtags");
    }
  }
);

export const searchByLocation = createAsyncThunk(
  "search/searchByLocation",
  async ({ query, limit = 20, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/search/location`, {
        params: { query, limit, page },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to search by location");
    }
  }
);

export const searchBySkills = createAsyncThunk(
  "search/searchBySkills",
  async ({ query, limit = 20, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/search/skills`, {
        params: { query, limit, page },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to search by skills");
    }
  }
);

export const searchAudioMusic = createAsyncThunk(
  "search/searchAudioMusic",
  async ({ query, limit = 20, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/search/audio-music`, {
        params: { query, limit, page },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to search audio/music");
    }
  }
);

export const globalAdvancedSearch = createAsyncThunk(
  "search/globalAdvancedSearch",
  async ({ query, limit = 20, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/search/global`, {
        params: { query, limit, page },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to perform global search");
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    results: null,
    loading: false,
    error: null,
    searchType: "global",
    query: "",
    filters: {},
    currentQuery: "",
    currentType: "all",
    currentFilters: {},
  },
  reducers: {
    clearSearchResults: (state) => {
      state.results = null;
      state.error = null;
      state.currentQuery = "";
      state.currentType = "all";
      state.currentFilters = {};
    },
    setSearchType: (state, action) => {
      state.searchType = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.query = action.payload;
    },
    setSearchFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSearchFilters: (state) => {
      state.filters = {};
    },
    setCurrentSearch: (state, action) => {
      state.currentQuery = action.payload.query;
      state.currentType = action.payload.type;
      state.currentFilters = action.payload.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      // Users search
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.searchType = "users";
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Posts search
      .addCase(searchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.searchType = "posts";
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Jobs search
      .addCase(searchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.searchType = "jobs";
      })
      .addCase(searchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Companies search
      .addCase(searchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.searchType = "companies";
      })
      .addCase(searchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reels search
      .addCase(searchReels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchReels.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.searchType = "reels";
      })
      .addCase(searchReels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Hashtags search
      .addCase(searchHashtags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchHashtags.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.searchType = "hashtags";
      })
      .addCase(searchHashtags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Location search
      .addCase(searchByLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchByLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.searchType = "location";
      })
      .addCase(searchByLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Skills search
      .addCase(searchBySkills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchBySkills.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.searchType = "skills";
      })
      .addCase(searchBySkills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Audio/Music search
      .addCase(searchAudioMusic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchAudioMusic.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.searchType = "audio-music";
      })
      .addCase(searchAudioMusic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Global search
      .addCase(globalAdvancedSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(globalAdvancedSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.searchType = "global";
      })
      .addCase(globalAdvancedSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearSearchResults,
  setSearchType,
  setSearchQuery,
  setSearchFilters,
  clearSearchFilters,
  setCurrentSearch,
} = searchSlice.actions;

export default searchSlice.reducer;
