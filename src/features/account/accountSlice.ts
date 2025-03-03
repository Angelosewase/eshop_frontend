import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const accountApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/users",
    credentials: "include",
  }),
  reducerPath: "account",
  endpoints: (builder) => ({
    getAccount: builder.query<
      {
        id: number;
        email: string | null;
        phoneNumber?: string | null;
        firstName?: string | null;
        lastName?: string | null;
      },
      void
    >({
      query: () => "/me",
    }),
  }),
});

export const { useGetAccountQuery } = accountApi;
