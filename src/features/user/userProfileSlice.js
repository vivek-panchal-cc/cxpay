import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "helpers/apiRequests";

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
      });
  },
});

export const { setUserProfile } = userProfileSlice.actions;
export default userProfileSlice.reducer;
