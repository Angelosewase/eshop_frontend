import { useState, useEffect } from "react";
import { useGetOrdersQuery } from "../../features/orders/ordersSlice";
import { useAppSelector } from "../../hooks/Reduxhooks";
import { selectUser } from "../../features/auth/authSlice";
import DataTable from "../../components/custom/tables/clientOrders/data-table";
import columns, { Order } from "../../components/custom/tables/clientOrders/columns";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { data: ordersData, isLoading } = useGetOrdersQuery();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    if (ordersData?.orders) {
      const transformedOrders = ordersData.orders.map((order) => ({
        id: order.id.toString(),
        customerName: user?.email || "Guest",
        type: "Purchase",
        status: (order.payment?.status || "pending") as "pending" | "paid" | "cancelled" | "refunded",
        product: order.user?.name || "Unknown Product",
        amount: Number(order.total),
        date: order.createdAt
      }));
      setOrders(transformedOrders);
    }
  }, [ordersData, user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={orders} />
    </div>
  );
};

export default Orders;
