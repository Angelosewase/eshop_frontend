import { ArrowUpDown } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useState } from "react";
import { WebProduct } from "../../components/custom";

function Deal() {
  return (
    <div className="w-full mt-5">
      <div className="text-lg font-semibold">
        home /<span className="text-gray-500">products</span>
      </div>

      <div className="flex flex-1  gap-2 items-center justify-between mt-8">
        <DealsFilter />
        <DealsSortBy />
      </div>

      <ProductsDisplay />
    </div>
  );
}

export default Deal;

const DealsSortBy = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <ArrowUpDown className="w-4 h-4" />
          Sort By
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-10">
        <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span>Price: Low to High</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Price: High to Low</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Best Selling</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Top Rated</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span>New Arrivals</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Discounted</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const DealsFilter = () => {
  const [priceRange, setPriceRange] = useState(0);

  return (
    <div className="flex justify-between items-center gap-4 p-4 bg-white rounded shadow-lg">
      <div className="flex items-center gap-2">
        <label htmlFor="priceRange" className="text-gray-700 font-semibold">
          Price Range:
        </label>
        <input
          type="range"
          id="priceRange"
          min="0"
          max="1000"
          className="w-64 bg-[#373F51] text-[#373F51]"
          color="#373F51"
          onChange={(e) => setPriceRange(Number(e.target.value))}
        />
        <span className="text-gray-700 font-semibold w-20">
          {priceRange} RWF
        </span>
        <span className="text-gray-700 font-semibold">0 - 1000</span>
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="ratingFilter" className="text-gray-700 font-semibold">
          Rating:
        </label>
        <select id="ratingFilter" className="border p-2 rounded">
          <option value="">All</option>
          <option value="4">4+</option>
          <option value="3">3+</option>
          <option value="2">2+</option>
          <option value="1">1+</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="discountFilter" className="text-gray-700 font-semibold">
          Discount:
        </label>
        <select id="discountFilter" className="border p-2 rounded">
          <option value="">All</option>
          <option value="10">10%+</option>
          <option value="20">20%+</option>
          <option value="30">30%+</option>
          <option value="40">40%+</option>
          <option value="50">50%+</option>
        </select>
      </div>
      <button className="bg-[#373F51] hover:bg-[#373F51] text-white font-bold py-2 px-4 rounded">
        Apply Filters
      </button>
    </div>
  );
};


const products = [
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


const ProductsDisplay = () => {
return(  <div className="mt-14 ">
  <section className="flex  overflow-auto flex-wrap">
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
    {products.map((product) => (
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
</div>)
}
