import { ArrowUpDown, Ellipsis, ListFilter, ShoppingBag } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Order } from "../../components/custom/tables/orders/columns";
import { OrdersClientTable, OrdersClientTableColumns } from "../../components/custom/tables/clientOrders";
import { useGetUserOrdersQuery } from "../../features/orders/ordersSlice";
import { useAppSelector } from "../../hooks/Reduxhooks";
import { Link } from "react-router-dom";

function Orders() {
  const [filterStatus, setFilterStatus] = useState("All");
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const { data: userOrdersData, isLoading, error } = useGetUserOrdersQuery();
  const user = useAppSelector(state => state.auth.user);

  // Transform API orders to the format expected by the table
  const transformOrders = (apiOrders: any[]): Order[] => {
    if (!apiOrders) return [];

    return apiOrders.map(order => ({
      id: order.id.toString(),
      customerName: user?.firstName + ' ' + user?.lastName || 'You',
      type: order.paymentMethod || 'online',
      status: order.payment?.status || 'pending',
      product: order.items?.[0]?.product?.name || 'Multiple items',
      amount: order.total || 0,
      date: new Date(order.createdAt).toLocaleDateString(),
    }));
  };

  // Apply filters
  useEffect(() => {
    if (!userOrdersData?.data) {
      setFilteredOrders([]);
      return;
    }

    const orders = transformOrders(userOrdersData.data);

    if (filterStatus === "All") {
      setFilteredOrders(orders);
    } else {
      const status = filterStatus.toLowerCase();
      setFilteredOrders(orders.filter(order =>
        order.status.toLowerCase() === status
      ));
    }
  }, [userOrdersData, filterStatus, user]);

  if (isLoading) {
    return (
      <div className="mt-8">
        <h1 className="text-2xl font-bold mb-4">Orders</h1>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <h1 className="text-2xl font-bold mb-4">Orders</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> Unable to load your orders. Please try again later.</span>
        </div>
      </div>
    );
  }

  if (!userOrdersData?.data || userOrdersData.data.length === 0) {
    return (
      <div className="mt-8">
        <h1 className="text-2xl font-bold mb-4">Orders</h1>
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No orders found</h2>
          <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
          <Link to="/explore">
            <button className="bg-black text-white rounded-md py-2 px-4 hover:bg-gray-800 transition-colors">
              Start Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      {/* filters */}

      <div className="flex items-center justify-between mb-6">
        <div className="shadow bg-gray-100 px-1 py-0.5 flex gap-2 items-center rounded-sm">
          {["All", "Pending", "Processing", "Success", "Failed"].map((filter) => (
            <button
              key={filter}
              className={`text-center font-semibold h-full rounded-sm bg-gray-100 px-8 ${filterStatus === filter ? "bg-white shadow-sm" : ""
                } flex-1 py-1 hover:bg-white hover:shadow-sm transition-all`}
              onClick={() => setFilterStatus(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        {/* table actions */}

        <div className="flex gap-2 items-center">
          {[
            <ListFilter size={20} key="filter" />,
            <ArrowUpDown size={20} key="sort" />,
            <Ellipsis size={20} key="more" />,
          ].map((component, index) => (
            <button
              key={index}
              className="flex items-center gap-1 shadow rounded-sm bg-gray-50 p-1 hover:bg-white transition-colors"
            >
              {component}
            </button>
          ))}
        </div>
      </div>
      {/* orders table */}
      <div className="container mx-auto py-6">
        <OrdersClientTable columns={OrdersClientTableColumns} data={filteredOrders} />
      </div>
    </div>
  );
}

export default Orders;
