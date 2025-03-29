import React, { useState, useEffect, useMemo } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import {
  CustomersIcon,
  DashboardIcon,
  HelpsupportIcon,
  InventoryIcon,
  NotificationIcon,
  OrdersIcon,
  PaymentsIcon,
  SettingsIcon,
} from "../icons";
import { NavLink, ContactDevCard } from "..";
import { useValidatePath } from "../../../hooks/auth";
import {
  ChevronLeft,
  ChevronRight,
  Package,
  ShoppingBag,
  LogOut,
  BarChart3,
} from "lucide-react";
import { cn } from "../../../lib/utils";
import { useAppSelector, useAppDispatch } from "../../../hooks/Reduxhooks";
import { logOut } from "../../../features/auth/authSlice";
import { toast } from "sonner";
import { useGetOrdersQuery } from "../../../features/orders/ordersSlice";
import { useGetNotificationsQuery } from "../../../features/notifications/notificationSlice";
import { useGetProductsQuery } from "../../../features/inventory/productSlice";
import { useGetDashboardStatsQuery } from "../../../features/dashboard/dashboardSlice";

function AdminLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  useValidatePath();

  // Fetch data for badges
  const { data: ordersData } = useGetOrdersQuery();
  const { data: notificationsData } = useGetNotificationsQuery();
  const { data: productsData } = useGetProductsQuery({ limit: 10 });
  const { data: dashboardStats } = useGetDashboardStatsQuery();

  // Calculate badge counts
  const pendingOrdersCount = useMemo(() => {
    if (!ordersData?.orders) return 0;
    return ordersData.orders.filter(
      (order) => order.payment?.status === "pending",
    ).length;
  }, [ordersData]);

  const unreadNotificationsCount = useMemo(() => {
    if (!notificationsData?.data) return 0;
    return notificationsData.data.filter((notification) => !notification.isRead)
      .length;
  }, [notificationsData]);

  const newProductsCount = useMemo(() => {
    // For products, we'll consider the 2 most recent products as "new"
    if (!productsData?.products) return 0;
    return Math.min(productsData.products.length, 2);
  }, [productsData]);

  // Create dynamic navigation items with badge counts
  const mainNavItems = useMemo(
    () => [
      {
        name: "Dashboard",
        icon: <DashboardIcon />,
        to: "/admin",
        badge: null,
      },
      {
        name: "Orders",
        icon: <OrdersIcon />,
        to: "/admin/orders",
        badge:
          pendingOrdersCount > 0
            ? { count: pendingOrdersCount, color: "bg-blue-500" }
            : null,
      },
      {
        name: "Inventory",
        icon: <InventoryIcon />,
        to: "/admin/inventory",
        badge: null,
      },
      {
        name: "Products",
        icon: <Package size={24} />,
        to: "/admin/products",
        badge:
          newProductsCount > 0
            ? { count: newProductsCount, color: "bg-green-500" }
            : null,
      },
      {
        name: "Payments",
        icon: <PaymentsIcon />,
        to: "/admin/payments",
        badge: null,
      },
      {
        name: "Customers",
        icon: <CustomersIcon />,
        to: "/admin/customers",
        badge:
          (dashboardStats?.totalCustomers ?? 0) > 0
            ? { count: dashboardStats?.totalCustomers ?? 0, color: "bg-purple-500" }
            : null,
      },
    ],
    [pendingOrdersCount, newProductsCount, dashboardStats],
  );

  const secondaryNavItems = useMemo(
    () => [
      {
        name: "Notifications",
        icon: <NotificationIcon />,
        to: "/admin/notifications",
        badge:
          unreadNotificationsCount > 0
            ? { count: unreadNotificationsCount, color: "bg-red-500" }
            : null,
      },
      {
        name: "Help & Support",
        icon: <HelpsupportIcon />,
        to: "/admin/support",
        badge: null,
      },
      {
        name: "Settings",
        icon: <SettingsIcon />,
        to: "/admin/settings",
        badge: null,
      },
    ],
    [unreadNotificationsCount],
  );

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Check on initial load

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logOut()).unwrap();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - Fixed Position */}
      <div
        className={cn(
          "h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 flex flex-col z-30",
          collapsed ? "w-20" : "w-64",
          "fixed md:sticky top-0 left-0",
          mobileOpen ? "left-0" : "-left-full md:left-0",
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-3 border-b border-gray-700">
          {!collapsed && (
            <Link to="/admin" className="flex items-center">
              <ShoppingBag className="h-7 w-7 text-blue-400" />
              <h1 className="text-xl font-bold ml-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                E-shop
              </h1>
            </Link>
          )}
          {collapsed && (
            <Link to="/admin" className="mx-auto">
              <ShoppingBag className="h-7 w-7 text-blue-400" />
            </Link>
          )}
          <button
            onClick={toggleSidebar}
            className={cn(
              "p-1 rounded-full hover:bg-gray-700 transition-colors",
              collapsed && "mx-auto mt-2",
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>

        {/* Main Navigation - Scrollable if needed */}
        <div className="flex-1 py-2 px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <div className="space-y-0.5">
            {!collapsed && (
              <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Main
              </h3>
            )}
            {mainNavItems.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.to}
                text={item.name}
                active={location.pathname === item.to}
                collapsed={collapsed}
                badge={item.badge}
              >
                {React.cloneElement(item.icon, {
                  size: 20,
                  color: `${location.pathname === item.to ? "#fff" : "#9ca3af"}`,
                })}
              </NavLink>
            ))}
          </div>

          <div className="mt-4 space-y-0.5">
            {!collapsed && (
              <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                System
              </h3>
            )}
            {secondaryNavItems.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.to}
                text={item.name}
                active={location.pathname === item.to}
                collapsed={collapsed}
                badge={item.badge}
              >
                {React.cloneElement(item.icon, {
                  size: 20,
                  color: `${location.pathname === item.to ? "#fff" : "#9ca3af"}`,
                })}
              </NavLink>
            ))}
          </div>

          {/* Mini Analytics Section */}
          {!collapsed && (
            <div className="mt-4 px-2">
              <div className="bg-gray-800 rounded-lg p-2">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xs font-medium text-gray-300">
                    Sales Today
                  </h3>
                  <BarChart3 size={14} className="text-gray-400" />
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400">Progress</span>
                  <span className="text-xs font-medium text-white">$1,429</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full"
                    style={{ width: "70%" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Support */}
          {!collapsed && (
            <div className="mt-4 px-2">
              <ContactDevCard />
            </div>
          )}
        </div>

        {/* User Profile & Logout */}
        <div className="border-t border-gray-700 p-3">
          {!collapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {user?.firstName?.charAt(0) || "A"}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium text-white">
                    {user?.firstName || "Admin"} {user?.lastName || "User"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {user?.email || "admin@example.com"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-gray-400 rounded-full hover:bg-gray-700 group transition-colors"
              >
                <LogOut className="w-4 h-4 group-hover:text-white" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {user?.firstName?.charAt(0) || "A"}
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-gray-400 rounded-full hover:bg-gray-700 group transition-colors"
              >
                <LogOut className="w-4 h-4 group-hover:text-white" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <button
        className="fixed bottom-4 right-4 md:hidden z-10 bg-blue-600 text-white p-3 rounded-full shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>

      {/* Main Content - Scrollable */}
      <div
        className={cn(
          "flex-1 overflow-y-auto",
          collapsed ? "md:ml-20" : "md:ml-64",
          "w-full transition-all duration-300",
        )}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
