import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cartApi } from "./cartApiSlice";
import { CartItem } from "../../lib/types";

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  isInitialized: false,
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.itemCount = action.payload.length;
      state.total = action.payload.reduce((total, item) => {
        const price = parseFloat(item.productSku?.price?.toString() || "0");
        return total + price * item.quantity;
      }, 0);
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.items.push(action.payload);
      state.itemCount = state.items.length;
      state.total = state.items.reduce((total, item) => {
        const price = parseFloat(item.productSku?.price?.toString() || "0");
        return total + price * item.quantity;
      }, 0);
    },
    removeFromCart: (state, action: PayloadAction<{ id: number }>) => {
      state.items = state.items.filter(item => item.id !== action.payload.id);
      state.itemCount = state.items.length;
      state.total = state.items.reduce((total, item) => {
        const price = parseFloat(item.productSku?.price?.toString() || "0");
        return total + price * item.quantity;
      }, 0);
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        state.total = state.items.reduce((total, item) => {
          const price = parseFloat(item.productSku?.price?.toString() || "0");
          return total + price * item.quantity;
        }, 0);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.itemCount = 0;
      state.total = 0;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setIsInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        cartApi.endpoints.getCart.matchFulfilled,
        (state, action) => {
          state.items = action.payload.items;
          state.itemCount = action.payload.items.length;
          state.total = action.payload.total;
          state.isInitialized = true;
          state.error = null;
        },
      )
      .addMatcher(
        cartApi.endpoints.getCart.matchRejected,
        (state, action) => {
          state.error = action.error.message || "Failed to fetch cart";
        },
      );
  },
});

export const {
  setCartItems,
  setIsLoading,
  setIsInitialized,
  setError,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart
} = cartSlice.actions;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotal = (state: { cart: CartState }) => state.cart.total;
export const selectCartItemCount = (state: { cart: CartState }) => state.cart.itemCount;

export default cartSlice.reducer;
