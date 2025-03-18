import {
  ChartColumnStacked,
  HeartHandshake,
  Kanban,
  PersonStanding,
  Pencil,
  Trash2,
  BarChart3,
  DollarSign,
  ShoppingCart,
  Users,
  Activity,
  TrendingUp,
  Clock,
  Calendar,
  CreditCard,
  AlertCircle
} from "lucide-react";
import { PageHeaderWithIcons, StatisticsCard } from "../../components/custom";
import { AddCategoryModal, EditCategoryModal } from "../../components/custom/modals";
import { useGetDashboardStatsQuery } from "../../features/dashboard/dashboardSlice";
import { useGetCategoriesQuery, useDeleteCategoryMutation } from "../../features/inventory/categorySlice";
import { useGetRecentActivityQuery } from "../../features/activity/activitySlice";
import { useGetRecentPaymentsQuery } from "../../features/payments/paymentsSlice";
import { toast } from "sonner";
import { LoadingSpinner } from "../../components/ui/loading-spinner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";

// Define activity interface
interface ActivityItem {
  id: number;
  action: string;
  user: string;
  time: string;
  amount: string | null;
  status: 'pending' | 'completed' | 'cancelled' | 'info';
}

// Define payment interface
interface PaymentItem {
  id: number;
  orderId: number;
  amount: string;
  method: string;
  status: string;
  date: string;
  customer: string;
}

function Home() {
  const { data: stats, isLoading, error } = useGetDashboardStatsQuery();
  const { data: activityData, isLoading: isLoadingActivity, error: activityError } = useGetRecentActivityQuery();
  const { data: paymentsData, isLoading: isLoadingPayments, error: paymentsError } = useGetRecentPaymentsQuery();
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [recentPayments, setRecentPayments] = useState<PaymentItem[]>([]);
  const [activityTab, setActivityTab] = useState<string>("all");

  useEffect(() => {
    if (activityData) {
      setRecentActivity(Array.isArray(activityData) ? activityData : []);
    }
  }, [activityData]);

  // Process payments data when it's loaded
  useEffect(() => {
    if (paymentsData) {
      setRecentPayments(Array.isArray(paymentsData) ? paymentsData : []);
    }
  }, [paymentsData]);

  if (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return (
      <div className="flex flex-col p-6 min-h-screen">
        <PageHeaderWithIcons title="Dashboard" />
        <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">
          <h3 className="font-semibold">Error loading dashboard</h3>
          <p>Failed to fetch dashboard statistics. Please try again later.</p>
        </div>
      </div>
    );
  }

  const DashboardStats = [
    {
      title: "Total Products",
      value: isLoading ? <LoadingSpinner size="sm" /> : stats?.totalProducts.toLocaleString() || "0",
      icon: <Kanban className="h-5 w-5 text-blue-600" />,
      description: "Total products in inventory",
      trend: "+12.5%",
      trendUp: true
    },
    {
      title: "Total Categories",
      value: isLoading ? <LoadingSpinner size="sm" /> : stats?.totalCategories.toLocaleString() || "0",
      icon: <ChartColumnStacked className="h-5 w-5 text-purple-600" />,
      description: "Product categories",
      trend: "+5.2%",
      trendUp: true
    },
    {
      title: "Active Deals",
      value: isLoading ? <LoadingSpinner size="sm" /> : stats?.totalDeals.toLocaleString() || "0",
      icon: <HeartHandshake className="h-5 w-5 text-green-600" />,
      description: "Current promotions",
      trend: "+18.3%",
      trendUp: true
    },
    {
      title: "Total Customers",
      value: isLoading ? <LoadingSpinner size="sm" /> : stats?.totalCustomers.toLocaleString() || "0",
      icon: <Users className="h-5 w-5 text-amber-600" />,
      description: "Registered users",
      trend: "+7.1%",
      trendUp: true
    },
  ];

  // Filter activities based on selected tab
  const filteredActivities = Array.isArray(recentActivity)
    ? (activityTab === "all"
      ? recentActivity
      : recentActivity.filter(activity => activity.status === activityTab))
    : [];

  return (
    <div className="flex flex-col p-6 min-h-screen">
      <PageHeaderWithIcons title="Dashboard" />

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {DashboardStats.map((stat, idx) => (
          <Card key={idx} className="overflow-hidden border-none shadow-md">
            <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-slate-100">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="p-2 rounded-full bg-white shadow-sm">
                  {stat.icon}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mt-2">{stat.value}</div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <Badge variant={stat.trendUp ? "default" : "destructive"} className={`flex items-center gap-1 ${stat.trendUp ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}`}>
                  {stat.trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingUp className="h-3 w-3 rotate-180" />}
                  {stat.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Left Column - Categories */}
        <Card className="lg:col-span-1 shadow-md">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Product Categories</CardTitle>
              <CardDescription>Manage your product categories</CardDescription>
            </div>
            <AddCategoryModal />
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-y-auto px-3">
            <ProductCategories />
          </CardContent>
        </Card>

        {/* Right Column - Activity & Performance */}
        <Card className="lg:col-span-2 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
            <CardDescription>Latest transactions and system events</CardDescription>
          </CardHeader>

          {/* Activity Tabs */}
          <Tabs value={activityTab} onValueChange={setActivityTab} className="px-6">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="all" className="text-xs">All Activity</TabsTrigger>
              <TabsTrigger value="completed" className="text-xs">Completed</TabsTrigger>
              <TabsTrigger value="pending" className="text-xs">Pending</TabsTrigger>
              <TabsTrigger value="cancelled" className="text-xs">Cancelled</TabsTrigger>
              <TabsTrigger value="payments" className="text-xs">Payments</TabsTrigger>
            </TabsList>

            {/* All Activity Types Content */}
            <TabsContent value="all" className="mt-0">
              <ActivityContent
                activities={filteredActivities}
                isLoading={isLoadingActivity}
                error={activityError}
              />
            </TabsContent>

            {/* Completed Activity Content */}
            <TabsContent value="completed" className="mt-0">
              <ActivityContent
                activities={filteredActivities}
                isLoading={isLoadingActivity}
                error={activityError}
              />
            </TabsContent>

            {/* Pending Activity Content */}
            <TabsContent value="pending" className="mt-0">
              <ActivityContent
                activities={filteredActivities}
                isLoading={isLoadingActivity}
                error={activityError}
              />
            </TabsContent>

            {/* Cancelled Activity Content */}
            <TabsContent value="cancelled" className="mt-0">
              <ActivityContent
                activities={filteredActivities}
                isLoading={isLoadingActivity}
                error={activityError}
              />
            </TabsContent>

            {/* Payments Tab Content */}
            <TabsContent value="payments" className="mt-0">
              {isLoadingPayments ? (
                <div className="flex justify-center items-center py-12">
                  <LoadingSpinner size="md" />
                </div>
              ) : paymentsError || !paymentsData || paymentsData.length === 0 ? (
                <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertTitle>Payment System Under Development</AlertTitle>
                  <AlertDescription>
                    The payment tracking system is currently being implemented and will be available soon.
                    Check back later for real-time payment information.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {Array.isArray(recentPayments) && recentPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-green-100">
                          <CreditCard className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Payment for Order #{payment.orderId}</p>
                          <p className="text-xs text-muted-foreground">{payment.customer}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{payment.amount}</p>
                        <p className="text-xs text-muted-foreground">{payment.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <CardFooter className="flex justify-center border-t pt-4 mt-4">
            <Button variant="outline" size="sm" className="w-full">
              View All Activity
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

// Activity Content Component
interface ActivityContentProps {
  activities: ActivityItem[];
  isLoading: boolean;
  error: any;
}

const ActivityContent = ({ activities, isLoading, error }: ActivityContentProps) => {
  // Debug the incoming activities
  console.log("ActivityContent received activities:", activities);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500 bg-red-50 rounded-lg p-3">
        <p className="font-medium">Error loading activity data</p>
        <p className="text-sm">Please try again later</p>
      </div>
    );
  }

  // Check if activities is an array and has items
  if (!activities || !Array.isArray(activities) || activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
        <p className="font-medium">No activity found</p>
        <p className="text-sm mt-1">Activity will appear here as users interact with the system</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full 
              ${activity.status === 'completed' ? 'bg-green-100' :
                activity.status === 'pending' ? 'bg-amber-100' :
                  activity.status === 'cancelled' ? 'bg-red-100' : 'bg-blue-100'}`}>
              {activity.status === 'completed' ? <DollarSign className="h-4 w-4 text-green-600" /> :
                activity.status === 'pending' ? <Clock className="h-4 w-4 text-amber-600" /> :
                  activity.status === 'cancelled' ? <Trash2 className="h-4 w-4 text-red-600" /> :
                    <Activity className="h-4 w-4 text-blue-600" />}
            </div>
            <div>
              <p className="text-sm font-medium">{activity.action}</p>
              <p className="text-xs text-muted-foreground">{activity.user}</p>
            </div>
          </div>
          <div className="text-right">
            {activity.amount && <p className="text-sm font-medium">{activity.amount}</p>}
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;

const ProductCategories = () => {
  const { data: categories, isLoading, error } = useGetCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();

  // Debug logs for categories
  console.log('Categories Response:', categories);
  console.log('Categories Loading State:', isLoading);
  console.log('Categories Error:', error);

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id).unwrap();
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500 bg-red-50 rounded-lg p-3">
        <p className="font-medium">Error loading categories</p>
        <p className="text-sm">{JSON.stringify(error)}</p>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
        <p className="font-medium">No categories found</p>
        <p className="text-sm mt-1">Add your first category to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {categories.map((category) => (
        <div
          key={category.id}
          className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-shadow"
        >
          <div>
            <h3 className="font-medium">{category.name}</h3>
            {category.description && (
              <p className="text-sm text-gray-500 line-clamp-1">{category.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <EditCategoryModal category={category} />
            <button
              className="p-1.5 hover:bg-red-50 rounded text-red-500 transition-colors"
              onClick={() => handleDelete(category.id)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
