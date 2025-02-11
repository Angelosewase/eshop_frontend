import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AdminLayout, WebLayout } from "./components/custom/layouts";
import {
  Customers,
  Home,
  Inventory,
  Notifications,
  Orders,
  Payments,
  Settings,
  Support,
} from "./pages/admin";
import {
  Home as WebHome,
  Contact,
  Cart,
  Deals,
  Orders as OrdersWeb,
  ProductDetails,
  Products,
} from "./pages/web";

import { NotfoundPage } from "./pages";

const routes = createBrowserRouter([
  { path: "*", element: <NotfoundPage /> },
  {
    path: "/admin",
    element: <AdminLayout />,
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
      {
        path: "/",
        element: <WebHome />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/Orders",
        element: <OrdersWeb />,
      },
      {
        path: "/Deals",
        element: <Deals />,
      },
      {
        path: "/product",
        element: <ProductDetails />,
      },
      {
        path: "/products",
        element: <Products />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={routes} />;
}

export default App;
