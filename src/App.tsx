import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AdminLayout } from "./components/custom/layouts";
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
import { NotfoundPage } from "./pages";

const routes = createBrowserRouter([
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
  { path: "*", element: <NotfoundPage /> },
]);

function App() {
  return <RouterProvider router={routes} />;
}

export default App;
