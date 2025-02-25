import { useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "../../components/ui/scroll-area";
import { Button } from "../../components/ui/button";
import { WebProduct } from "../../components/custom";

const categories = [
  "All",
  "Electronics",
  "Clothing",
  "Books",
  "Home & Garden",
  "Sports",
  "Toys",
  "Beauty",
  "Automotive",
];

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

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // TODO: Replace with actual API call
  useEffect(() => {}, [selectedCategory]);

  return (
    <div>
      <div className="space-y-6 py-6">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max space-x-4 p-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <div>
          <h2 className="text-2xl font-semibold mb-6">
            {selectedCategory === "All" ? "All Products" : selectedCategory}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {BestSalesProduct.map((product) => (
              <WebProduct
                id={product.id}
                key={product.id}
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                imgUrl={product.imgUrl as string}
                name={product.name}
                price={product.price}
                reviews={product.reviews}
                rating={product.rating}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
