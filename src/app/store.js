import { configureStore } from "@reduxjs/toolkit";
import userProfileReducer from "../features/user/userProfileSlice";

export const store = configureStore({
  reducer: {
    userProfile: userProfileReducer,
  },
});
