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

const fetchLoginOtpVerify = createAsyncThunk(
  "user/loginOtpVerify",
  async (creds, thunkAPI) => {
    try {
      const { data } = await apiRequest.loginOtpVerify(creds);
      if (!data.success) throw data;
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
      if (!data.success) throw data.message;
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const fetchDeactivateAccount = createAsyncThunk(
  "user/deactivateAccount",
  async (creds, thunkAPI) => {
    try {
      const { data } = await apiRequest.deactivateAccount(creds);
      if (!data.success) throw data.message;
      return data.message;
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
        // document.location.href = "/";
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        console.log("Error getting user data", action.payload);
      })
      .addCase(fetchLoginOtpVerify.fulfilled, (state, action) => {
        // document.location.href = "/";
      })
      .addCase(fetchLoginOtpVerify.rejected, (state, action) => {
        console.log("Error getting user data", action.payload);
      })
      .addCase(fetchLogout.fulfilled, (state, action) => {
        storageRequest.removeAuth();
        toast.success(action.payload);
        // document.location.href = "/login";
      })
      .addCase(fetchLogout.rejected, (state, action) => {
        storageRequest.removeAuth();
        console.log("Error getting user data", action.payload);
        // document.location.href = "/login";
      })
      .addCase(fetchDeactivateAccount.fulfilled, (state, action) => {
        storageRequest.removeAuth();
        toast.success(action.payload);
        document.location.href = "/login";
      })
      .addCase(fetchDeactivateAccount.rejected, (state, action) => {
        toast.error(action.payload);
      });
  },
});

export {
  fetchLogin,
  fetchLogout,
  fetchUserProfile,
  fetchLoginOtpVerify,
  fetchDeactivateAccount,
};
export const { setUserProfile, setEditCard, setEditBank } =
  userProfileSlice.actions;
export default userProfileSlice.reducer;
