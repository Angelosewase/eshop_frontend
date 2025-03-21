"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { OrderDetails } from "../../features/orders/ordersSlice";
import { formatCurrency, formatNumber } from "../../lib/utils";

interface OrdersChartProps {
  orders: OrderDetails[];
}

export default function OrdersChart({ orders }: OrdersChartProps) {
  // Debug the incoming orders
  console.log("OrdersChart received orders:", orders);

  // Calculate total revenue and order counts
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;

  // Group orders by date with improved error handling
  const ordersByDate = orders.reduce(
    (acc, order) => {
      let dateStr;
      try {
        // Ensure we have a valid date object
        const orderDate =
          order.createdAt instanceof Date
            ? order.createdAt
            : new Date(order.createdAt);

        // Check if date is valid
        if (isNaN(orderDate.getTime())) {
          console.warn("Invalid date in order:", order);
          dateStr = "Unknown";
        } else {
          dateStr = orderDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
        }
      } catch (e) {
        console.error("Error formatting date for order:", order, e);
        dateStr = "Unknown";
      }

      if (!acc[dateStr]) {
        acc[dateStr] = {
          date: dateStr,
          orders: 0,
          revenue: 0,
          paid: 0,
          pending: 0,
          cancelled: 0,
        };
      }

      acc[dateStr].orders += 1;
      acc[dateStr].revenue += order.total;

      const status = order.payment?.status || "pending";
      if (status === "paid") {
        acc[dateStr].paid += order.total;
      } else if (status === "pending") {
        acc[dateStr].pending += order.total;
      } else if (status === "cancelled") {
        acc[dateStr].cancelled += order.total;
      }

      return acc;
    },
    {} as Record<
      string,
      {
        date: string;
        orders: number;
        revenue: number;
        paid: number;
        pending: number;
        cancelled: number;
      }
    >,
  );

  // Convert to array and sort by date
  const chartData = Object.values(ordersByDate);

  // Sort by date if possible
  const sortedChartData = [...chartData].sort((a, b) => {
    // Handle "Unknown" dates
    if (a.date === "Unknown") return 1;
    if (b.date === "Unknown") return -1;

    try {
      // Parse dates for comparison
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    } catch (e) {
      console.error("Error sorting dates:", a.date, b.date, e);
      return 0;
    }
  });

  // Take only the last 7 days if we have more data
  const recentChartData = sortedChartData.slice(-7);

  // Debug the chart data
  console.log("Chart data:", recentChartData);

  // If no data, show a message
  if (recentChartData.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Orders Overview</CardTitle>
              <CardDescription>Revenue breakdown by day</CardDescription>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{formatCurrency(0)}</p>
              <p className="text-sm text-muted-foreground">0 orders</p>
            </div>
          </div>
        </CardHeader>
        <CardContent
          className="p-0 flex items-center justify-center"
          style={{ height: "250px" }}
        >
          <div className="text-center text-muted-foreground">
            <p>No order data available to display</p>
            <p className="text-sm mt-2">Create some orders to see the chart</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Orders Overview</CardTitle>
            <CardDescription>Revenue breakdown by day</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
            <p className="text-sm text-muted-foreground">
              {formatNumber(totalOrders)} orders
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[calc(100%-80px)] min-h-[250px] w-full px-4">
          {/* Add error boundary for recharts */}
          {(() => {
            try {
              return (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={recentChartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(value) => `$${value}`} width={60} />
                    <Tooltip
                      formatter={(value) => [`$${value}`, ""]}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Legend />
                    <Bar
                      dataKey="paid"
                      name="Paid"
                      fill="#16a34a"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="pending"
                      name="Pending"
                      fill="#eab308"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="cancelled"
                      name="Cancelled"
                      fill="#ef4444"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              );
            } catch (error) {
              console.error("Error rendering chart:", error);
              return (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <p>Error rendering chart</p>
                    <p className="text-sm mt-2">
                      Please try refreshing the page
                    </p>
                    <pre className="text-xs mt-4 text-left bg-gray-100 p-2 rounded max-w-full overflow-auto">
                      {JSON.stringify(recentChartData, null, 2)}
                    </pre>
                  </div>
                </div>
              );
            }
          })()}
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <div className="flex justify-between w-full text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-green-600" />
            <span>Paid Orders</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-yellow-500" />
            <span>Pending Orders</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-red-500" />
            <span>Cancelled Orders</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
