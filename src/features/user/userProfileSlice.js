import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "helpers/apiRequests";
import { storageRequest } from "helpers/storageRequests";
import { toast } from "react-toastify";

const initialState = {
  profile: {},
  card: {},
  bank: {},
};

// Async thunks for asynchronous logic
const fetchLogin = createAsyncThunk("user/login", async (creds, thunkAPI) => {
  try {
    const { data } = await apiRequest.login(creds);
    if (!data.success) throw data.message;
    storageRequest.setAuth(data.data.token);
    return data.message;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

const fetchLoginOtp = createAsyncThunk(
  "user/loginOtp",
  async (creds, thunkAPI) => {
    try {
      const { data } = await apiRequest.verifyLoginOtp(creds);
      if (!data.success) throw data.message;
      storageRequest.setAuth(data.data.token);
      return data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const fetchLogout = createAsyncThunk("user/logout", async (_, thunkAPI) => {
  try {
    const { data } = await apiRequest.logout();
    if (!data.success) throw data.message;
    return data.message;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

const fetchUserProfile = createAsyncThunk(
  "user/getProfile",
  async (_, thunkAPI) => {
    try {
      const { data } = await apiRequest.getUserProfile();
      if (!data.success || data.data === null) throw data.message;
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
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
    setEditCard(state, action) {
      state.card = action.payload;
    },
    setEditBank(state, action) {
      state.bank = action.payload;
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
      .addCase(fetchLoginOtp.fulfilled, (state, action) => {
        document.location.href = "/";
      })
      .addCase(fetchLoginOtp.rejected, (state, action) => {
        console.log("Error getting user data", action.payload);
      })
      .addCase(fetchLogout.fulfilled, (state, action) => {
        storageRequest.removeAuth();
        toast.success(action.payload);
        document.location.href = "/login";
      })
      .addCase(fetchLogout.rejected, (state, action) => {
        storageRequest.removeAuth();
        console.log("Error getting user data", action.payload);
        document.location.href = "/login";
      });
  },
});

export { fetchLogin, fetchLogout, fetchUserProfile, fetchLoginOtp };
export const { setUserProfile, setEditCard, setEditBank } =
  userProfileSlice.actions;
export default userProfileSlice.reducer;
