import WebProduct from "../WebProduct";
import { useGetProductsQuery } from "../../../features/inventory/productSlice";
import { LoadingSpinner } from "../../ui/loading-spinner";

function BestSales() {
  const { data, error, isLoading } = useGetProductsQuery({ limit: 6 });

  if (isLoading)
    return (
      <div className="mt-14 flex items-center justify-center h-32">
        <LoadingSpinner size="md" />
      </div>
    );
  if (error) return <div className="mt-14">Error loading best sales</div>;
  if (!data?.products?.length) return null;

  return (
    <div className="mt-14">
      <p className="text-xl font-bold mb-4">Best sales for you</p>
      <section className="flex flex-nowrap overflow-auto">
        <style>
          {`
            section::-webkit-scrollbar {
              width: 0.1rem;
              height: 0.1rem;
            }
            section::-webkit-scrollbar-track {
              background: #f1f1f1;
            }
            section::-webkit-scrollbar-thumb {
              background: #888;
              border-radius: 10px;
            }
            section::-webkit-scrollbar-thumb:hover {
              background: #555;
            }
          `}
        </style>
        {data.products.map((product) => (
          <WebProduct
            id={product.id}
            key={product.id}
            name={product.name}
            imgUrl={product.cover || "https://picsum.photos/id/237/192"}
            description={product.summary || product.description || ""}
            reviews={product.reviews?.length || 0}
            price={Number(product.productSkus?.[0]?.price || 0)}
            rating={product.averageRating || 0}
            quantity={product.productSkus?.[0]?.quantity || 0}
          />
        ))}
      </section>
    </div>
  );
}

export default BestSales;
