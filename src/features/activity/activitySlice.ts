import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the activity item interface
export interface ActivityItem {
  id: number;
  action: string;
  user: string;
  time: string;
  amount: string | null;
  status: "pending" | "completed" | "cancelled" | "info";
}

// Create the activity API slice
export const activityApi = createApi({
  reducerPath: "activityApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:3000/",
    credentials: "include",
  }),
  tagTypes: ["Activity"],
  endpoints: (builder) => ({
    getRecentActivity: builder.query<ActivityItem[], void>({
      query: () => "/activity/recent",
      providesTags: ["Activity"],
    }),
    getAllActivity: builder.query<ActivityItem[], void>({
      query: () => "/activity",
      providesTags: ["Activity"],
    }),
    getActivityByUser: builder.query<ActivityItem[], number>({
      query: (userId) => `/activity/user/${userId}`,
      providesTags: (_, __, userId) => [
        { type: "Activity", id: userId },
      ],
    }),
    getActivityByStatus: builder.query<ActivityItem[], string>({
      query: (status) => `/activity/status/${status}`,
      providesTags: (_, __, status) => [
        { type: "Activity", id: status },
      ],
    }),
  }),
});

// Export the generated hooks
export const {
  useGetRecentActivityQuery,
  useGetAllActivityQuery,
  useGetActivityByUserQuery,
  useGetActivityByStatusQuery,
} = activityApi;
