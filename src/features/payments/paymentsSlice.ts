import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Payment {
  id: number;
  orderId: number;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: 'credit_card' | 'paypal' | 'bank_transfer' | 'other';
  createdAt: string;
  updatedAt: string;
  customerName: string;
  customerEmail: string;
  transactionId: string;
}

export interface PaymentMethod {
  id: number;
  userId: number;
  type: 'credit_card' | 'paypal' | 'bank_account';
  provider: string;
  lastFour: string;
  expiryDate?: string;
  isDefault: boolean;
  createdAt: string;
}

export interface PaymentItem {
  id: number;
  orderId: number;
  amount: string;
  method: string;
  status: string;
  date: string;
  customer: string;
}

export const paymentsApi = createApi({
  reducerPath: "paymentsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/',
    credentials: 'include',
  }),
  tagTypes: ["Payments", "PaymentMethods"],
  endpoints: (builder) => ({
    // Get all payments with optional filtering
    getPayments: builder.query<Payment[], { status?: string; startDate?: string; endDate?: string; search?: string }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.status) queryParams.append('status', params.status);
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        if (params.search) queryParams.append('search', params.search);

        return {
          url: `payments?${queryParams.toString()}`
        };
      },
      providesTags: ["Payments"]
    }),

    // Get a single payment by ID
    getPayment: builder.query<Payment, number>({
      query: (id) => `payments/${id}`,
      providesTags: (result, error, id) => [{ type: "Payments", id }]
    }),

    // Update payment status
    updatePaymentStatus: builder.mutation<Payment, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `payments/${id}/status`,
        method: "PATCH",
        body: { status }
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Payments", id },
        "Payments"
      ]
    }),

    // Process refund
    processRefund: builder.mutation<Payment, { id: number; amount?: number }>({
      query: ({ id, amount }) => ({
        url: `payments/${id}/refund`,
        method: "POST",
        body: amount ? { amount } : {}
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Payments", id },
        "Payments"
      ]
    }),

    // Get payment methods for a user
    getUserPaymentMethods: builder.query<PaymentMethod[], number>({
      query: (userId) => `users/${userId}/payment-methods`,
      providesTags: ["PaymentMethods"]
    }),

    // Add a payment method
    addPaymentMethod: builder.mutation<PaymentMethod, Partial<PaymentMethod>>({
      query: (paymentMethod) => ({
        url: `payment-methods`,
        method: "POST",
        body: paymentMethod
      }),
      invalidatesTags: ["PaymentMethods"]
    }),

    // Delete a payment method
    deletePaymentMethod: builder.mutation<void, number>({
      query: (id) => ({
        url: `payment-methods/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["PaymentMethods"]
    }),

    // Set default payment method
    setDefaultPaymentMethod: builder.mutation<void, number>({
      query: (id) => ({
        url: `payment-methods/${id}/default`,
        method: "PATCH"
      }),
      invalidatesTags: ["PaymentMethods"]
    }),

    getRecentPayments: builder.query<PaymentItem[], void>({
      query: () => '/payments/recent',
      providesTags: ['Payments'],
    }),
    getAllPayments: builder.query<PaymentItem[], void>({
      query: () => '/payments',
      providesTags: ['Payments'],
    }),
    getPaymentById: builder.query<PaymentItem, number>({
      query: (id) => `/payments/${id}`,
      providesTags: (result, error, id) => [{ type: 'Payments', id }],
    }),
    getPaymentsByOrderId: builder.query<PaymentItem[], number>({
      query: (orderId) => `/payments/order/${orderId}`,
      providesTags: (result, error, orderId) => [{ type: 'Payments', id: `order-${orderId}` }],
    }),
    getPaymentsByStatus: builder.query<PaymentItem[], string>({
      query: (status) => `/payments/status/${status}`,
      providesTags: (result, error, status) => [{ type: 'Payments', id: `status-${status}` }],
    }),
  })
});

export const {
  useGetPaymentsQuery,
  useGetPaymentQuery,
  useUpdatePaymentStatusMutation,
  useProcessRefundMutation,
  useGetUserPaymentMethodsQuery,
  useAddPaymentMethodMutation,
  useDeletePaymentMethodMutation,
  useSetDefaultPaymentMethodMutation,
  useGetRecentPaymentsQuery,
  useGetAllPaymentsQuery,
  useGetPaymentByIdQuery,
  useGetPaymentsByOrderIdQuery,
  useGetPaymentsByStatusQuery,
} = paymentsApi; 