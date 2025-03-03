import { configureStore } from "@reduxjs/toolkit";
import  { usersApi } from "./features/users/userSlice";
import { default as authSlice } from "./features/auth/authSlice";
import { orderApi } from "./features/orders/ordersSlice";
import { productApi } from "./features/inventory/productSlice";
import { accountApi } from "./features/account/accountSlice";
const store = configureStore({
  reducer: {
    auth: authSlice,
    [orderApi.reducerPath]: orderApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [accountApi.reducerPath]:accountApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware()
      .concat(orderApi.middleware)
      .concat(productApi.middleware)
      .concat(accountApi.middleware)
      .concat(usersApi.middleware);
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
