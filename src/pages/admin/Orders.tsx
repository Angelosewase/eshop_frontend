import {
  Download,
  Upload,
  Search,
  Filter,
  ArrowUpDown,
  ShoppingCart,
  DollarSign,
  Clock,
  AlertCircle,
  BarChart3,
  Table2
} from "lucide-react";
import { Order } from "../../components/custom/tables/orders/columns";
import { Table, columns } from "../../components/custom/tables/orders";
import OrdersChart from "../../components/custom/OrdersChart";
import { Progress } from "../../components/ui/progress";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useGetOrdersQuery } from "../../features/orders/ordersSlice";
import { transformOrderDetailItoOrderI } from "../../lib/utils";
import { LoadingSpinner } from "../../components/ui/loading-spinner";
import { formatCurrency, formatNumber } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";

function Orders() {
  const { data, error, isLoading, refetch } = useGetOrdersQuery();
  const ordersData = data?.data || [];

  // Debug the incoming data
  console.log("Raw orders data:", ordersData);

  // Convert string dates to Date objects for the chart component
  // Ensure we're handling all possible date formats
  const orders: Order[] = ordersData.map(order => {
    let createdAtDate;
    try {
      // Handle different date formats
      if (order.createdAt instanceof Date) {
        createdAtDate = order.createdAt;
      } else if (typeof order.createdAt === 'string') {
        createdAtDate = new Date(order.createdAt);
      } else if (order.createdAt && typeof order.createdAt === 'object' && 'toDate' in order.createdAt) {
        // Handle Firestore Timestamp objects
        createdAtDate = order.createdAt.toDate();
      } else {
        // Fallback to current date if we can't parse
        console.warn("Could not parse date for order:", order.id);
        createdAtDate = new Date();
      }

      // Validate the date is valid
      if (isNaN(createdAtDate.getTime())) {
        console.warn("Invalid date for order:", order.id, order.createdAt);
        createdAtDate = new Date();
      }
    } catch (e) {
      console.error("Error parsing date for order:", order.id, e);
      createdAtDate = new Date();
    }

    return {
      ...order,
      createdAt: createdAtDate
    };
  });

  // Debug the processed orders
  console.log("Processed orders with dates:", orders);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTab, setSelectedTab] = useState("all");
  const [viewMode, setViewMode] = useState("analytics");

  // Auto-refresh orders data every 30 seconds
  useEffect(() => {
    // Initial refetch to ensure we have the latest data
    refetch();

    // Set up periodic refetch
    const intervalId = setInterval(() => {
      console.log("Auto-refreshing orders data...");
      refetch();
    }, 30000); // 30 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [refetch]);

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === "" ||
      order.id.toString().includes(searchTerm) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === "all" ||
      (order.payment?.status || "pending") === selectedStatus;

    const matchesTab = selectedTab === "all" ||
      (selectedTab === "pending" && (order.payment?.status || "pending") === "pending") ||
      (selectedTab === "paid" && (order.payment?.status || "pending") === "paid") ||
      (selectedTab === "cancelled" && (order.payment?.status || "pending") === "cancelled");

    return matchesSearch && matchesStatus && matchesTab;
  });

  // Calculate statistics
  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((acc, order) => acc + order.total, 0),
    pendingOrders: orders.filter(order => (order.payment?.status || "pending") === 'pending').length,
    paidOrders: orders.filter(order => (order.payment?.status || "pending") === 'paid').length,
    cancelledOrders: orders.filter(order => (order.payment?.status || "pending") === 'cancelled').length,
  };

  // Get unique statuses
  const statuses = ["all", ...new Set(orders.map(order => order.payment?.status || "").filter(Boolean))];

  if (isLoading) {
    return (
      <div className="p-6 min-h-screen">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Orders Management</h1>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {[...Array(4)].map((_, idx) => (
            <Card key={idx} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="w-full flex items-center justify-center mt-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 min-h-screen">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Orders Management</h1>
        </div>
        <div className="flex items-center justify-center h-[calc(100vh-8rem)] text-red-500">
          <p>Failed to fetch orders. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Orders Management</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2" onClick={() => refetch()}>
            <Upload className="h-4 w-4" />
            Import
          </Button>
        </div>
      </div>

      {/* Statistics Cards - Only show in analytics view */}
      {viewMode === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatNumber(stats.totalOrders)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatNumber(stats.paidOrders)} completed orders
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                From {formatNumber(stats.totalOrders)} orders
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Orders
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatNumber(stats.pendingOrders)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {((stats.pendingOrders / stats.totalOrders) * 100).toFixed(1)}% of total orders
              </p>
            </CardContent>
          </Card>
          <Card className={stats.cancelledOrders > 0 ? "border-red-200 bg-red-50" : ""}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className={`text-sm font-medium ${stats.cancelledOrders > 0 ? "text-red-500" : "text-muted-foreground"}`}>
                Cancelled Orders
              </CardTitle>
              <AlertCircle className={`h-4 w-4 ${stats.cancelledOrders > 0 ? "text-red-500" : "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stats.cancelledOrders > 0 ? "text-red-600" : ""}`}>
                {formatNumber(stats.cancelledOrders)}
              </div>
              <p className={`text-xs ${stats.cancelledOrders > 0 ? "text-red-500" : "text-muted-foreground"} mt-1`}>
                {((stats.cancelledOrders / stats.totalOrders) * 100).toFixed(1)}% of total orders
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main View Mode Tabs */}
      <Tabs value={viewMode} onValueChange={setViewMode}>
        <div className="mb-4 flex justify-between items-center">
          <TabsList>
            <TabsTrigger
              value="analytics"
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="table"
              className="flex items-center gap-2"
            >
              <Table2 className="h-4 w-4" />
              Orders Table
            </TabsTrigger>
          </TabsList>

          {/* Filters and Search */}
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "all" ? "All Statuses" : status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Sort
            </Button>
          </div>
        </div>

        {/* Content Area with fixed height - Taller for table view */}
        <div className={`overflow-hidden ${viewMode === 'table' ? 'h-[calc(100vh-14rem)]' : 'h-[calc(100vh-20rem)]'}`}>
          {/* Analytics View */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              <div className="lg:col-span-2 h-full overflow-auto">
                <OrdersChart orders={orders} />
              </div>
              <div className="space-y-6 h-full overflow-auto">
                <OrdersStatus orders={orders} />
                <OverviewCard orders={orders} />
              </div>
            </div>
          </TabsContent>

          {/* Table View */}
          <TabsContent value="table">
            <div className="h-full">
              {/* Order Status Tabs */}
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <div className="mb-4">
                  <TabsList>
                    <TabsTrigger value="all">
                      All Orders
                    </TabsTrigger>
                    <TabsTrigger value="pending">
                      Pending
                    </TabsTrigger>
                    <TabsTrigger value="paid">
                      Paid
                    </TabsTrigger>
                    <TabsTrigger value="cancelled">
                      Cancelled
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Table Container */}
                <div className="h-[calc(100%-3rem)] overflow-hidden">
                  <Card className="h-full">
                    <CardContent className="p-0 h-full">
                      <div className="h-full overflow-auto">
                        <Table columns={columns} data={filteredOrders} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </Tabs>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export default Orders;

export const OrdersStatus = ({ orders }: { orders: Order[] }) => {
  // Debug the incoming orders
  console.log("OrdersStatus received orders:", orders);

  const totalOrders = orders.length;
  const paidOrders = orders.filter(order => (order.payment?.status || "pending") === 'paid').length;
  const cancelledOrders = orders.filter(order => (order.payment?.status || "pending") === 'cancelled').length;
  const pendingOrders = orders.filter(order => (order.payment?.status || "pending") === 'pending').length;

  const paidPercentage = totalOrders > 0 ? (paidOrders / totalOrders) * 100 : 0;
  const cancelledPercentage = totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0;
  const pendingPercentage = totalOrders > 0 ? (pendingOrders / totalOrders) * 100 : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Orders Status</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={paidPercentage} className="h-2 mb-2" />
        <div className="flex flex-col gap-3 mt-4">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-primary" />
              <span className="text-sm font-medium">Paid</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">{paidOrders}</span>
              <span className="text-xs text-muted-foreground">({paidPercentage.toFixed(1)}%)</span>
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-yellow-500" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">{pendingOrders}</span>
              <span className="text-xs text-muted-foreground">({pendingPercentage.toFixed(1)}%)</span>
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-red-500" />
              <span className="text-sm font-medium">Cancelled</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">{cancelledOrders}</span>
              <span className="text-xs text-muted-foreground">({cancelledPercentage.toFixed(1)}%)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const OverviewCard = ({ orders }: { orders: Order[] }) => {
  // Debug the incoming orders
  console.log("OverviewCard received orders:", orders);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Revenue</span>
            <span className="text-sm font-medium">{formatCurrency(totalRevenue)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Orders</span>
            <span className="text-sm font-medium">{formatNumber(totalOrders)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Avg. Order Value</span>
            <span className="text-sm font-medium">{formatCurrency(avgOrderValue)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// function getData(): Order[] {
//   return [
//     {
//       id: "728ed52f",
//       customerName: "Mohamed Elhawary",
//       type: "online",
//       status: "pending",
//       product: "Product 1",
//       amount: 100,
//       date: "2022-01-01",
//     },
//     {
//       id: "728ed52d",
//       customerName: "Ahmed Hassan",
//       type: "online",
//       status: "processing",
//       product: "Product 2",
//       amount: 200,
//       date: "2022-01-02",
//     },
//     {
//       id: "728ed52c",
//       customerName: "Mahmoud Ali",
//       type: "offline",
//       status: "success",
//       product: "Product 3",
//       amount: 300,
//       date: "2022-01-03",
//     },
//     {
//       id: "728ed52b",
//       customerName: "Abdelrahman Mohamed",
//       type: "online",
//       status: "failed",
//       product: "Product 4",
//       amount: 400,
//       date: "2022-01-04",
//     },
//     {
//       id: "728ed52f",
//       customerName: "Mohamed Elhawary",
//       type: "online",
//       status: "pending",
//       product: "Product 1",
//       amount: 100,
//       date: "2022-01-01",
//     },
//     {
//       id: "728ed52d",
//       customerName: "Ahmed Hassan",
//       type: "online",
//       status: "processing",
//       product: "Product 2",
//       amount: 200,
//       date: "2022-01-02",
//     },
//     {
//       id: "728ed52d",
//       customerName: "Ahmed Hassan",
//       type: "online",
//       status: "processing",
//       product: "Product 2",
//       amount: 200,
//       date: "2022-01-02",
//     },
//     {
//       id: "728ed52d",
//       customerName: "Ahmed Hassan",
//       type: "online",
//       status: "processing",
//       product: "Product 2",
//       amount: 200,
//       date: "2022-01-02",
//     },
//     {
//       id: "728ed52d",
//       customerName: "Ahmed Hassan",
//       type: "online",
//       status: "processing",
//       product: "Product 2",
//       amount: 200,
//       date: "2022-01-02",
//     },
//   ];
// }
