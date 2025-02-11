const trendingProducts = [
  {
    id: 1,
    name: "Product 1",
    price: 100,
    imgUrl: "https://picsum.photos/1018/192",
    description: "Product 1 description",
  },
  {
    id: 2,
    name: "Product 2",
    price: 200,
    imgUrl: "https://picsum.photos/1019/150",
    description: "Product 2 description",
  },
];

function TrendingProducts() {
  return (
    <div className="my-20 ">
      <p className="text-xl font-bold mb-4 ">Trending products</p>
      <section className="flex flex-nowrap overflow-auto gap-8"> 
        {trendingProducts.map((product) => (
          <TrendingProduct key={product.id} {...product} />
        ))}
      </section>
    </div>
  );
}

export default TrendingProducts;

const TrendingProduct = ({
  imgUrl,
  name,
  price,
  description,
}: {
  imgUrl: string;
  name: string;
  price: number;
  description: string;
}) => {
  return (
    <div className=" flex-1   h-[450px]  border-gray-300 rounded-t-lg bg-[#D9D9D912]/20 ">
      <img src={imgUrl} alt="" className="w-full h-[280px] object-cover rounded-t-lg" />
      <div className=" my-4 px-4">
        <p className="text-2xl font-bold text-[#373F51]">{name}</p>
        <p className="text-md  mt-2 text-[#5D6E8B]">{description}</p>
      <button className="bg-[#373F51] text-white px-4 py-2 rounded-lg mt-4 ">Shop now</button>
      </div>
    </div>
  );
};
