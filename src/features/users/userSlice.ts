import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Customer } from "../../components/custom/tables/customers/columns";
import { prepareAuthHeaders } from "../../utils/api";

interface User {
  id: number;
  email: string | null;
  phoneNumber: string | null;
  firstName: string | null;
  lastName: string | null;
  role: 'USER' | 'ADMIN';
}

// The API returns the user data directly, not wrapped in a message
type UserResponse = User;

interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/',
    credentials: "include",
    prepareHeaders: prepareAuthHeaders,
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getCurrentUser: builder.query<UserResponse, void>({
      query: () => ({
        url: "users/me",
        method: "GET"
      }),
      providesTags: ['User']
    }),
    updateUser: builder.mutation<UserResponse, { id: number; data: UpdateUserRequest }>({
      query: ({ id, data }) => ({
        url: `users/${id}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: ['User']
    }),
    getCustomers: builder.query<
      { users: Array<Customer>; total: number; page: number; limit: number },
      void
    >({
      query: () => "users/customers",
      providesTags: ['User']
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useUpdateUserMutation,
  useGetCustomersQuery
} = userApi;
