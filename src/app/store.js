import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import userProfileReducer from "../features/user/userProfileSlice";

export const store = configureStore({
  reducer: {
    userProfile: userProfileReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
