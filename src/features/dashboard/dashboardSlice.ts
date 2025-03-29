import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalDeals: number;
  totalCustomers: number;
}

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    credentials: "include",
  }),
  tagTypes: ["Dashboard"],
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => {
        const endpoint = "admin/stats";
        return {
          url: endpoint,
          method: "GET",
        };
      },
      transformResponse: (response: DashboardStats) => {
        return response;
      },
      transformErrorResponse: (error) => {
        console.error("Dashboard API Error:", error);
        return error;
      },
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
