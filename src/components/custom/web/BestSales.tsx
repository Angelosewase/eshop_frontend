import WebProduct from "../WebProduct";

const BestSalesProduct = [
  {
    id: 1,
    name: "Product 1",
    price: 100,
    imgUrl: "https://picsum.photos/id/237/192",
    description: "Product 1 description",
    reviews: 200,
    rating: 4,
    quantity: 1,
  },
  {
    id: 2,
    name: "Product 2",
    price: 200,
    imgUrl: "https://picsum.photos/id/1015/192",
    description: "Product 2 description",
    reviews: 300,
    rating: 3,
    quantity: 1,
  },
  {
    id: 3,
    name: "Product 3",
    price: 300,
    imgUrl: "https://picsum.photos/id/1016/192",
    description: "Product 3 description",
    reviews: 400,
    rating: 5,
    quantity: 1,
  },
  {
    id: 4,
    name: "Product 4",
    price: 400,
    imgUrl: "https://picsum.photos/1016/192",
    description: "Product 4 description",
    reviews: 500,
    rating: 4,
    quantity: 1,
  },
  {
    id: 5,
    name: "Product 5",
    price: 500,
    imgUrl: "https://picsum.photos/id/1018/192",
    description: "Product 5 description",
    reviews: 600,
    rating: 3,
    quantity: 1,
  },
  {
    id: 6,
    name: "Product 6",
    price: 600,
    imgUrl: "https://picsum.photos/id/1019/150",
    description: "Product 6 description",
    reviews: 700,
    rating: 5,
    quantity: 1,
  },
];

function BestSales() {
  return (
    <div className="mt-14 ">
      <p className="text-xl font-bold mb-4 ">Best sales for you</p>
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
        {BestSalesProduct.map((product) => (
          <WebProduct
            id={product.id}
            key={product.id}
            name={product.name}
            imgUrl={product.imgUrl}
            description={product.description}
            reviews={product.reviews}
            price={product.price}
            rating={product.rating}
            quantity={product.quantity}
          />
        ))}
      </section>
    </div>
  );
}

export default BestSales;
