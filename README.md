# E-Shop Frontend

A modern e-commerce frontend application built with React, Redux Toolkit, and TypeScript.

## Cart Implementation with Database Integration

The cart system has been implemented with both local storage and database integration to provide a seamless shopping experience for both guest and authenticated users.

### Architecture

The cart system consists of the following components:

1. **Cart API Slice (`cartApiSlice.ts`)**
   - Handles all API interactions for cart operations
   - Provides endpoints for fetching, adding, updating, removing cart items, and syncing carts
   - Uses Redux Toolkit's `createApi` for efficient API management

2. **Cart Slice (`cartSlice.ts`)**
   - Manages the local cart state in Redux
   - Handles persistence to local storage for guest users
   - Integrates with the Cart API Slice for authenticated users
   - Provides selectors for accessing cart data throughout the application

3. **Cart Service (`cartService.ts`)**
   - Provides a unified interface for cart operations
   - Determines whether to use local storage or API based on authentication status
   - Handles cart initialization, adding/removing items, updating quantities, and syncing

4. **Store Access Layer (`storeAccess.ts`)**
   - Provides a way to access the Redux store without creating circular dependencies
   - Implements functions like `getState()`, `dispatch()`, and `isAuthenticated()`
   - Helps break circular dependencies between modules

5. **Cart Sync Utility (`cartSync.ts`)**
   - Handles synchronization of cart data between local storage and the server
   - Provides methods for initializing the cart and syncing after login
   - Separated to avoid circular dependencies

### Key Features

- **Persistent Cart for Guest Users**: Cart items are saved to local storage, ensuring they persist across sessions
- **Seamless Cart Syncing**: When a guest user logs in, their local cart is automatically synced with their account
- **Real-time Cart Updates**: Cart changes are immediately reflected in the UI
- **Optimistic Updates**: UI updates immediately while API requests happen in the background
- **Error Handling**: Robust error handling for API failures
- **Circular Dependency Prevention**: Carefully structured to avoid circular dependencies between modules

### Components Using Cart Service

The following components have been updated to use the Cart Service:

1. **Cart Component**: Displays cart items and provides controls for updating quantities and removing items
2. **ProductDetails Component**: Allows adding products to the cart
3. **Checkout Component**: Processes the cart for order placement

### Usage

To use the cart service in a component:

```typescript
import CartService from "../../features/cart/cartService";

// Initialize cart (typically in a useEffect)
useEffect(() => {
  CartService.initializeCart();
}, []);

// Add an item to cart
await CartService.addToCart({
  id: productId,
  name: productName,
  image: productImage,
  price: productPrice,
  quantity: quantity
});

// Remove an item from cart
await CartService.removeFromCart(itemId);

// Update item quantity
await CartService.updateQuantity(itemId, newQuantity);

// Clear the cart
await CartService.clearCart();

// Sync cart after login (called automatically in auth slice)
await CartService.syncCartAfterLogin();
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Start the development server:
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_API_BASE_URL=http://localhost:3000/
REACT_APP_API_BASE_URL=http://localhost:3000/
```

The application supports both Vite and Create React App environment variable formats.

## License

This project is licensed under the MIT License.
