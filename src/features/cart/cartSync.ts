import { getState, dispatch, isAuthenticated } from './storeAccess';
import { setCartItems, setIsLoading, setIsInitialized, CartItem } from './cartSlice';
import { cartApiSlice } from './cartApiSlice';
import errorHandler, { ErrorCategory, ErrorSeverity } from '../../utils/errorHandler';
import { CartItem as CartItemType } from '@/types/cart';

/**
 * Safely extracts cart items from API response
 */
export const safelyExtractItems = (apiResult: any): CartItem[] => {
  console.group('🔍 safelyExtractItems');
  console.log('API result:', apiResult);

  if (!apiResult) {
    console.warn('⚠️ API result is null or undefined');
    console.groupEnd();
    return [];
  }

  if (!apiResult.items || !Array.isArray(apiResult.items)) {
    console.warn('⚠️ API result has no items array:', apiResult);
    console.groupEnd();
    return [];
  }

  console.log('✅ Extracted items:', apiResult.items);
  console.groupEnd();
  return apiResult.items;
};

/**
 * Loads cart items from localStorage
 */
const loadCartFromStorage = (): CartItem[] => {
  console.group('🔍 loadCartFromStorage');

  if (typeof window === 'undefined') {
    console.log('⚠️ Window is undefined (SSR context)');
    console.groupEnd();
    return [];
  }

  try {
    const storedCart = localStorage.getItem('cart');
    console.log('localStorage cart:', storedCart);

    if (!storedCart) {
      console.log('ℹ️ No cart found in localStorage');
      console.groupEnd();
      return [];
    }

    const parsedCart = JSON.parse(storedCart);
    console.log('✅ Loaded cart from localStorage:', parsedCart);
    console.groupEnd();
    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch (error) {
    console.error('❌ Failed to load cart from localStorage:', error);
    console.groupEnd();
    return [];
  }
};

/**
 * Check if the response indicates that no cart exists yet
 */
const isNoCartResponse = (result: any): boolean => {
  if (!result || !result.data) return false;

  // Check for specific error messages
  if (result.data.message === 'Cart not found' || result.data.message === 'No cart exists') {
    return true;
  }

  // Check for error status
  if (result.data.status === 404 && result.data.error &&
    (result.data.error.includes('cart') || result.data.error.includes('Cart'))) {
    return true;
  }

  return false;
};

/**
 * Utility functions for syncing cart with the server
 * Separated to avoid circular dependencies
 */
export const cartSync = {
  /**
   * Sync local cart with server after login
   * This method adds each local cart item to the server cart one by one
   * since there's no dedicated syncCart endpoint
   */
  async syncCartAfterLogin() {
    console.group('🔄 syncCartAfterLogin');
    console.log('Starting cart sync after login');

    try {
      // Get current state
      const state = getState();
      console.log('Current state:', state);

      if (!state.cart) {
        console.warn('⚠️ Cart state not found');
        console.groupEnd();
        return;
      }

      // Check if we have local items to sync
      const localItems = state.cart.items;
      console.log('Local cart items:', localItems);

      if (!localItems || localItems.length === 0) {
        console.log('ℹ️ No local items to sync');
        console.groupEnd();
        return;
      }

      // First, check if user already has a cart on the server
      console.log('🔍 Checking if user has a cart on the server');
      const getCartResult = await dispatch(
        cartApiSlice.endpoints.getCart.initiate()
      );

      // If user has a cart with items, we need to decide on a merge strategy
      // For now, we'll prioritize the local cart
      if (getCartResult.data && getCartResult.data.items && getCartResult.data.items.length > 0) {
        console.log('ℹ️ User already has a cart on the server, clearing it before syncing local items');
        await dispatch(
          cartApiSlice.endpoints.clearCart.initiate()
        );
      }

      // Then add each local item to the server cart
      console.log('➕ Adding local items to server cart');
      for (const item of localItems) {
        console.log('Adding item to server cart:', item);
        await dispatch(
          cartApiSlice.endpoints.addItemToCart.initiate({
            productId: item.id,
            quantity: item.quantity,
            productSkuId: item.productSkuId
          })
        );
      }

      console.log('✅ Cart sync completed successfully');
    } catch (error) {
      console.error('❌ Error syncing cart after login:', error);
    }

    console.groupEnd();
  },

  /**
   * Initialize the cart
   * For authenticated users, fetch cart from API
   * For guest users, use local cart from localStorage
   * 
   * According to requirements:
   * 1. Don't initialize an empty cart
   * 2. Only initialize when a user adds at least one product
   * 3. Ensure cart is synchronized between localStorage and DB
   */
  async initializeCart() {
    console.group('🔄 initializeCart');
    console.log('Initializing cart');

    try {
      // Check if user is authenticated
      const authenticated = isAuthenticated();
      console.log('User authenticated:', authenticated);

      if (authenticated) {
        console.log('🔍 Fetching cart from API for authenticated user');

        // Fetch cart from API
        const result = await dispatch(
          cartApiSlice.endpoints.getCart.initiate()
        );
        console.log('API getCart result:', result);

        if (result.data) {
          console.log('✅ Cart data received from API:', result.data);

          // Check if the cart has items
          if (result.data.items && result.data.items.length > 0) {
            console.log('✅ Server cart has items, using server cart');
            dispatch(setCartItems(result.data.items));
          } else {
            console.log('ℹ️ Server cart is empty, checking localStorage for items to sync');

            // Check if we have items in localStorage to sync
            const localItems = loadCartFromStorage();

            if (localItems.length > 0) {
              console.log('🔄 Found items in localStorage, syncing with server');

              // Set items in Redux store first
              dispatch(setCartItems(localItems));

              // Then sync with server
              for (const item of localItems) {
                console.log('Adding item to server cart:', item);
                await dispatch(
                  cartApiSlice.endpoints.addItemToCart.initiate({
                    productId: item.id,
                    quantity: item.quantity,
                    productSkuId: item.productSkuId
                  })
                );
              }
            } else {
              console.log('ℹ️ No items in localStorage, using empty cart');
              // Don't initialize an empty cart - just set empty array in Redux
              dispatch(setCartItems([]));
            }
          }
        } else {
          console.warn('⚠️ No cart data returned from API');

          // Check if we have items in localStorage to sync
          const localItems = loadCartFromStorage();

          if (localItems.length > 0) {
            console.log('🔄 Found items in localStorage, syncing with server');

            // Set items in Redux store first
            dispatch(setCartItems(localItems));

            // Then sync with server
            for (const item of localItems) {
              console.log('Adding item to server cart:', item);
              await dispatch(
                cartApiSlice.endpoints.addItemToCart.initiate({
                  productId: item.id,
                  quantity: item.quantity,
                  productSkuId: item.productSkuId
                })
              );
            }
          } else {
            console.log('ℹ️ No items in localStorage, using empty cart');
            // Don't initialize an empty cart - just set empty array in Redux
            dispatch(setCartItems([]));
          }
        }
      } else {
        // For guest users, load cart from localStorage
        console.log('🔍 Loading cart from localStorage for guest user');
        const localItems = loadCartFromStorage();

        if (localItems.length > 0) {
          console.log('✅ Found items in localStorage, setting in Redux store');
          dispatch(setCartItems(localItems));
        } else {
          console.log('ℹ️ No items in localStorage, using empty cart');
          // Don't initialize an empty cart - just set empty array in Redux
          dispatch(setCartItems([]));
        }
      }

      // Mark cart as initialized
      dispatch(setIsInitialized(true));
      console.log('✅ Cart initialization completed');
    } catch (error) {
      console.error('❌ Error initializing cart:', error);

      // Fallback to localStorage in case of API errors
      console.log('🔄 Falling back to localStorage due to error');
      const localItems = loadCartFromStorage();

      if (localItems.length > 0) {
        console.log('✅ Found items in localStorage, using as fallback');
        dispatch(setCartItems(localItems));
      } else {
        console.log('ℹ️ No items in localStorage, using empty cart');
        // Don't initialize an empty cart - just set empty array in Redux
        dispatch(setCartItems([]));
      }

      // Mark cart as initialized even if there was an error
      dispatch(setIsInitialized(true));
    }

    console.groupEnd();
  }
};

export default cartSync; 