import { useState } from "react";
import { useGetOrdersQuery } from "../../features/orders/ordersSlice";
import DataTable from "../../components/custom/tables/orders/data-table";
import { columns } from "../../components/custom/tables/orders/columns";
import { Card, CardHeader, CardTitle } from "../../components/ui/card";

function Orders() {
  const [selectedTab, setSelectedTab] = useState("all");
  const { data: ordersData } = useGetOrdersQuery();

  const filteredOrders = ordersData?.orders?.filter((order) => {
    if (selectedTab === "all") return true;
    if (selectedTab === "pending") return order.status === "pending";
    if (selectedTab === "processing") return order.status === "processing";
    if (selectedTab === "completed") return order.status === "completed";
    if (selectedTab === "cancelled") return order.status === "cancelled";
    return true;
  });

  const totalOrders = ordersData?.orders?.length || 0;
  const totalRevenue =
    ordersData?.orders?.reduce(
      (acc, order) => acc + parseFloat(order.total || "0"),
      0,
    ) || 0;
  const pendingOrders =
    ordersData?.orders?.filter((order) => order.status === "pending").length ||
    0;
  const processingOrders =
    ordersData?.orders?.filter((order) => order.status === "processing")
      .length || 0;

  return (
    <div className="container mx-auto py-10">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="cursor-pointer" onClick={() => setSelectedTab("all")}>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <p className="text-2xl font-bold">{totalOrders}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
          </CardHeader>
        </Card>
        <Card
          className="cursor-pointer"
          onClick={() => setSelectedTab("pending")}
        >
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Pending Orders
            </CardTitle>
            <p className="text-2xl font-bold">{pendingOrders}</p>
          </CardHeader>
        </Card>
        <Card
          className="cursor-pointer"
          onClick={() => setSelectedTab("processing")}
        >
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Processing Orders
            </CardTitle>
            <p className="text-2xl font-bold">{processingOrders}</p>
          </CardHeader>
        </Card>
      </div>

      <DataTable columns={columns} data={filteredOrders || []} />
    </div>
  );
}

export default Orders;
