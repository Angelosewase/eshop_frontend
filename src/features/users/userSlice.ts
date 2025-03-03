import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Customer } from "../../components/custom/tables/customers/columns";

export const usersApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/users",
    credentials: "include",
  }),
  reducerPath: "users",
  endpoints: (builder) => ({
    getCustomers: builder.query<
      { users: Array<Customer>; total: number; page: number; limit: number },
      void
    >({
      query: () => "/customers",
    }),
  }),
});

export const { useGetCustomersQuery } = usersApi;
