import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { cartApiSlice } from './cartApiSlice';
import { createAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  productSkuId?: number; // ID of the product SKU/variant
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;
}

// Load cart from localStorage if available
const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return [];

  try {
    const storedCart = localStorage.getItem('cart');
    console.log('🔍 Loading cart from localStorage:', storedCart);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error('❌ Failed to load cart from localStorage:', error);
    return [];
  }
};

const initialState: CartState = {
  items: [], // Start with empty cart, will be populated by initializeCart
  isOpen: false,
  isLoading: false,
  isInitialized: false,
  isAuthenticated: false
};

// Helper function to find an item in the cart
const findCartItem = (state: CartState, id: number, productSkuId?: number) => {
  if (productSkuId !== undefined) {
    return state.items.find(item => item.id === id && item.productSkuId === productSkuId);
  }
  return state.items.find(item => item.id === id);
};

// Helper function to save cart to localStorage
const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window === 'undefined') return;

  try {
    console.log('💾 Saving cart to localStorage:', items);
    localStorage.setItem('cart', JSON.stringify(items));
  } catch (error) {
    console.error('❌ Failed to save cart to localStorage:', error);
  }
};

// Helper function to safely extract items from API response
const safelyExtractItems = (payload: any): CartItem[] => {
  if (!payload) return [];

  // Check if payload has items property
  if (payload.items && Array.isArray(payload.items)) {
    return payload.items;
  }

  // Check if payload itself is an array
  if (Array.isArray(payload)) {
    return payload;
  }

  // Check if payload has data.items
  if (payload.data && Array.isArray(payload.data.items)) {
    return payload.data.items;
  }

  // If we can't find items, return empty array
  return [];
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = findCartItem(state, action.payload.id);

      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: action.payload.quantity || 1
        });
      }

      saveCartToStorage(state.items);
    },

    removeFromCart: (state, action: PayloadAction<{ id: number, productSkuId?: number }>) => {
      const { id, productSkuId } = action.payload;

      if (productSkuId !== undefined) {
        // If productSkuId is provided, remove only the specific variant
        state.items = state.items.filter(item => !(item.id === id && item.productSkuId === productSkuId));
      } else {
        // Otherwise, remove all items with the given id
        state.items = state.items.filter(item => item.id !== id);
      }

      saveCartToStorage(state.items);
    },

    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number; productSkuId?: number }>) => {
      const { id, quantity, productSkuId } = action.payload;
      const item = findCartItem(state, id, productSkuId);

      if (item && quantity > 0) {
        item.quantity = quantity;
        saveCartToStorage(state.items);
      }
    },

    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    closeCart: (state) => {
      state.isOpen = false;
    },

    openCart: (state) => {
      state.isOpen = true;
    },

    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      if (action.payload) {
        state.items = action.payload;
        saveCartToStorage(action.payload);
      }
    },

    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setIsInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },

    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      console.group('🔄 cartSlice: setIsAuthenticated');
      console.log('Setting isAuthenticated to:', action.payload);

      const previousValue = state.isAuthenticated;
      state.isAuthenticated = action.payload;

      if (previousValue !== action.payload) {
        console.log(`Authentication status changed from ${previousValue} to ${action.payload}`);

        // If user just logged in, we'll need to sync the cart
        if (action.payload === true && previousValue === false) {
          console.log('User just logged in, cart will be synced');
          // Note: The actual sync is handled by the auth slice or login component
        }

        // If user just logged out, we should load cart from localStorage
        if (action.payload === false && previousValue === true) {
          console.log('User just logged out, loading cart from localStorage');
          try {
            const storedCart = localStorage.getItem('cart');
            if (storedCart) {
              const parsedCart = JSON.parse(storedCart);
              if (Array.isArray(parsedCart)) {
                console.log('✅ Loaded cart from localStorage after logout:', parsedCart);
                state.items = parsedCart;
              }
            } else {
              console.log('ℹ️ No cart found in localStorage after logout, using empty cart');
              state.items = [];
            }
          } catch (error) {
            console.error('❌ Error loading cart from localStorage after logout:', error);
            state.items = [];
          }
        }
      } else {
        console.log('Authentication status unchanged');
      }

      console.groupEnd();
    }
  },
  extraReducers: (builder) => {
    // Handle setEmptyCart action - this must come before any matchers
    builder.addCase(setEmptyCart, (state) => {
      console.log('ℹ️ Setting empty cart');
      state.items = [];
      state.isLoading = false;

      // Save empty cart to localStorage for guest users
      if (!state.isAuthenticated) {
        console.log('💾 Saving empty cart to localStorage for guest user');
        saveCartToStorage([]);
      }
    });

    // Handle API responses
    builder.addMatcher(
      cartApiSlice.endpoints.getCart.matchFulfilled,
      (state, action) => {
        console.group('🔄 cartSlice: Processing getCart.fulfilled');
        console.log('Action payload:', action.payload);

        if (!action.payload) {
          console.warn('⚠️ getCart.fulfilled payload is null or undefined');
          console.groupEnd();
          return;
        }

        // Check if the payload has items
        if (action.payload.items && Array.isArray(action.payload.items)) {
          console.log('✅ Setting cart items from getCart response:', action.payload.items);
          state.items = action.payload.items;
          state.isLoading = false;

          // Save to localStorage for all users (helps with page refreshes)
          console.log('💾 Saving cart items to localStorage');
          saveCartToStorage(state.items);
        } else {
          console.log('ℹ️ getCart returned empty or invalid items, using empty cart');
          state.items = [];

          // Save empty cart to localStorage
          console.log('💾 Saving empty cart to localStorage');
          saveCartToStorage([]);
        }
        console.groupEnd();
      }
    );

    builder.addMatcher(
      cartApiSlice.endpoints.addItemToCart.matchFulfilled,
      (state, action) => {
        console.group('🔄 cartSlice: Processing addItemToCart.fulfilled');
        console.log('Action payload:', action.payload);

        if (!action.payload) {
          console.warn('⚠️ addItemToCart.fulfilled payload is null or undefined');
          console.groupEnd();
          return;
        }

        // Check if the payload has items
        if (action.payload.items && Array.isArray(action.payload.items)) {
          console.log('✅ Setting cart items from addItemToCart response:', action.payload.items);
          state.items = action.payload.items;
          state.isLoading = false;

          // Save to localStorage for all users (helps with page refreshes)
          console.log('💾 Saving cart items to localStorage');
          saveCartToStorage(state.items);
        } else {
          console.warn('⚠️ addItemToCart returned empty or invalid items');
          // Keep existing items if the response is invalid
          console.groupEnd();
        }
        console.groupEnd();
      }
    );

    builder.addMatcher(
      cartApiSlice.endpoints.updateCartItem.matchFulfilled,
      (state, { payload }) => {
        const items = safelyExtractItems(payload);
        if (items.length > 0) {
          state.items = items;
          saveCartToStorage(items);
        }
      }
    );

    builder.addMatcher(
      cartApiSlice.endpoints.removeCartItem.matchFulfilled,
      (state, { payload }) => {
        const items = safelyExtractItems(payload);
        if (items.length > 0) {
          state.items = items;
          saveCartToStorage(items);
        } else {
          // If all items were removed, ensure we save an empty cart
          state.items = [];
          saveCartToStorage([]);
        }
      }
    );

    builder.addMatcher(
      cartApiSlice.endpoints.clearCart.matchFulfilled,
      (state) => {
        state.items = [];
        saveCartToStorage([]);
      }
    );
  }
});

// Export actions
export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  closeCart,
  openCart,
  setCartItems,
  setIsLoading,
  setIsInitialized,
  setIsAuthenticated
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartIsOpen = (state: { cart: CartState }) => state.cart.isOpen;
export const selectCartIsLoading = (state: { cart: CartState }) => state.cart.isLoading;
export const selectCartIsInitialized = (state: { cart: CartState }) => state.cart.isInitialized;
export const selectCartItemsCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

// Add a new action to handle the case where no cart exists
export const setEmptyCart = createAction('cart/setEmptyCart');

export default cartSlice.reducer; 