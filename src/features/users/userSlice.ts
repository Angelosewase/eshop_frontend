import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Customer } from "../../components/custom/tables/customers/columns";
import { prepareAuthHeaders } from "../../utils/api";
import { toast } from "sonner";

interface User {
  id: number;
  email: string | null;
  phoneNumber: string | null;
  firstName: string | null;
  lastName: string | null;
  role: "USER" | "ADMIN";
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
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/",
    credentials: "include",
    prepareHeaders: (headers) => prepareAuthHeaders(headers),
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getCurrentUser: builder.query<UserResponse, void>({
      query: () => ({
        url: "users/me",
        method: "GET",
      }),
      providesTags: ["User"],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            userApi.util.updateQueryData(
              "getCurrentUser",
              undefined,
              () => data,
            ),
          );
        } catch (error) {
          console.error("error fetching current user: ", error);
          toast.error("Error fetching current user");
        }
      },
    }),
    updateUser: builder.mutation<
      UserResponse,
      { id: number; data: UpdateUserRequest }
    >({
      query: ({ id, data }) => ({
        url: `users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getCustomers: builder.query<
      { users: Array<Customer>; total: number; page: number; limit: number },
      void
    >({
      query: () => "users/customers",
      providesTags: ["User"],
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useUpdateUserMutation,
  useGetCustomersQuery,
} = userApi;
