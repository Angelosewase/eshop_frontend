/**
 * This file provides a way to access the Redux store without creating circular dependencies.
 * Instead of importing the store directly, we'll set it later after it's fully initialized.
 */

import { Store } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";

// Store instance
let store: Store | null = null;

/**
 * Set the Redux store instance
 */
export const setStore = (storeInstance: Store): void => {
  console.log("🔄 Setting Redux store instance");
  store = storeInstance;
  console.log("✅ Redux store instance set successfully");
};

/**
 * Get the Redux store instance
 * @throws Error if store is not initialized
 */
export const getStore = (): Store => {
  if (!store) {
    console.error("❌ Redux store accessed before initialization");
    throw new Error("Store not initialized. Call setStore first.");
  }
  return store;
};

/**
 * Get the current Redux state
 * @returns The current Redux state
 * @throws Error if store is not initialized
 */
export const getState = (): RootState => {
  console.group("🔍 getState");

  try {
    console.log("Accessing Redux store state");
    const state = getStore().getState();
    console.log("✅ Successfully retrieved Redux state");
    console.groupEnd();
    return state;
  } catch (error) {
    console.error("❌ Error accessing Redux state:", error);
    console.groupEnd();
    throw error;
  }
};

/**
 * Dispatch an action to the Redux store
 * @param action The action to dispatch
 * @returns The result of the dispatch
 * @throws Error if store is not initialized
 */
export const dispatch = (action: any): any => {
  console.group("🔄 dispatch");

  try {
    const actionType =
      action.type || (action.payload && action.payload.type) || "unknown";
    console.log(`Dispatching action: ${actionType}`);

    const result = getStore().dispatch(action);
    console.log("✅ Action dispatched successfully");
    console.groupEnd();
    return result;
  } catch (error) {
    console.error("❌ Error dispatching action:", error);
    console.groupEnd();
    throw error;
  }
};

/**
 * Check if the user is authenticated
 * @returns true if the user is authenticated, false otherwise
 */
export const isAuthenticated = () => {
  console.group("🔐 Checking Authentication Status");

  try {
    const state = getState();
    console.log("Full auth state:", state.auth);

    // Log all potential auth indicators
    console.log("Auth state details:", {
      token: state.auth?.token ? "Present" : "Missing",
      user: state.auth?.user ? "Present" : "Missing",
      isAuthenticated: state.auth?.isAuthenticated,
      loading: state.auth?.loading
    });

    const authenticated = state.auth?.isAuthenticated || false;
    console.log("Final authentication result:", authenticated);
    console.groupEnd();
    return authenticated;
  } catch (error) {
    console.error("❌ Error checking authentication:", error);
    console.groupEnd();
    return false;
  }
};
