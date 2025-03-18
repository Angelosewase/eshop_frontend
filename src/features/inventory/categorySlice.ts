import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Category {
  id: number;
  name: string;
  description?: string | null;
  subCategories?: SubCategory[];
}

interface SubCategory {
  id: number;
  name: string;
  description?: string | null;
  categoryId: number;
}

interface CategoryResponse {
  message: string;
  categories?: Category[];
  total?: number;
  page?: number;
  limit?: number;
}

interface CategoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface CategoryApiResponse {
  success: boolean;
  data: Category[];
  total: number;
  message: string;
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/';

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    credentials: "include",
  }),
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => {
        const endpoint = 'categories';
        return {
          url: endpoint,
          method: "GET"
        };
      },
      transformResponse: (response: CategoryApiResponse) => {
        return response.data;
      },
      transformErrorResponse: (error) => {
        return error;
      },
      providesTags: ['Category']
    }),

    getCategory: builder.query<CategoryResponse, number>({
      query: (id) => `categories/${id}`,
      providesTags: ['Category']
    }),

    createCategory: builder.mutation<CategoryResponse, Partial<Category>>({
      query: (data) => ({
        url: "categories",
        method: "POST",
        body: data
      }),
      invalidatesTags: ['Category']
    }),

    updateCategory: builder.mutation<CategoryResponse, { id: number; data: Partial<Category> }>({
      query: ({ id, data }) => ({
        url: `categories/${id}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: ['Category']
    }),
    deleteCategory: builder.mutation<CategoryResponse, number>({
      query: (id) => ({
        url: `categories/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ['Category']
    })
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} = categoryApi; 