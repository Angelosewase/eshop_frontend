import { MoveDown, MoveUp } from "lucide-react";
import { Order } from "../../components/custom/tables/orders/columns";
import { Table, columns } from "../../components/custom/tables/orders";
import { OrdersChart } from "../../components/custom";
import { Progress } from "../../components/ui/progress";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

function Orders() {
  return (
    <div className="flex-1  flex items-start  w-full h-screen overflow-hidden ">
      <div className=" flex-1  border-r border-black h-full  overflow-y-auto">
        <div className="flex-1 flex justify-between items-center  -mb-7">
          <div className="w-full py-3 items-center">
            <h1 className="text-3xl font-bold ml-5">Orders</h1>
          </div>
          <div className="flex gap-4  mr-2">
            <button className="border border-black rounded flex items-center gap-1 px-2 py-1.5">
              <MoveDown size={16} />
              export
            </button>
            <button className="border border-black rounded flex items-center gap-1 px-2 py-1.5 bg-black text-white">
              <MoveUp size={16} />
              Import
            </button>
          </div>
        </div>
        <OrdersTable />
      </div>
      <div className="w-[20%] ">
        <OrdersChart />
        <OrdersStatus />
        <OverviewCard />
      </div>
      <div />
    </div>
  );
}

export default Orders;

export const OrdersTable = () => {
  const data = getData();
  return (
    <div className="container mx-auto py-10">
      <Table columns={columns} data={data} />
    </div>
  );
};

export const OrdersStatus = () => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Orders status</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={33} />
          <div className="flex flex-col gap-3 mt-4">
            <div className="flex justify-between items-end  ">
              <div className="flex items-center gap-1 ">
                <button className="w-1.5 h-1.5 bg-[#373F51]" />
                <h1 className="text-base ">paid</h1>
              </div>
              <h2 className="text-xs  text-gray-500 font-semibold">33%</h2>
            </div>
            <div className="flex justify-between items-end ">
              <div className="flex items-center gap-1 ">
                <button className="w-1.5 h-1.5 bg-[#344b82]" />
                <h1 className="text-base ">cancelled</h1>
              </div>
              <h2 className="text-xs  text-gray-500 font-semibold">60%</h2>
            </div>
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-1 ">
                <button className="w-1.5 h-1.5 bg-[#373F51]" />
                <h1 className="text-base">refunded</h1>
              </div>
              <h2 className="text-xs  text-gray-500 font-semibold">7%</h2>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const OverviewCard = () => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 mt-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1 -mb-1">
                  <button className="w-1.5 h-1.5 bg-[#373F51]" />
                  <h1 className="text-base font-semibold">$550</h1>
                </div>
                <h2 className="text-xs  text-gray-400 font-semibold">
                  85986 bought
                </h2>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1 -mb-1">
                  <button className="w-1.5 h-1.5 bg-[#848294]" />
                  <h1 className="text-base font-semibold">$1260</h1>
                </div>
                <h2 className="text-xs  text-gray-400 font-semibold">
                 5894  deals
                </h2>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

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
