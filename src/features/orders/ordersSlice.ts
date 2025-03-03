import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
  items: unknown;
  payment: unknown;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productsSkuId: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product: unknown;
  productSku: unknown;
}

export const orderApi = createApi({
  reducerPath: "orders",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000",
    credentials: "include",
  }),

  endpoints: (builder) => ({
    getOrders: builder.query<
      {
        success: boolean;
        data: OrderDetails[];
        total: number;
        message?: string;
      },
      void
    >({
      query: () => "/orders",
    }),
    getOrder: builder.query<{ success: boolean; data: OrderDetails }, void>({
      query: (id) => `/orders/${id}`,
    }),
    createOrder: builder.mutation({
      query: (data) => ({
        url: "/orders",
        method: "POST",
        body: data,
      }),
    }),
    updateOrder: builder.mutation({
      query: (data) => ({
        url: `/orders/${data.id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});


export const { useCreateOrderMutation, useGetOrdersQuery, useUpdateOrderMutation, useGetOrderQuery } = orderApi;