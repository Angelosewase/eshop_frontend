import { getState, dispatch, isAuthenticated } from "./storeAccess";
import {
  addToCart as addToLocalCart,
  removeFromCart as removeFromLocalCart,
  updateQuantity as updateLocalQuantity,
  clearCart as clearLocalCart,
} from "./cartSlice";
import { CartItem } from "../../lib/types";
import { cartApi } from "./cartApiSlice";
import cartSync from "./cartSync";

class CartService {
  constructor() { }

  /**
   * Initialize the cart based on authentication status
   * Only fetches the cart, doesn't create an empty one
   */
  async initializeCart(): Promise<void> {
    console.group("🔄 CartService.initializeCart");
    console.log("Initializing cart");

    try {
      await cartSync.initializeCart();
      console.log("✅ Cart initialized successfully");
    } catch (error) {
      console.error("❌ Error initializing cart:", error);
    }

    console.groupEnd();
  }

  /**
   * Add an item to the cart
   * For authenticated users: Uses API
   * For guest users: Uses Redux store and localStorage
   *
   * This will create a cart if one doesn't exist yet
   */
  async addToCart(
    productId: number,
    quantity: number = 1,
    productSkuId: number,
  ): Promise<void> {
    console.group("🛒 CartService.addToCart");
    console.log("Adding to cart:", { productId, quantity, productSkuId });

    try {
      const authenticated = isAuthenticated();
      console.log("Authentication check result:", authenticated);

      if (authenticated) {
        console.group("📡 Making API Call to Add to Cart");
        const payload = {
          productId,
          productSkuId,
          quantity
        };
        console.log("Preparing API request payload:", payload);

        const result = await dispatch(
          cartApi.endpoints.addToCart.initiate(payload)
        );

        console.log("API Response:", result);

        if (!result.data) {
          console.error("❌ API call failed:", result.error);
          throw new Error(result.error?.data?.message || "Failed to add item to cart");
        }

        console.log("✅ Item added to cart successfully");
        console.groupEnd();
      } else {
        console.log("🔒 User not authenticated - Adding to local cart only");

        const state = getState();
        let productDetails: any = null;

        if (state.productApi?.queries) {
          const productQuery = Object.values(state.productApi.queries).find(
            (query: any) => query?.data?.id === productId
          );
          if (productQuery?.data) {
            console.log("Found product in Redux state");
            productDetails = productQuery.data;
          }
        }

        const cartItem: CartItem = {
          id: Date.now(), // temporary ID for local cart
          cartId: 0,
          productId,
          productsSkuId: productSkuId,
          quantity,
          createdAt: new Date(),
          updatedAt: new Date(),
          productSku: {
            id: productSkuId,
            productId,
            sizeAttributeId: 0, // Default value since we don't have this info for local cart
            colorAttributeId: 0, // Default value since we don't have this info for local cart
            sku: `SKU-${productId}-${productSkuId}`, // Generate a temporary SKU
            price: productDetails?.price?.toString() || "0",
            quantity: productDetails?.quantity || 0,
            createdAt: new Date(),
          }
        };

        console.log("Adding item to local cart:", cartItem);
        dispatch(addToLocalCart(cartItem));
        console.log("✅ Item added to local cart successfully");
      }
    } catch (error) {
      console.error("❌ Error in addToCart:", error);
      throw error;
    } finally {
      console.groupEnd();
    }
  }

  /**
   * Remove an item from the cart
   * For authenticated users: Uses API
   * For guest users: Uses Redux store and localStorage
   *
   * If this is the last item, the cart will be deleted
   */
  async removeFromCart(itemId: number): Promise<void> {
    console.group("🔄 CartService.removeFromCart");
    console.log("Removing from cart, itemId:", itemId);

    try {
      const authenticated = isAuthenticated();
      console.log("User authenticated:", authenticated);

      if (authenticated) {
        console.log("🔍 Removing item from cart via API for authenticated user");
        const result = await dispatch(
          cartApi.endpoints.removeFromCart.initiate(itemId)
        );

        if (!result.data) {
          throw new Error("Failed to remove item from cart");
        }

        console.log("✅ Item removed successfully");
      } else {
        console.log("🔍 Removing item from cart locally for guest user");
        dispatch(removeFromLocalCart({ id: itemId }));
        console.log("✅ Item removed from local cart successfully");
      }
    } catch (error) {
      console.error("❌ Error removing item from cart:", error);
      throw error;
    }

    console.groupEnd();
  }

  /**
   * Update item quantity in the cart
   * For authenticated users: Uses API
   * For guest users: Uses Redux store and localStorage
   */
  async updateQuantity(itemId: number, quantity: number): Promise<void> {
    console.group("🔄 CartService.updateQuantity");
    console.log("Updating quantity:", { itemId, quantity });

    try {
      const authenticated = isAuthenticated();
      console.log("User authenticated:", authenticated);

      if (authenticated) {
        console.log("🔍 Updating item quantity via API for authenticated user");
        const result = await dispatch(
          cartApi.endpoints.updateCartItem.initiate({
            itemId,
            body: { quantity }
          })
        );

        if (!result.data) {
          throw new Error("Failed to update item quantity");
        }

        console.log("✅ Quantity updated successfully");
      } else {
        console.log("🔍 Updating item quantity locally for guest user");
        dispatch(updateLocalQuantity({ id: itemId, quantity }));
        console.log("✅ Item quantity updated in local cart successfully");
      }
    } catch (error) {
      console.error("❌ Error updating item quantity:", error);
      throw error;
    }

    console.groupEnd();
  }

  /**
   * Clear the cart
   * For authenticated users: Uses API
   * For guest users: Uses Redux store and localStorage
   *
   * This will delete the cart completely
   */
  async clearCart(): Promise<void> {
    console.group("🔄 CartService.clearCart");
    console.log("Clearing cart");

    try {
      const authenticated = isAuthenticated();
      console.log("User authenticated:", authenticated);

      if (authenticated) {
        console.log("🔍 Clearing cart via API for authenticated user");
        await dispatch(cartApi.endpoints.clearCart.initiate());
        console.log("✅ Cart cleared successfully");
      } else {
        console.log("🔍 Clearing cart locally for guest user");
        dispatch(clearLocalCart());
        console.log("✅ Local cart cleared successfully");
      }
    } catch (error) {
      console.error("❌ Error clearing cart:", error);
      throw error;
    }

    console.groupEnd();
  }

  /**
   * Sync cart after login
   * Merges local cart with server cart
   */
  async syncCartAfterLogin(): Promise<void> {
    console.group("🔄 CartService.syncCartAfterLogin");
    console.log("Syncing cart after login");

    try {
      await cartSync.syncCartAfterLogin();
      console.log("✅ Cart synced successfully after login");
    } catch (error) {
      console.error("❌ Error syncing cart after login:", error);
    }

    console.groupEnd();
  }
}

const cartService = new CartService();
export default cartService;
