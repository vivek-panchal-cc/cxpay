import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "helpers/apiRequests";
import { storageRequest } from "helpers/storageRequests";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const initialState = {
  profile: {},
};

// Async thunks for asynchronous logic
export const fetchUserProfile = createAsyncThunk(
  "user/getProfile",
  async (_, thunkAPI) => {
    try {
      const { data } = await apiRequest.getUserProfile();
      if (!data.success || data.data === null) throw data.message;
      return data.data;
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchLogin = createAsyncThunk(
  "user/login",
  async (creds, thunkAPI) => {
    try {
      const { data } = await apiRequest.login(creds);
      if (!data.success) throw data.message;
      storageRequest.setAuth(data.data.token);
      return data.message;
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchLogout = createAsyncThunk(
  "user/logout",
  async (_, thunkAPI) => {
    try {
      const { data } = await apiRequest.logout();
      if (!data.success) throw data.message;
      storageRequest.removeAuth();
      return data.message;
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  }
);

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    setUserProfile(state, action) {
      state.profile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        console.log("Error getting user data", action.payload);
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        document.location.href = "/";
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        console.log("Error getting user data", action.payload);
      })
      .addCase(fetchLogout.fulfilled, (state, action) => {
        toast.success(action.payload);
        document.location.href = "/";
      })
      .addCase(fetchLogout.rejected, (state, action) => {
        console.log("Error getting user data", action.payload);
      });
  },
});

export const { setUserProfile } = userProfileSlice.actions;
export default userProfileSlice.reducer;
