import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "",
  }),
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (body) => ({
        url: "/checkout/create-session",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreateCheckoutSessionMutation } = purchaseApi;
