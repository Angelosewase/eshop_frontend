import { configureStore } from "@reduxjs/toolkit";
import { usersApi } from "./features/users/userSlice";
import { default as authSlice } from "./features/auth/authSlice";
import { orderApi } from "./features/orders/ordersSlice";
import {
  productApi,
  productAttributesApi,
} from "./features/inventory/productSlice";
import { accountApi } from "./features/account/accountSlice";
import {
  categoriesApi,
  subCategoriesApi,
} from "./features/inventory/categoriesSlice";
const store = configureStore({
  reducer: {
    auth: authSlice,
    [orderApi.reducerPath]: orderApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [subCategoriesApi.reducerPath]: subCategoriesApi.reducer,
    [productAttributesApi.reducerPath]: productAttributesApi.reducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware()
      .concat(orderApi.middleware)
      .concat(productApi.middleware)
      .concat(accountApi.middleware)
      .concat(usersApi.middleware)
      .concat(categoriesApi.middleware)
      .concat(subCategoriesApi.middleware)
      .concat(productAttributesApi.middleware);
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
