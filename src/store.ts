import { configureStore } from "@reduxjs/toolkit";
import { productApi } from "./features/inventory/productSlice";
import { orderApi } from "./features/orders/ordersSlice";
import { userApi } from "./features/users/userSlice";
import { categoryApi } from "./features/inventory/categorySlice";
import { dashboardApi } from "./features/dashboard/dashboardSlice";
import { notificationApi } from "./features/notifications/notificationSlice";
import { productsApi } from "./features/products/productsSlice";
import { paymentsApi } from "./features/payments/paymentsSlice";
import { paymentMethodsApi } from "./features/payments/paymentMethodsSlice";
import { activityApi } from "./features/activity/activitySlice";
import { cartApiSlice } from "./features/cart/cartApiSlice";
import { setStore } from "./features/cart/storeAccess";
import { setAuthErrorHandler } from "./api";

// Import reducers
import authReducer, { clearAuth } from "./features/auth/authSlice";
import cartReducer from "./features/cart/cartSlice";

// Create the store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    [productApi.reducerPath]: productApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [paymentsApi.reducerPath]: paymentsApi.reducer,
    [paymentMethodsApi.reducerPath]: paymentMethodsApi.reducer,
    [activityApi.reducerPath]: activityApi.reducer,
    [cartApiSlice.reducerPath]: cartApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Add serializability check options to handle potential issues
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // Ignore these field paths in state
        ignoredPaths: ['some.path.to.ignore'],
      },
    }).concat(
      productApi.middleware,
      orderApi.middleware,
      userApi.middleware,
      categoryApi.middleware,
      dashboardApi.middleware,
      notificationApi.middleware,
      productsApi.middleware,
      paymentsApi.middleware,
      paymentMethodsApi.middleware,
      activityApi.middleware,
      cartApiSlice.middleware
    ),
});

// Set up auth error handler
setAuthErrorHandler(() => {
  store.dispatch(clearAuth());
  // Optionally redirect to login
  window.location.href = '/login';
});

// Set the store in storeAccess with error handling
try {
  setStore(store);
  console.log('Store successfully set in storeAccess from store.ts');
} catch (error) {
  console.error('Failed to set store in storeAccess:', error);
}

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
