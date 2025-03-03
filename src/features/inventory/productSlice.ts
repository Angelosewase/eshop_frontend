import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Product {
  id: number;
  name: string;
  description?: string | null;
  summary?: string | null;
  cover?: string | null;
  categoryId: number;
  category: {
    id: number;
    name: string;
  } | null;
  subCategories: Array<{
    id: number;
    name: string;
  }> | null;
  productSkus: Array<{
    id: number;
    sku: string;
    price: string;
    quantity: number;
    sizeAttribute: {
      value: string;
    } | null;
    colorAttribute: {
      value: string;
    } | null;
  }> | null;
  reviews?: Array<{
    id: number;
    rating: number;
    comment?: string | null;
    userId: number;
  }> | null;
  averageRating?: number | null;
}

export const productApi = createApi({
  reducerPath: "products",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000",
    credentials: "include",
  }),
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
    }),
    createProduct: builder.mutation({
      query: (productData :Partial<Product> ) => ({
        url: "/products",
        method: "POST",
        body:productData
      }),
    }),
  }),
});

export const { useCreateProductMutation, useGetProductsQuery} = productApi
