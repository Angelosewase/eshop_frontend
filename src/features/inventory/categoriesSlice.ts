import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Category } from "../../lib/types";

export const categoriesApi = createApi({
  reducerPath: "categories",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/categories",
    credentials: "include",
  }),
  tagTypes: ["Categories"],
  endpoints: (builder) => ({
    getCategories: builder.query<
      {
        success: boolean;
        data: Category[];
        total: number;
        message: string;
      },
      void
    >({
      query: () => "/",
      providesTags: ["Categories"],
    }),
    createCategory: builder.mutation({
      query: (categoryData: Partial<Category>) => ({
        url: "/",
        method: "POST",
        body: categoryData,
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const subCategoriesApi = createApi({
  reducerPath: "subCategories",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/subCategories",
  }),
  endpoints: (builder) => ({
    getSubCategories: builder.query({
      query: () => "/subCategories",
    }),
  }),
});

export const { useGetCategoriesQuery, useCreateCategoryMutation } =
  categoriesApi;
