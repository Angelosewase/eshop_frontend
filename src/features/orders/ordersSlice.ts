import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store/store";

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    image: string;
  };
}

export interface OrderDetails {
  id: number;
  userId: number;
  paymentId: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: number;
    email: string;
  };
  items: OrderItem[];
  payment: {
    status: "paid" | "pending" | "cancelled" | "refunded";
  };
}

export interface Order {
  id: number;
  total: string;
  createdAt: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  payment?: {
    status: string;
  };
  user: {
    name: string;
    email: string;
  };
}

interface OrderResponse {
  orders: Order[];
}

interface SingleOrderResponse {
  success: boolean;
  data: OrderDetails;
}

export const orderApi = createApi({
  reducerPath: "orders",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    getOrders: builder.query<OrderResponse, void>({
      query: () => "orders",
      providesTags: ["Order"],
    }),
    getUserOrders: builder.query<OrderResponse, void>({
      query: () => "orders/user",
      providesTags: ["Order"],
    }),
    getOrder: builder.query<SingleOrderResponse, number>({
      query: (id) => `orders/${id}`,
      providesTags: ["Order"],
    }),
    createOrder: builder.mutation<OrderResponse, any>({
      query: (data) => ({
        url: "orders",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),
    updateOrder: builder.mutation<OrderResponse, { id: number; data: any }>({
      query: ({ id, data }) => ({
        url: `orders/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetUserOrdersQuery,
  useUpdateOrderMutation,
  useGetOrderQuery,
} = orderApi;
