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
  productSkus: Array<ProductSku> | null;
  reviews?: Array<Review> | null;
  averageRating?: number | null;
}

interface ProductSku {
  id: number;
  sku: string;
  price: string;
  quantity: number;
  sizeAttribute: Attribute | null;
  colorAttribute: Attribute | null;
}

interface Attribute {
  value: string;
}

interface Review {
  id: number;
  rating: number;
  comment?: string | null;
  userId: number;
}

interface ProductResponse {
  message: string;
  products?: Product[];
  total?: number;
  page?: number;
  limit?: number;
}

interface ProductQueryParams {
  page?: number;
  limit?: number;
  categoryId?: number;
  search?: string;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/',
    credentials: "include",
  }),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, ProductQueryParams>({
      query: (params) => ({
        url: "products",
        method: "GET",
        params: {
          page: params?.page || 1,
          limit: params?.limit || 12,
          categoryId: params?.categoryId,
          search: params?.search
        }
      }),
      providesTags: ['Product']
    }),

    // Get single product
    getProduct: builder.query<Product, number>({
      query: (id) => ({
        url: `products/${id}`,
        method: "GET"
      }),
      providesTags: ['Product']
    }),

    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (product) => ({
        url: "products/with-skus",
        method: "POST",
        body: product
      }),
      invalidatesTags: ['Product']
    }),
    updateProduct: builder.mutation<Product, { id: number; product: Partial<Product> }>({
      query: ({ id, product }) => ({
        url: `products/${id}`,
        method: "PUT",
        body: product
      }),
      invalidatesTags: ['Product']
    }),

    // Delete product
    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `products/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ['Product']
    })
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation
} = productApi;
