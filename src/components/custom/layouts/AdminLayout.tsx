import React from "react";
import { Outlet, useLocation } from "react-router-dom";
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

const navData = [
  {
    name: "Dashboard",
    icon: <DashboardIcon />,
    to: "/admin",
  },
  {
    name: "Orders",
    icon: <OrdersIcon />,
    to: "/admin/orders",
  },
  {
    name: "Inventory",
    icon: <InventoryIcon />,
    to: "/admin/inventory",
  },
  {
    name: "Payments",
    icon: <PaymentsIcon />,
    to: "/admin/payments",
  },
  {
    name: "Customers",
    icon: <CustomersIcon />,
    to: "/admin/customers",
  },
  {
    name: "notification",
    icon: <NotificationIcon />,
    to: "/admin/notifications",
  },
  {
    name: "Help & Support",
    icon: <HelpsupportIcon />,
    to: "/admin/support",
  },
  {
    name: "Settings",
    icon: <SettingsIcon />,
    to: "/admin/settings",
  },
];

function AdminLayout() {
  const location = useLocation();
  console.log(location.pathname);
  return (
    <div className="flex gap-1 w-full h-screen">
      <div className=" h-full w-2/12 bg-[#1B1B1E] text-white">
        <div className="h-32 flex items-center justify-center " id="logo-div">
          <h1 className="text-5xl  font-semibold">#E-shop</h1>
        </div>
        <div className="border-b border-gray-500 pb-4 m-1">
          {navData.slice(0, 5).map((data, idx) => {
            return (
              <NavLink
                key={idx}
                to={data.to}
                text={data.name}
                active={location.pathname === data.to}
              >
                {React.cloneElement(data.icon, {
                  size: 24,
                  color: `${
                    location.pathname === data.to ? "#fff" : "#6b7280"
                  }`,
                })}
              </NavLink>
            );
          })}
        </div>
        <div className="mt-4 m-1">
          {navData.slice(5, 8).map((data, idx) => {
            return (
              <NavLink
                key={idx}
                to={data.to}
                text={data.name}
                active={location.pathname === data.to}
              >
                {React.cloneElement(data.icon, {
                  size: 24,
                  color: `${
                    location.pathname === data.to ? "#fff" : "#6b7280"
                  }`,
                })}
              </NavLink>
            );
          })}
        </div>
        <div className="mt-20 mb-8 p-2">
          <ContactDevCard />
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default AdminLayout;
