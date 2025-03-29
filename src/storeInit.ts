/**
 * This file ensures that the store is properly initialized before the app starts.
 * Import this file at the entry point of your application.
 */

// Import the store to ensure it's initialized
import store from "./store/store";
import { setStore } from "./features/cart/storeAccess";

// Initialize the store access
try {
  setStore(store);
  console.log("Store successfully initialized and set in storeAccess");
} catch (error) {
  console.error("Failed to initialize store:", error);
}

// Export a function to verify the store is initialized
export function verifyStoreInitialized() {
  try {
    if (!store) {
      console.error("Store initialization failed");
      return false;
    }
    console.log("Store initialization verified");
    return true;
  } catch (error) {
    console.error("Error verifying store initialization:", error);
    return false;
  }
}

export default verifyStoreInitialized;
