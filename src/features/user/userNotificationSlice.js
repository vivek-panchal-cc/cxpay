import { apiRequest } from "helpers/apiRequests";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  initialLoading: true,
  dropNotifications: [],
  allNotifications: [],
  pendingRead: false,
  pagination: {
    current_page: 1,
    total: 0,
    from: 0,
    to: 0,
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

export const fetchMarkAsRead = createAsyncThunk(
  "notify/markAsReadNotification",
  async (id, thunkAPI) => {
    try {
      const { data } = await apiRequest.markAsRead({ id });
      if (!data.success) throw data.message;
      return { id: id, message: data.message };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchMarkAllAsRead = createAsyncThunk(
  "notify/markAsAllReadNotification",
  async (_, thunkAPI) => {
    try {
      const { data } = await apiRequest.markAllAsReadNotifications();
      if (!data.success) throw data.message;
      return { message: data.message };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchDeleteNotifications = createAsyncThunk(
  "notify/deleteNotification",
  async ({ id = "", delete_all = false }, thunkAPI) => {
    try {
      const ids = id ? { notification_id: [id] } : {};
      const { userNotification } = thunkAPI.getState();
      const { pagination } = userNotification || {};
      const { current_page, from, to, last_page } = pagination || {};
      let page = current_page ? current_page : 1;
      if (current_page && current_page === last_page && from === to)
        page = current_page - 1;
      const { data } = await apiRequest.deleteNotifications({
        ...ids,
        delete_all: delete_all.toString(),
      });
      if (!data.success) throw data.message;
      await thunkAPI.dispatch(fetchGetNotifications());
      await thunkAPI.dispatch(fetchGetAllNotifications(page ? page : 1));
      return data.message;
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
        if (state.allNotifications.length <= 0)
          state.allNotifications = action.payload.notifications;
        state.dropNotifications = action.payload.notifications;
        state.pendingRead = action.payload.unreadNotificationCount;
        state.initialLoading = false;
      })
      .addCase(fetchGetNotifications.rejected, (state, action) => {
        state.allNotifications = [];
        state.dropNotifications = [];
        state.initialLoading = false;
        state.pendingRead = false;
        state.pagination = initialState.pagination;
      })
      .addCase(fetchGetAllNotifications.fulfilled, (state, action) => {
        state.allNotifications = action.payload.notifications;
        state.pendingRead = action.payload.unreadNotificationCount;
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
        state.dropNotifications = [];
        state.initialLoading = false;
        state.pendingRead = false;
        state.pagination = initialState.pagination;
      })
      .addCase(fetchMarkAsRead.fulfilled, (state, action) => {
        const { id } = action.payload;
        state.allNotifications?.map((item) => {
          if (item.id === id) item.status = 1;
          return item;
        });
        state.dropNotifications?.map((item) => {
          if (item.id === id) item.status = 1;
          return item;
        });
      })
      .addCase(fetchMarkAsRead.rejected, (state, action) => {
        console.log("ERROR ", action.payload);
      })
      .addCase(fetchDeleteNotifications.fulfilled, (state, action) => {})
      .addCase(fetchDeleteNotifications.rejected, (state, action) => {
        console.log("ERROR ", action.payload);
      })
      .addCase(fetchMarkAllAsRead.fulfilled, (state, action) => {
        state.allNotifications?.forEach((notification) => {
          notification.status = 1;
        });
      })
      .addCase(fetchMarkAllAsRead.rejected, (state, action) => {
        console.log("ERROR ", action.payload);
      });
  },
});

export default userNotificationslice.reducer;
