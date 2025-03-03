import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/user/userSlice";
import { default as authSlice } from "./features/auth/authSlice";
import { orderApi } from "./features/orders/ordersSlice";
import { productApi } from "./features/inventory/productSlice";
const store = configureStore({
  reducer: {
    user: userSlice,
    auth: authSlice,
    [orderApi.reducerPath]: orderApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware()
      .concat(orderApi.middleware)
      .concat(productApi.middleware);
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
