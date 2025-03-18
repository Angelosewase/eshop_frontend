import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../store';
import { selectAuth } from '../auth/authSlice';
import errorHandler, { ErrorCategory } from '../../utils/errorHandler';

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  productsSkuId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    description: string;
    cover: string;
  };
  productSku: {
    id: number;
    price: string | number;
    quantity: number;
  };
}

export interface CartResponse {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface AddToCartRequest {
  productId: number;
  productSkuId: number;
  quantity?: number;
}

export interface UpdateCartItemRequest {
  itemId: number;
  quantity: number;
}

export interface RemoveCartItemRequest {
  itemId: number;
}

const getApiBaseUrl = () => import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Log API request details
const logApiRequest = (endpoint: string, method: string, url: string, body?: any) => {
  console.group(`🚀 API Request: ${endpoint} (${method})`);
  console.log(`URL: ${url}`);
  if (body) {
    console.log('Request Body:', body);
  }
  console.log('Timestamp:', new Date().toISOString());
  console.groupEnd();
};

// Helper function to check if response indicates no cart exists
const isNoCartResponse = (response: any): boolean => {
  if (!response) return false;

  // Check for specific error messages in different response formats
  if (response.message === 'Cart not found' ||
    response.message === 'No cart found' ||
    response.message === 'No cart exists') {
    return true;
  }

  if (response.data && (
    response.data.message === 'Cart not found' ||
    response.data.message === 'No cart exists' ||
    response.data.message === 'No cart found')) {
    return true;
  }

  // Check for error status
  if (response.status === 404 || (response.data && response.data.status === 404)) {
    const errorMsg = response.error || (response.data && response.data.error) || '';
    if (errorMsg.includes('cart') || errorMsg.includes('Cart')) {
      return true;
    }
  }

  // Check for empty cart indicators
  if (response.items && Array.isArray(response.items) && response.items.length === 0) {
    return true;
  }

  if (response.data && response.data.items &&
    Array.isArray(response.data.items) &&
    response.data.items.length === 0) {
    return true;
  }

  return false;
};

// Helper function to log API responses with detailed checks
const logApiResponse = (endpoint: string, response: any) => {
  console.group(`📥 API Response: ${endpoint}`);
  console.log('Raw response:', response);

  // Check for null/undefined
  if (response === null) {
    console.warn('⚠️ Response is null');
  } else if (response === undefined) {
    console.warn('⚠️ Response is undefined');
  }
  // Check for empty objects/arrays
  else if (typeof response === 'object') {
    if (Array.isArray(response)) {
      if (response.length === 0) {
        console.log('ℹ️ Response is an empty array');
      }
    } else if (Object.keys(response).length === 0) {
      console.log('ℹ️ Response is an empty object');
    }

    // Check if it's a "no cart" response
    if (isNoCartResponse(response)) {
      console.log('ℹ️ Response indicates no cart exists yet');
    }
  }

  console.log('Response structure:', JSON.stringify(response, null, 2));
  console.groupEnd();
  return response;
};

// Custom error handler for API responses
const handleApiError = async (args: any, api: any, extraOptions: any) => {
  const result = await api(args, extraOptions);

  if (result.error) {
    // Log the error but don't show toast - the component will handle user feedback
    errorHandler.handleApiError(
      result.error,
      'cartApiSlice',
      args.endpointName || 'unknown',
      { args },
      false
    );
  }

  return result;
};

export const cartApiSlice = createApi({
  reducerPath: 'cartApi',
  tagTypes: ['Cart'],
  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const { accessToken } = selectAuth(getState() as RootState);

      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getCart: builder.query<CartResponse, void>({
      query: () => ({
        url: '/cart/',
        method: 'GET',
      }),
      transformResponse: (response: any) => {
        console.log('🔄 Transforming getCart response:', response);

        const cartData = response.data || response;
        const items = cartData.items || [];

        // Calculate total by properly parsing prices
        const total = items.reduce((sum: number, item: CartItem) => {
          const price = item.productSku?.price ? Number(item.productSku.price) : 0;
          return sum + (price * item.quantity);
        }, 0);

        // Transform the items to ensure proper type casting
        const transformedItems = items.map((item: CartItem) => ({
          ...item,
          productSku: {
            ...item.productSku,
            price: item.productSku?.price ? Number(item.productSku.price) : 0
          }
        }));

        console.log('Transformed cart data:', {
          items: transformedItems,
          total,
          itemCount: items.length
        });

        return {
          items: transformedItems,
          total: total,
          itemCount: items.length
        };
      },
      transformErrorResponse: (error: { status: number; data: any }) => {
        console.error('❌ getCart error:', {
          status: error.status,
          data: error.data,
          timestamp: new Date().toISOString(),
        });
        return error;
      },
      providesTags: ['Cart'],
    }),

    addItemToCart: builder.mutation<CartResponse, AddToCartRequest>({
      query: ({ productId, quantity, productSkuId }) => ({
        url: '/cart/add',
        method: 'POST',
        body: { productId, quantity, productSkuId },
      }),
      transformResponse: (response: any) => {
        console.log('🔄 Transforming addItemToCart response', {
          raw: response,
          timestamp: new Date().toISOString(),
        });

        if (!response || !response.success) {
          throw new Error(response?.message || 'Failed to add item to cart');
        }

        const cartData = response.data;
        const price = parseFloat(String(cartData.productSku.price)) || 0;

        return {
          items: [{
            ...cartData,
            productSku: {
              ...cartData.productSku,
              price: price
            }
          }],
          total: price * cartData.quantity,
          itemCount: 1,
        };
      },
      transformErrorResponse: (error: { status: number; data: any }) => {
        console.error('❌ addItemToCart error:', {
          status: error.status,
          data: error.data,
          timestamp: new Date().toISOString(),
        });
        return error;
      },
      invalidatesTags: ['Cart'],
    }),

    // Update cart item quantity
    updateCartItem: builder.mutation<CartResponse, UpdateCartItemRequest>({
      query: (data) => {
        console.group('🔄 Update Cart Item Request');
        console.log('API Base URL:', getApiBaseUrl());
        console.log('Item ID:', data.itemId);
        console.log('New Quantity:', data.quantity);

        const requestBody = {
          quantity: data.quantity
        };

        console.log('Full Request URL:', `${getApiBaseUrl()}cart/update/${data.itemId}`);
        console.log('Request Body:', JSON.stringify(requestBody, null, 2));
        console.groupEnd();

        return {
          url: `cart/update/${data.itemId}`,
          method: 'PUT',
          body: requestBody,
        };
      },
      invalidatesTags: ['Cart'],
      // Add onQueryStarted to log the full request lifecycle
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        console.group('🔄 Update Cart Item Operation');
        console.log('Starting update operation with:', arg);

        try {
          const { data } = await queryFulfilled;
          console.log('✅ Update cart item successful');
          console.log('Response data:', JSON.stringify(data, null, 2));
          console.log('Updated item quantity:', arg.quantity);
          console.log('Operation timestamp:', new Date().toISOString());
        } catch (error) {
          console.error('❌ Update cart item failed');
          console.error('Error details:', error);
          console.error('Request data that failed:', arg);
          console.error('Timestamp:', new Date().toISOString());
        }

        console.groupEnd();
      },
      transformResponse: (response: any) => {
        console.group('🔄 Transforming updateCartItem response');
        console.log('Raw response from backend:', response);

        // Log the exact structure of the response
        console.log('Response structure:', JSON.stringify(response, null, 2));

        if (!response) {
          console.warn('⚠️ updateCartItem response is null or undefined');
          console.groupEnd();
          return { items: [], total: 0, itemCount: 0 };
        }

        // Check if the backend returns an error about no cart
        if (isNoCartResponse(response)) {
          console.warn('⚠️ Backend indicates no cart exists when trying to update item');
          console.groupEnd();
          return { items: [], total: 0, itemCount: 0 };
        }

        // Extract data from the response according to the backend format
        // If the response is in the format { success: true, data: {...} }
        if (response.success && response.data) {
          console.log('Response has success and data properties');

          // If data contains a single item (from add/update operations)
          if (response.data.product) {
            console.log('Response data contains a single cart item');
            // Create a cart-like structure with this single item
            return {
              items: [response.data],
              total: response.data.productSku ? parseFloat(response.data.productSku.price) * response.data.quantity : 0,
              itemCount: 1
            };
          }

          // If data contains the entire cart
          if (response.data.items) {
            console.log('Response data contains the entire cart');
            return {
              items: response.data.items || [],
              total: response.data.total || 0,
              itemCount: response.data.items ? response.data.items.length : 0
            };
          }
        }

        // Fallback to previous extraction methods
        let items = [];
        if (Array.isArray(response)) {
          console.log('Response is an array, using directly');
          items = response;
        } else if (response.items && Array.isArray(response.items)) {
          console.log('Found items array in response.items');
          items = response.items;
        } else if (response.data && Array.isArray(response.data)) {
          console.log('Found items array in response.data');
          items = response.data;
        } else if (response.data && response.data.items && Array.isArray(response.data.items)) {
          console.log('Found items array in response.data.items');
          items = response.data.items;
        }

        const result = {
          items: items,
          total: response.total || (response.data && response.data.total) || 0,
          itemCount: response.itemCount || (response.data && response.data.itemCount) || items.length
        };

        console.log('✅ Transformed updateCartItem result:', result);
        console.groupEnd();
        return result;
      }
    }),

    // Remove item from cart
    removeCartItem: builder.mutation<CartResponse, RemoveCartItemRequest>({
      query: (data) => {
        console.group('🗑️ Remove Cart Item Request');
        console.log('API Base URL:', getApiBaseUrl());
        console.log('Item ID to remove:', data.itemId);
        console.log('Full Request URL:', `${getApiBaseUrl()}cart/remove/${data.itemId}`);
        console.log('Request timestamp:', new Date().toISOString());
        console.groupEnd();

        return {
          url: `cart/remove/${data.itemId}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['Cart'],
      // Add onQueryStarted to log the full request lifecycle
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        console.group('🔄 Remove Cart Item Operation');
        console.log('Starting remove operation with item ID:', arg.itemId);

        try {
          const { data } = await queryFulfilled;
          console.log('✅ Remove cart item successful');
          console.log('Response data:', JSON.stringify(data, null, 2));
          console.log('Remaining items count:', data.items?.length || 0);
          console.log('Operation timestamp:', new Date().toISOString());
        } catch (error) {
          console.error('❌ Remove cart item failed');
          console.error('Error details:', error);
          console.error('Request data that failed:', arg);
          console.error('Timestamp:', new Date().toISOString());
        }

        console.groupEnd();
      },
      transformResponse: (response: any) => {
        console.group('🔄 Transforming removeCartItem response');
        console.log('Raw response from backend:', response);

        // Log the exact structure of the response
        console.log('Response structure:', JSON.stringify(response, null, 2));

        if (!response) {
          console.warn('⚠️ removeCartItem response is null or undefined');
          console.groupEnd();
          return { items: [], total: 0, itemCount: 0 };
        }

        // Check if the backend returns an error about no cart
        if (isNoCartResponse(response)) {
          console.warn('⚠️ Backend indicates no cart exists when trying to remove item');
          console.groupEnd();
          return { items: [], total: 0, itemCount: 0 };
        }

        // If the response is just a success message without cart data
        if (response.success && response.message && !response.data) {
          console.log('Response is a success message without cart data');
          // Return an empty cart - the component should refetch the cart
          return { items: [], total: 0, itemCount: 0 };
        }

        // Extract data from the response according to the backend format
        if (response.success && response.data) {
          console.log('Response has success and data properties');

          // If data contains the entire cart
          if (response.data.items) {
            console.log('Response data contains the entire cart');
            return {
              items: response.data.items || [],
              total: response.data.total || 0,
              itemCount: response.data.items ? response.data.items.length : 0
            };
          }
        }

        // Fallback to previous extraction methods
        let items = [];
        if (Array.isArray(response)) {
          console.log('Response is an array, using directly');
          items = response;
        } else if (response.items && Array.isArray(response.items)) {
          console.log('Found items array in response.items');
          items = response.items;
        } else if (response.data && Array.isArray(response.data)) {
          console.log('Found items array in response.data');
          items = response.data;
        } else if (response.data && response.data.items && Array.isArray(response.data.items)) {
          console.log('Found items array in response.data.items');
          items = response.data.items;
        }

        const result = {
          items: items,
          total: response.total || (response.data && response.data.total) || 0,
          itemCount: response.itemCount || (response.data && response.data.itemCount) || items.length
        };

        console.log('✅ Transformed removeCartItem result:', result);
        console.groupEnd();
        return result;
      }
    }),

    // Clear cart
    clearCart: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => {
        console.log('🔍 Initiating clearCart request');
        return {
          url: 'cart/clear',
          method: 'DELETE',
        };
      },
      invalidatesTags: ['Cart'],
      transformResponse: (response: any) => {
        console.group('🔄 Transforming clearCart response');
        console.log('Raw response from backend:', response);

        if (!response) {
          console.warn('⚠️ clearCart response is null or undefined');
          console.groupEnd();
          return { success: true, message: 'Cart cleared successfully' };
        }

        // Check if the backend returns an error about no cart
        if (isNoCartResponse(response)) {
          console.log('ℹ️ Backend indicates no cart exists when trying to clear cart');
          console.groupEnd();
          return { success: true, message: 'No cart to clear' };
        }

        // If the response is in the expected format
        if (response.success !== undefined) {
          const result = {
            success: response.success,
            message: response.message || 'Cart cleared successfully'
          };
          console.log('✅ Transformed clearCart result:', result);
          console.groupEnd();
          return result;
        }

        // Fallback
        const result = {
          success: true,
          message: response.message || 'Cart cleared successfully'
        };
        console.log('✅ Transformed clearCart result (fallback):', result);
        console.groupEnd();
        return result;
      }
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddItemToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} = cartApiSlice; 