import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import toast from "react-hot-toast";

// Resume Parser
export const parseResume = createAsyncThunk(
  "ai/parseResume",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/ai/parse-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to parse resume"
      );
    }
  }
);

// Caption Generator
export const generateCaption = createAsyncThunk(
  "ai/generateCaption",
  async (imageDescription, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/ai/generate-caption", {
        imageDescription,
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate caption"
      );
    }
  }
);

// Fake Profile Detection
export const detectFakeProfile = createAsyncThunk(
  "ai/detectFakeProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/ai/detect-fake", { userId });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to detect fake profile"
      );
    }
  }
);

// Profile Analyzer
export const analyzeProfile = createAsyncThunk(
  "ai/analyzeProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/ai/analyze-profile");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to analyze profile"
      );
    }
  }
);

// Connection Suggestions
export const getConnectionSuggestions = createAsyncThunk(
  "ai/getConnectionSuggestions",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/ai/suggest-connections");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get suggestions"
      );
    }
  }
);

// Recent Posts
export const getRecentPosts = createAsyncThunk(
  "ai/getRecentPosts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/ai/recent-posts");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get recent posts"
      );
    }
  }
);

// User Stories
export const getUserStories = createAsyncThunk(
  "ai/getUserStories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/ai/user-stories");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get user stories"
      );
    }
  }
);

// Job Suggestions
export const getJobSuggestions = createAsyncThunk(
  "ai/getJobSuggestions",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/ai/job-suggestions");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get job suggestions"
      );
    }
  }
);

const initialState = {
  resumeData: null,
  caption: null,
  hashtags: [],
  fakeProfileResult: null,
  profileAnalysis: null,
  connectionSuggestions: [],
  recentPosts: [],
  userStories: [],
  jobSuggestions: [],
  loading: false,
  error: null,
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    clearResumeData: (state) => {
      state.resumeData = null;
    },
    clearCaption: (state) => {
      state.caption = null;
      state.hashtags = [];
    },
    clearFakeProfileResult: (state) => {
      state.fakeProfileResult = null;
    },
    clearProfileAnalysis: (state) => {
      state.profileAnalysis = null;
    },
    clearConnectionSuggestions: (state) => {
      state.connectionSuggestions = [];
    },
    clearRecentPosts: (state) => {
      state.recentPosts = [];
    },
    clearUserStories: (state) => {
      state.userStories = [];
    },
    clearJobSuggestions: (state) => {
      state.jobSuggestions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Resume Parser
      .addCase(parseResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(parseResume.fulfilled, (state, action) => {
        state.loading = false;
        state.resumeData = action.payload;
        toast.success("Resume parsed successfully!");
      })
      .addCase(parseResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Caption Generator
      .addCase(generateCaption.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateCaption.fulfilled, (state, action) => {
        state.loading = false;
        state.caption = action.payload.caption;
        state.hashtags = action.payload.hashtags;
        toast.success("Caption generated!");
      })
      .addCase(generateCaption.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Fake Profile Detection
      .addCase(detectFakeProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(detectFakeProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.fakeProfileResult = action.payload;
      })
      .addCase(detectFakeProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Profile Analyzer
      .addCase(analyzeProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(analyzeProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profileAnalysis = action.payload;
      })
      .addCase(analyzeProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Connection Suggestions
      .addCase(getConnectionSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getConnectionSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.connectionSuggestions = action.payload.suggestions;
      })
      .addCase(getConnectionSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Recent Posts
      .addCase(getRecentPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRecentPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.recentPosts = action.payload.posts;
      })
      .addCase(getRecentPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // User Stories
      .addCase(getUserStories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserStories.fulfilled, (state, action) => {
        state.loading = false;
        state.userStories = action.payload.stories;
      })
      .addCase(getUserStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Job Suggestions
      .addCase(getJobSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.jobSuggestions = action.payload.jobs;
      })
      .addCase(getJobSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const {
  clearResumeData,
  clearCaption,
  clearFakeProfileResult,
  clearProfileAnalysis,
  clearConnectionSuggestions,
  clearRecentPosts,
  clearUserStories,
  clearJobSuggestions,
} = aiSlice.actions;

export default aiSlice.reducer;
