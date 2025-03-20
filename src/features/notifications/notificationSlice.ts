import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { prepareAuthHeaders } from "../../utils/api";

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  userId: number;
  createdAt: string;
  deletedAt: string | null;
}

interface NotificationResponse {
  success: boolean;
  data: Notification[];
  total: number;
  message: string;
}

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/',
    credentials: "include",
    prepareHeaders: prepareAuthHeaders,
  }),
  tagTypes: ['Notification'],
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationResponse, void>({
      query: () => ({
        url: "notifications/",
        method: "GET"
      }),
      providesTags: ['Notification']
    }),
    markNotificationAsRead: builder.mutation<{ success: boolean; message: string }, number>({
      query: (notificationId) => ({
        url: `notifications/${notificationId}/read`,
        method: "PATCH"
      }),
      invalidatesTags: ['Notification']
    }),
    markAllNotificationsAsRead: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "notifications/read-all",
        method: "PATCH"
      }),
      invalidatesTags: ['Notification']
    }),
    deleteNotification: builder.mutation<{ success: boolean; message: string }, number>({
      query: (notificationId) => ({
        url: `notifications/${notificationId}`,
        method: "DELETE"
      }),
      invalidatesTags: ['Notification']
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
} = notificationApi; 