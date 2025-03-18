import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { prepareAuthHeaders } from "../../utils/api";

export interface PaymentMethod {
  id: number;
  userId: number;
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cardType: string;
  isDefault: boolean;
  lastFourDigits: string;
}

export interface PaymentMethodRequest {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
  isDefault?: boolean;
}

export interface PaymentMethodsResponse {
  success: boolean;
  data: PaymentMethod[];
  message?: string;
}

export interface SinglePaymentMethodResponse {
  success: boolean;
  data: PaymentMethod;
  message?: string;
}

export const paymentMethodsApi = createApi({
  reducerPath: "paymentMethods",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/',
    credentials: "include",
    prepareHeaders: prepareAuthHeaders,
  }),
  tagTypes: ['PaymentMethod'],
  endpoints: (builder) => ({
    getUserPaymentMethods: builder.query<PaymentMethodsResponse, void>({
      query: () => "payment/methods",
      providesTags: ['PaymentMethod']
    }),
    getPaymentMethod: builder.query<SinglePaymentMethodResponse, number>({
      query: (id) => `payment/methods/${id}`,
      providesTags: ['PaymentMethod']
    }),
    addPaymentMethod: builder.mutation<SinglePaymentMethodResponse, PaymentMethodRequest>({
      query: (data) => ({
        url: "payment/methods",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['PaymentMethod']
    }),
    updatePaymentMethod: builder.mutation<SinglePaymentMethodResponse, { id: number; data: Partial<PaymentMethodRequest> }>({
      query: ({ id, data }) => ({
        url: `payment/methods/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ['PaymentMethod']
    }),
    deletePaymentMethod: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `payment/methods/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['PaymentMethod']
    }),
    setDefaultPaymentMethod: builder.mutation<SinglePaymentMethodResponse, number>({
      query: (id) => ({
        url: `payment/methods/${id}/default`,
        method: "PUT",
      }),
      invalidatesTags: ['PaymentMethod']
    }),
  }),
});

export const {
  useGetUserPaymentMethodsQuery,
  useGetPaymentMethodQuery,
  useAddPaymentMethodMutation,
  useUpdatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
  useSetDefaultPaymentMethodMutation
} = paymentMethodsApi; 