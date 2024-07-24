import { configureStore } from "@reduxjs/toolkit";
import userNotificationReducer from "features/user/userNotificationSlice";
import userProfileReducer from "../features/user/userProfileSlice";
import userWalletReducer from "../features/user/userWalletSlice";
import payAddFundReducer from "features/payment/payAddFundSlice";

export const store = configureStore({
  reducer: {
    userProfile: userProfileReducer,
    userWallet: userWalletReducer,
    userNotification: userNotificationReducer,
    payAddFund: payAddFundReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
});
