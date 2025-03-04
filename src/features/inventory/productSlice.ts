import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product } from "../../lib/types";
import { productFullData } from "../../components/custom/modals/AddInventoryItem";

export const productApi = createApi({
  reducerPath: "products",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000",
    credentials: "include",
  }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    getProducts: builder.query<
      {
        products: Product[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      },
      void
    >({
      query: () => "/products",
      providesTags: ["Products"],
    }),
    createProduct: builder.mutation({
      query: (productData: productFullData) => ({
        url: "/products",
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const { useCreateProductMutation, useGetProductsQuery } = productApi;

export const productAttributesApi = createApi({
  reducerPath: "productAttributes",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/product-attributes",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getAttributes: builder.query<
      {
        attributes: Array<{
          id: number;
          name: string;
        }>;
      },
      void
    >({
      query: () => "/",
    }),
  }),
});
