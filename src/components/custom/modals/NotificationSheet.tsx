import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bell, MoveDiagonal, Trash2, Check } from "lucide-react";
import { useState } from "react";
import {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
  Notification,
} from "../../../features/notifications/notificationSlice";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { LoadingSpinner } from "../../ui/loading-spinner";

function NotificationSheet() {
  const [selectedType, setSelectedType] = useState<"all" | "unread">("all");
  const { data: notificationsData, isLoading } = useGetNotificationsQuery();
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const notifications = notificationsData?.data || [];
  const filteredNotifications =
    selectedType === "all"
      ? notifications
      : notifications.filter((n) => !n.isRead);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsRead(notificationId).unwrap();
      toast.success("Notification marked as read");
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all notifications as read");
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    try {
      await deleteNotification(notificationId).unwrap();
      toast.success("Notification deleted");
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative hover:bg-cyan-400 p-2 rounded-full">
          <Bell size={15} />
          {notifications.some((n) => !n.isRead) && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {notifications.filter((n) => !n.isRead).length}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            <div className="w-full flex justify-between items-center pr-4 -mt-4">
              <p className="text-lg">Notifications</p>
              <MoveDiagonal size={20} />
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="flex items-end gap-5 border-b mt-4 border-gray-300">
          <button
            className={`border-b-2 ${selectedType === "all" ? "border-primary" : "border-white"} hover:border-primary transition-colors`}
            onClick={() => setSelectedType("all")}
          >
            All
          </button>
          <button
            className={`border-b-2 ${selectedType === "unread" ? "border-primary" : "border-white"} hover:border-primary transition-colors`}
            onClick={() => setSelectedType("unread")}
          >
            Unread
          </button>
          {notifications.some((n) => !n.isRead) && (
            <button
              onClick={handleMarkAllAsRead}
              className="ml-auto text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>
        <div className="mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <LoadingSpinner size="md" />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No notifications found
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDeleteNotification}
              />
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div
      className={`flex items-center gap-4 mt-4 hover:bg-gray-200 px-2 py-3 rounded ${!notification.isRead ? "bg-blue-50" : ""}`}
    >
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{notification.title}</h3>
            <p className="text-sm text-gray-600">{notification.message}</p>
          </div>
          <div className="flex gap-2">
            {!notification.isRead && (
              <button
                onClick={() => onMarkAsRead(notification.id)}
                className="p-1 hover:bg-gray-300 rounded-full"
                title="Mark as read"
              >
                <Check size={16} />
              </button>
            )}
            <button
              onClick={() => onDelete(notification.id)}
              className="p-1 hover:bg-gray-300 rounded-full"
              title="Delete notification"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
            {notification.type}
          </span>
        </div>
      </div>
    </div>
  );
}

export default NotificationSheet;
