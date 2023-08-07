import { configureStore } from "@reduxjs/toolkit";
import userNotificationReducer from "features/user/userNotificationSlice";
import userProfileReducer from "../features/user/userProfileSlice";
import userWalletReducer from "../features/user/userWalletSlice";

export const store = configureStore({
  reducer: {
    userProfile: userProfileReducer,
    userWallet: userWalletReducer,
    userNotification: userNotificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production", 
});
