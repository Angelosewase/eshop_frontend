import { useState, useEffect } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  Filter,
  Search,
  Trash2,
  AlertTriangle,
  Info,
  ShoppingCart,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
  Notification,
} from "../../features/notifications/notificationSlice";
import { PageHeaderWithIcons } from "../../components/custom";
import { LoadingSpinner } from "../../components/ui/loading-spinner";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { toast } from "sonner";
import { Skeleton } from "../../components/ui/skeleton";

function Notifications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Fetch notifications with the useGetNotificationsQuery hook
  const { data, isLoading, isFetching, error, refetch } =
    useGetNotificationsQuery();

  const [markAsRead, { isLoading: isMarkingAsRead }] =
    useMarkNotificationAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAllAsRead }] =
    useMarkAllNotificationsAsReadMutation();
  const [deleteNotification, { isLoading: isDeleting }] =
    useDeleteNotificationMutation();

  // Refetch data when tab changes
  useEffect(() => {
    refetch();
  }, [activeTab, refetch]);

  // Handle marking a notification as read
  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id).unwrap();
      toast.success("Notification marked as read");
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all notifications as read");
    }
  };

  // Handle deleting a notification
  const handleDelete = async (id: number) => {
    try {
      await deleteNotification(id).unwrap();
      toast.success("Notification deleted");
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  // Filter notifications based on search term and active tab
  const getFilteredNotifications = () => {
    if (!data?.data || !Array.isArray(data.data)) return [];

    let filtered = data.data;

    // Filter by tab
    if (activeTab === "unread") {
      filtered = filtered.filter((notification) => !notification.isRead);
    } else if (activeTab === "read") {
      filtered = filtered.filter((notification) => notification.isRead);
    }

    // Filter by search term
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (notification) =>
          notification.title.toLowerCase().includes(term) ||
          notification.message.toLowerCase().includes(term),
      );
    }

    return filtered;
  };

  const getPaginatedNotifications = () => {
    const filtered = getFilteredNotifications();
    const startIndex = (page - 1) * pageSize;
    return filtered.slice(startIndex, startIndex + pageSize);
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "order":
        return <ShoppingCart className="h-5 w-5 text-blue-600" />;
      case "user":
        return <User className="h-5 w-5 text-green-600" />;
      case "system":
        return <Settings className="h-5 w-5 text-purple-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  // Get notification background color based on type
  const getNotificationBgColor = (type: string, isRead: boolean) => {
    if (isRead) return "bg-gray-50";

    switch (type.toLowerCase()) {
      case "order":
        return "bg-blue-50";
      case "user":
        return "bg-green-50";
      case "system":
        return "bg-purple-50";
      case "warning":
        return "bg-amber-50";
      case "error":
        return "bg-red-50";
      default:
        return "bg-blue-50";
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const timeAgo = formatDistanceToNow(date, { addSuffix: true });
      return timeAgo;
    } catch (error) {
      return dateString;
    }
  };

  const filteredNotifications = getFilteredNotifications();
  const paginatedNotifications = getPaginatedNotifications();
  const unreadCount = data?.data?.filter((n) => !n.isRead).length || 0;
  const totalPages = Math.ceil(filteredNotifications.length / pageSize);

  // Handle page navigation
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="flex flex-col p-6 min-h-screen">
      <PageHeaderWithIcons title="Notifications" />

      <Card className="shadow-md flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
                {unreadCount > 0 && (
                  <Badge className="ml-2 bg-blue-500">
                    {unreadCount} unread
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Manage your notifications and stay updated
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0 || isMarkingAllAsRead}
              >
                {isMarkingAllAsRead ? (
                  <LoadingSpinner size="sm" className="mr-1" />
                ) : (
                  <CheckCheck className="h-4 w-4 mr-1" />
                )}
                Mark all as read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                {isFetching ? (
                  <LoadingSpinner size="sm" className="mr-1" />
                ) : (
                  <Clock className="h-4 w-4 mr-1" />
                )}
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>

        <div className="px-6 pb-3 flex-1 flex flex-col">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search notifications..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1); // Reset to first page on search
                }}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
              setPage(1); // Reset to first page on tab change
            }}
            className="flex-1 flex flex-col"
          >
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
            </TabsList>

            <div className="flex-1 flex flex-col">
              <TabsContent value="all" className="mt-0 flex-1 flex flex-col">
                <NotificationList
                  notifications={paginatedNotifications}
                  isLoading={isLoading}
                  isMarkingAsRead={isMarkingAsRead}
                  isDeleting={isDeleting}
                  error={error}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                  getNotificationIcon={getNotificationIcon}
                  getNotificationBgColor={getNotificationBgColor}
                  formatDate={formatDate}
                />
              </TabsContent>

              <TabsContent value="unread" className="mt-0 flex-1 flex flex-col">
                <NotificationList
                  notifications={paginatedNotifications}
                  isLoading={isLoading}
                  isMarkingAsRead={isMarkingAsRead}
                  isDeleting={isDeleting}
                  error={error}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                  getNotificationIcon={getNotificationIcon}
                  getNotificationBgColor={getNotificationBgColor}
                  formatDate={formatDate}
                />
              </TabsContent>

              <TabsContent value="read" className="mt-0 flex-1 flex flex-col">
                <NotificationList
                  notifications={paginatedNotifications}
                  isLoading={isLoading}
                  isMarkingAsRead={isMarkingAsRead}
                  isDeleting={isDeleting}
                  error={error}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                  getNotificationIcon={getNotificationIcon}
                  getNotificationBgColor={getNotificationBgColor}
                  formatDate={formatDate}
                />
              </TabsContent>
            </div>
          </Tabs>

          {/* Pagination Controls */}
          {filteredNotifications.length > 0 && (
            <div className="flex justify-between items-center mt-4 pt-3 border-t">
              <div className="text-sm text-gray-500">
                Showing{" "}
                {Math.min(
                  filteredNotifications.length,
                  (page - 1) * pageSize + 1,
                )}{" "}
                to {Math.min(filteredNotifications.length, page * pageSize)} of{" "}
                {filteredNotifications.length} notifications
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={page >= totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

interface NotificationListProps {
  notifications: Notification[];
  isLoading: boolean;
  isMarkingAsRead: boolean;
  isDeleting: boolean;
  error: any;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
  getNotificationIcon: (type: string) => JSX.Element;
  getNotificationBgColor: (type: string, isRead: boolean) => string;
  formatDate: (dateString: string) => string;
}

const NotificationList = ({
  notifications,
  isLoading,
  isMarkingAsRead,
  isDeleting,
  error,
  onMarkAsRead,
  onDelete,
  getNotificationIcon,
  getNotificationBgColor,
  formatDate,
}: NotificationListProps) => {
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="p-4 rounded-lg border bg-gray-50">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="bg-red-50 border-red-200 text-red-800 my-4">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertTitle>Error loading notifications</AlertTitle>
        <AlertDescription>
          There was a problem loading your notifications. Please try again
          later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <Alert className="bg-blue-50 border-blue-200 text-blue-800 my-4">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle>No notifications found</AlertTitle>
        <AlertDescription>
          You don't have any notifications at the moment. Check back later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div
      className="space-y-3 overflow-y-auto pr-2 flex-1"
      style={{ maxHeight: "calc(100vh - 350px)" }}
    >
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg border ${getNotificationBgColor(notification.type, notification.isRead)} transition-colors duration-200 hover:shadow-sm`}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-white shadow-sm">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3
                  className={`font-medium ${!notification.isRead ? "text-gray-900" : "text-gray-600"}`}
                >
                  {notification.title}
                </h3>
                <span className="text-xs text-gray-500">
                  {formatDate(notification.createdAt)}
                </span>
              </div>
              <p
                className={`text-sm mt-1 ${!notification.isRead ? "text-gray-700" : "text-gray-500"}`}
              >
                {notification.message}
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-3">
            {!notification.isRead && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMarkAsRead(notification.id)}
                disabled={isMarkingAsRead}
                className="h-8 px-2 text-xs"
              >
                {isMarkingAsRead ? (
                  <LoadingSpinner size="sm" className="mr-1" />
                ) : (
                  <Check className="h-3 w-3 mr-1" />
                )}
                Mark as read
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(notification.id)}
              disabled={isDeleting}
              className="h-8 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              {isDeleting ? (
                <LoadingSpinner size="sm" className="mr-1" />
              ) : (
                <Trash2 className="h-3 w-3 mr-1" />
              )}
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
