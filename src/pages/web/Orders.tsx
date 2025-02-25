import { ArrowUpDown, Ellipsis, ListFilter } from "lucide-react";
import React from "react";
import { Order } from "../../components/custom/tables/orders/columns";
import { OrdersClientTable, OrdersClientTableColumns } from "../../components/custom/tables/clientOrders";

function Orders() {
  const [filterStatus, setFilterStatus] = React.useState("All");
  const data = getData();
  return (
    <div className="mt-8">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      {/* filters */}

      <div className="flex items-center justify-between ">
        <div className="shadow bg-gray-100 px-1 py-0.5 flex gap-2 items-center rounded-sm">
          {["All", "Pending", "Completed", "Cancelled"].map((filter) => (
            <button
              key={filter}
              className={`text-center font-semibold h-full rounded-sm bg-gray-100 px-8 ${
                filterStatus === filter && "bg-white "
              }       flex-1 py-1 hover:transition-all delay-50`}
              onClick={() => setFilterStatus(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        {/* table actions */}

        <div className="flex gap-2 items-center">
          {[
            <ListFilter size={20} />,
            <ArrowUpDown size={20} />,
            <Ellipsis size={20} />,
          ].map((component) => (
            <button
              key="button"
              className="flex items-center gap-1 shadow rounded-sm bg-gray-50 p-1 "
            >
              {component}
            </button>
          ))}
        </div>
      </div>
      {/* orders table */}
    <div className="container mx-auto py-10">
          <OrdersClientTable columns={OrdersClientTableColumns} data={data} />
        </div>
    </div>
  );
}

function getData(): Order[] {
  return [
    {
      id: "728ed52f",
      customerName: "Mohamed Elhawary",
      type: "online",
      status: "pending",
      product: "Product 1",
      amount: 100,
      date: "2022-01-01",
    },
    {
      id: "728ed52d",
      customerName: "Ahmed Hassan",
      type: "online",
      status: "processing",
      product: "Product 2",
      amount: 200,
      date: "2022-01-02",
    },
    {
      id: "728ed52c",
      customerName: "Mahmoud Ali",
      type: "offline",
      status: "success",
      product: "Product 3",
      amount: 300,
      date: "2022-01-03",
    },
    {
      id: "728ed52b",
      customerName: "Abdelrahman Mohamed",
      type: "online",
      status: "failed",
      product: "Product 4",
      amount: 400,
      date: "2022-01-04",
    },
    {
      id: "728ed52f",
      customerName: "Mohamed Elhawary",
      type: "online",
      status: "pending",
      product: "Product 1",
      amount: 100,
      date: "2022-01-01",
    },
    {
      id: "728ed52d",
      customerName: "Ahmed Hassan",
      type: "online",
      status: "processing",
      product: "Product 2",
      amount: 200,
      date: "2022-01-02",
    },
    {
      id: "728ed52d",
      customerName: "Ahmed Hassan",
      type: "online",
      status: "processing",
      product: "Product 2",
      amount: 200,
      date: "2022-01-02",
    },
    {
      id: "728ed52d",
      customerName: "Ahmed Hassan",
      type: "online",
      status: "processing",
      product: "Product 2",
      amount: 200,
      date: "2022-01-02",
    },
    {
      id: "728ed52d",
      customerName: "Ahmed Hassan",
      type: "online",
      status: "processing",
      product: "Product 2",
      amount: 200,
      date: "2022-01-02",
    },
  ];
}

export default Orders;
