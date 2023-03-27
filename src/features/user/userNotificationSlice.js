import { apiRequest } from "helpers/apiRequests";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const initialState = {
  notifications: [],
  page: 1,
};

export const fetchGetAllNotifications = createAsyncThunk(
  "notify/gatAllNotifications",
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
      .addCase(fetchGetAllNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload.notifications;
      })
      .addCase(fetchGetAllNotifications.rejected, (state, action) => {
        console.log("ERROR: ", action.payload);
        state.notifications = [];
      });
  },
});

export const {} = userNotificationslice.actions;
export default userNotificationslice.reducer;
