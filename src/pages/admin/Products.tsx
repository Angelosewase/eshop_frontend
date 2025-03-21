import React from "react";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../features/inventory/productSlice";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "../../components/ui/loading-spinner";

export default function Products() {
  const [page, setPage] = React.useState(1);
  const limit = 10;

  const { data, error, isLoading } = useGetProductsQuery({ page, limit });
  const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(Number(id)).unwrap();
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <LoadingSpinner size="lg" />
      </div>
    );
  if (error) return <div>Error loading products</div>;

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          to="/admin/products/new"
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Add New Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.products?.map((product) => (
          <div key={product.id} className="border p-4 rounded">
            <img
              src={product.cover || "/placeholder.png"}
              alt={product.name}
              className="w-full h-48 object-cover mb-2"
            />
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600">{product.summary}</p>

            <div className="mt-4 flex justify-between items-center">
              <div className="space-x-2">
                <Link
                  to={`/admin/products/${product.id}`}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(product.id.toString())}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
              <span className="text-gray-500">
                ${product.productSkus?.[0]?.price || "N/A"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!data?.products?.length}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
