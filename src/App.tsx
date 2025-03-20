import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AdminLayout, WebLayout } from "./components/custom/layouts";
import { ProtectedRoute } from "./components/custom/ProtectedRoute";
import {
  Customers,
  Home,
  Inventory,
  Notifications,
  Orders,
  Payments,
  Settings,
  Support,
  NewProduct,
  Products,
} from "./pages/admin";
import {
  Home as WebHome,
  Contact,
  Cart,
  Deals,
  Orders as WebOrders,
  ProductDetails,
  Explore,
  CheckOut,
  Profile,
  OrderConfirmation,
  PaymentMethods,
} from "./pages/web";

import { NotfoundPage } from "./pages";
import { AuthLayout, Login, SignUp } from "./pages/auth";
import { useEffect, useState } from "react";
import cartSync from "./features/cart/cartSync";
import errorHandler from "./utils/errorHandler";

const routes = createBrowserRouter([
  { path: "*", element: <NotfoundPage /> },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "/auth/login", element: <Login /> },
      { path: "/auth/signup", element: <SignUp /> },
    ]
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/admin/",
        element: <Home />,
      },
      {
        path: "/admin/customers",
        element: <Customers />,
      },
      {
        path: "/admin/orders",
        element: <Orders />,
      },
      {
        path: "/admin/inventory",
        element: <Inventory />,
      },
      {
        path: "/admin/products",
        element: <Products />,
      },
      {
        path: "/admin/products/new",
        element: <NewProduct />,
      },
      {
        path: "/admin/support",
        element: <Support />,
      },
      {
        path: "/admin/settings",
        element: <Settings />,
      },
      {
        path: "/admin/notifications",
        element: <Notifications />,
      },
      {
        path: "/admin/payments",
        element: <Payments />,
      },
    ],
  },
  {
    path: "/",
    element: <WebLayout />,
    children: [
      { path: "", element: <WebHome /> },
      { path: "explore", element: <Explore /> },
      { path: "product/:id", element: <ProductDetails /> },
      { path: "cart", element: <Cart /> },
      { path: "deals", element: <Deals /> },
      { path: "orders", element: <WebOrders /> },
      { path: "contact", element: <Contact /> },
      { path: "profile", element: <Profile /> },
      { path: "checkout", element: <CheckOut /> },
      { path: "order-confirmation", element: <OrderConfirmation /> },
      { path: "payment-methods", element: <PaymentMethods /> },
    ],
  },
  {
    path: "/profile",
    element: <Profile />,
  }
]);

function App() {
  const [initError, setInitError] = useState<Error | null>(null);

  useEffect(() => {
    const checkExistingCart = async () => {
      try {
        const storedCart = localStorage.getItem('cart');
        const hasLocalItems = storedCart && JSON.parse(storedCart).length > 0;

        if (hasLocalItems) {
          await cartSync.initializeCart();
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error checking cart');
        setInitError(err);
        errorHandler.handleCartError(
          error,
          'checkExistingCart',
          null,
          true
        );
      }
    };

    checkExistingCart();
  }, []);

  if (initError) {
    errorHandler.handleCartError(
      'Application continuing with cart initialization error: ' + initError.message,
      'App.useEffect',
      null,
      false
    );
  }

  return <RouterProvider router={routes} />;
}

export default App;
