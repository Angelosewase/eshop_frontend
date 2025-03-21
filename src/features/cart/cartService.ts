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
        console.log("Preparing API request with:", {
          productSkuId,
          quantity,
          endpoint: "cart/add",
          method: "POST",
        });

        try {
          const result = await dispatch(
            cartApi.endpoints.addToCart.initiate({
              productSkuId,
              quantity,
            }),
          );

          console.log("API Response:", {
            success: result.data ? "Yes" : "No",
            status: result.status,
            data: result.data,
            error: result.error,
          });

          if (!result.data) {
            console.error("❌ API call failed or returned no data");
            throw new Error("Failed to add item to cart via API");
          }
        } catch (apiError) {
          console.error("❌ API call error:", apiError);
          throw apiError;
        } finally {
          console.groupEnd(); // End API call group
        }
      } else {
        console.log("🔒 User not authenticated - Adding to local cart only");

        // Get current state
        const state = getState();

        // Try to get product details from various sources
        let productDetails: any = null;

        // 1. Try to get from Redux state
        if (state.productApi?.queries) {
          const productQuery = Object.values(state.productApi.queries).find(
            (query: any) => query?.data?.id === productId
          );
          if (productQuery?.data) {
            console.log("Found product in Redux state");
            productDetails = productQuery.data;
          }
        }
        else {
          console.log("Using minimal product information");

          productDetails = {
            id: productId,
            name: `Product ${productId}`,
            price: 0,
            images: [],
          };

          // Try to extract more information from the DOM if available
          try {
            const nameElement = document.querySelector(
              `[data-product-id="${productId}"] .product-name, h1.product-title`,
            );
            if (nameElement) {
              productDetails.name =
                nameElement.textContent || productDetails.name;
            }

            const priceElement = document.querySelector(
              `[data-product-id="${productId}"] .product-price`,
            );
            if (priceElement) {
              const priceAttr = priceElement.getAttribute("data-price");
              const priceText = priceElement.textContent;

              if (priceAttr) {
                productDetails.price = parseInt(priceAttr);
              } else if (priceText) {
                // Try to extract price from text (e.g., "$10.99")
                const priceMatch = priceText?.match(/\d+(\.\d+)?/);
                if (priceMatch) {
                  productDetails.price = parseFloat(priceMatch[0]) * 100; // Convert to cents
                }
              }
            }

            const imageElement = document.querySelector(
              `[data-product-id="${productId}"] img`,
            );
            if (imageElement) {
              const src = imageElement.getAttribute("src");
              if (src) {
                productDetails.images = [src];
              }
            }
          } catch (error) {
            console.warn("Error extracting product details from DOM:", error);
          }
        }

        // Create cart item
        const cartItem: CartItem = {
          id: productId,
          cartId: 0, // temporary ID for local cart
          productId: productId,
          productsSkuId: productSkuId,
          quantity,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        console.log("Adding item to local cart:", cartItem);
        dispatch(addToLocalCart(cartItem));

        console.log("✅ Item added to local cart successfully");
      }
    } catch (error) {
      console.error("❌ Error in addToCart:", error);
      throw error;
    } finally {
      console.groupEnd(); // End main group
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
        console.log(
          "🔍 Removing item from cart via API for authenticated user",
        );

        const result = await dispatch(
          cartApi.endpoints.removeFromCart.initiate(itemId),
        );

        console.log("API removeCartItem result:", result);

        if (!result.data) {
          console.warn("⚠️ API returned no data for removeCartItem");
        }

        // Check if this was the last item in the cart
        const state = getState();
        if (
          state.cart?.items.length === 1 &&
          state.cart.items[0].id === itemId
        ) {
          console.log("🗑️ Last item removed, cart will be deleted");
        }
      } else {
        console.log("🔍 Removing item from cart locally for guest user");

        // For local cart, we need to find the cart item with this ID
        const state = getState();
        const cartItem = state.cart?.items.find(
          (item: CartItem) => item.id === itemId,
        );

        if (cartItem) {
          dispatch(removeFromLocalCart({ id: itemId }));
          console.log("✅ Item removed from local cart successfully");

          // Check if this was the last item in the cart
          if (state.cart?.items.length === 1) {
            console.log("🗑️ Last item removed, cart will be deleted");
          }
        } else {
          console.warn("⚠️ Item not found in local cart:", itemId);
        }
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
            body: { quantity },
          }),
        );

        console.log("API updateCartItem result:", result);

        if (!result.data) {
          console.warn("⚠️ API returned no data for updateCartItem");
        }
      } else {
        console.log("🔍 Updating item quantity locally for guest user");

        // For local cart, we need to find the cart item with this ID
        const state = getState();
        const cartItem = state.cart?.items.find(
          (item: CartItem) => item.id === itemId,
        );

        if (cartItem) {
          dispatch(updateLocalQuantity({ id: itemId, quantity }));
          console.log("✅ Item quantity updated in local cart successfully");
        } else {
          console.warn("⚠️ Item not found in local cart:", itemId);
        }
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

        const result = await dispatch(
          cartApi.endpoints.clearCart.initiate(),
        );

        console.log("API clearCart result:", result);
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

export default new CartService();
