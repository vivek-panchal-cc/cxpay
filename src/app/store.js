import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import userProfileReducer from "../features/user/userProfileSlice";
import userWalletReducer from "../features/user/userWalletSlice";

export const store = configureStore({
  reducer: {
    userProfile: userProfileReducer,
    userWallet: userWalletReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
