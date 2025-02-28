import { configureStore } from "@reduxjs/toolkit";
import  userSlice from "../features/user/userSlice";
import { default as  authSlice } from "../features/auth/authSlice";
 const store = configureStore({
  reducer: {
    user: userSlice,
    auth: authSlice
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
