import { apiRequest } from "helpers/apiRequests";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const initialState = {
  dropNotifications: [],
  allNotifications: [],
  pagination: {
    current_page: 1,
    total: 1,
    from: 1,
    to: 1,
    last_page: 1,
  },
};

export const fetchGetNotifications = createAsyncThunk(
  "notify/getNotifications",
  async (_, thunkAPI) => {
    try {
      const { data } = await apiRequest.getAllNotifications({ page: 1 });
      if (!data.success) throw data.message;
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchGetAllNotifications = createAsyncThunk(
  "notify/getAllNotifications",
  async (page, thunkAPI) => {
    try {
      const { data } = await apiRequest.getAllNotifications({ page: page });
      if (!data.success) throw data.message;
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const userNotificationslice = createSlice({
  initialState: initialState,
  name: "userNotification",
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetNotifications.fulfilled, (state, action) => {
        state.dropNotifications = action.payload.notifications;
      })
      .addCase(fetchGetNotifications.rejected, (state, action) => {
        state.dropNotifications = [];
      })
      .addCase(fetchGetAllNotifications.fulfilled, (state, action) => {
        state.allNotifications = action.payload.notifications;
        state.pagination = {
          current_page: action.payload?.pagination?.current_page,
          total: action.payload?.pagination?.total,
          from: action.payload?.pagination?.from,
          to: action.payload?.pagination?.to,
          last_page: action.payload?.pagination?.last_page,
        };
      })
      .addCase(fetchGetAllNotifications.rejected, (state, action) => {
        state.allNotifications = [];
      });
  },
});

export default userNotificationslice.reducer;
