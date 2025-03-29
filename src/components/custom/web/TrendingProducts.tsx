import { useGetProductsQuery } from "../../../features/inventory/productSlice";

function TrendingProducts() {
  const { data, error, isLoading } = useGetProductsQuery({
    page: 3, // Get different products than BestSales and Popular
    limit: 2,
  });

  if (isLoading)
    return <div className="my-20">Loading trending products...</div>;
  if (error)
    return <div className="my-20">Error loading trending products</div>;
  if (!data?.products?.length) return null;

  return (
    <div className="my-20">
      <p className="text-xl font-bold mb-4">Trending products</p>
      <section className="flex flex-nowrap overflow-auto gap-8">
        {data.products.map((product) => (
          <TrendingProduct
            key={product.id}
            imgUrl={product.cover || "https://picsum.photos/1018/192"}
            name={product.name}
            price={Number(product.productSkus?.[0]?.price || 0)}
            description={product.summary || product.description || ""}
          />
        ))}
      </section>
    </div>
  );
}

export default TrendingProducts;

const TrendingProduct = ({
  imgUrl,
  name,
  description,
}: {
  imgUrl: string;
  name: string;
  price: number;
  description: string;
}) => {
  return (
    <div className="flex-1 h-[450px] border-gray-300 rounded-t-lg bg-[#D9D9D912]/20">
      <img
        src={imgUrl}
        alt={name}
        className="w-full h-[280px] object-cover rounded-t-lg"
      />
      <div className="my-4 px-4">
        <p className="text-2xl font-bold text-[#373F51]">{name}</p>
        <p className="text-md mt-2 text-[#5D6E8B]">{description}</p>
        <button className="bg-[#373F51] text-white px-4 py-2 rounded-lg mt-4">
          Shop now
        </button>
      </div>
    </div>
  );
};
