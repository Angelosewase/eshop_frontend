import { useState } from "react";
import { ScrollArea, ScrollBar } from "../../components/ui/scroll-area";
import { Button } from "../../components/ui/button";
import { WebProduct } from "../../components/custom";
import { useGetProductsQuery } from "../../features/inventory/productSlice";
import {
  useGetCategoriesQuery,
  Category,
} from "../../features/inventory/categorySlice";

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    undefined,
  );
  const [page, setPage] = useState(1);
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data, isLoading } = useGetProductsQuery({
    page,
    limit: 12,
    categoryId: selectedCategory,
  });

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const products = data?.products || [];
  const categories = categoriesData || [];
  const totalPages = Math.ceil((data?.total || 0) / (data?.limit || 12));

  return (
    <div>
      <div className="space-y-6 py-6">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max space-x-4 p-2">
            <Button
              variant={selectedCategory === undefined ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setSelectedCategory(undefined)}
            >
              All
            </Button>
            {categories.map((category: Category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                className="rounded-full"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <div>
          <h2 className="text-2xl font-semibold mb-6">
            {selectedCategory === undefined
              ? "All Products"
              : categories.find((c: Category) => c.id === selectedCategory)
                  ?.name}
          </h2>

          {products.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No products found
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="flex justify-center">
                    <WebProduct
                      id={product.id}
                      description={
                        product.description || "No description available"
                      }
                      imgUrl={product.cover || "/placeholder.jpg"}
                      name={product.name}
                      price={Number(product.productSkus?.[0]?.price) || 0}
                      reviews={product.reviews?.length || 0}
                      rating={product.averageRating || 0}
                      quantity={product.productSkus?.[0]?.quantity || 0}
                    />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
