import React, { useEffect } from "react";
import { WebProduct } from "../../components/custom";
import { MinusIcon, PlusIcon, RotateCcw, Star, Truck } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Product 1",
    price: 100,
    image: "https://picsum.photos/237/192",
    description: "Product 1 description",
    reviews: 200,
    rating: {
      stars: 4,
      count: 100,
    },
    quantity: 1,
  },
];

const ProductDetails = () => {
  const [quantity, setQuantity] = React.useState(1);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="flex   gap-10   mt-10">
        {/* other product images div  in  vertical column */}
        <div className="flex flex-col gap-4 w-[12%] ">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div
                className="flex items-center justify-center shadow flex-1"
                key={index}
              >
                <img
                  src={products[0].image}
                  alt="product image"
                  className="w-20 h-20"
                />
              </div>
            ))}
        </div>

        <div className="flex items-center justify-center shadow  w-1/2">
          <img src={products[0].image} alt="product image" className="w-72" />
        </div>

        {/* product description div */}
        <div className="flex-1">
          <h2 className="text-2xl">{products[0].name}</h2>
          <div>
            <div className="mb-2">
              {Array(products[0].rating.stars)
                .fill(0)
                .map((_, index) => (
                  <Star
                    key={index}
                    className="h-5 w-5 text-yellow-500 inline-block mr-1"
                  />
                ))}
              <span className="text-xs text-gray-500 mr-2">
                ({products[0].rating.count} reviews)
              </span>
              <span className="text-xs text-green-500">| In stock</span>
            </div>
            <span className="text-2xl font-bold">
              ${(products[0].price / 100).toFixed(2)}
            </span>
          </div>
          {/* description div */}
          <div className=" ">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione
              illum unde ex porro asperiores minus fugiat ipsa fuga, esse quasi
              explicabo dicta possimus incidunt. Quisquam recusandae magnam
              omnis cumque a.
            </p>
            <hr className="mt-4" />
          </div>
          {/* colors */}
          <div>
            <span>colors</span>
            <button className="w-4 h-4 rounded-full mx-1 my-3 bg-[#373F51] "></button>
            <button className="w-4 h-4 rounded-full mx-1 my-3 bg-green-500 "></button>
          </div>
          {/* sizes */}
          <div>
            <span className="mr-2">Size :</span>
            {["XS", "X", "M", "L", "XL"].map((size) => (
              <button
                key={size}
                className="rounded border-2 mx-1 py-1 px-2 text-xs border-gray-400 hover:bg-[#373F51] hover:text-white hover:border-none"
              >
                {size}
              </button>
            ))}
          </div>

          <div className="mt-3 flex flex-col lg:flex-row w-[85%] justify-between items-center">
            <div className="  flex mt-1 bg-gray-150  rounded  text-base  w-56  items-center justify-between border border-[#373F51] ">
              <button
                className=" rounded-l py-4 text-base h-6 w-16 flex items-center justify-center text-white bg-[#373F51] "
                onClick={() => {
                  setQuantity((prev) => prev + 1);
                }}
              >
                <PlusIcon className="w-5 h-5" />
              </button>
              <span className="text-2xl flex items-center justify-center mx-4 -mt-1">
                {quantity}
              </span>
              <button
                className=" rounded-r text-3xl h-6 w-16 flex items-center justify-center text-white bg-[#373F51] py-4"
                onClick={() => {
                  setQuantity((prev) => (prev !== 0 ? prev - 1 : 0));
                }}
              >
                <MinusIcon className="w-5 h-5" />
              </button>
            </div>
            <button className="bg-[#373F51]  h-[34px] rounded px-8 text-white">
              Purchase
            </button>
          </div>

          {/* delivery options */}
          <div className="mt-4 w-7/12 border-2 rounded p-2">
            <div className="flex  p-2">
              <Truck className="w-8" />

              <div className="ml-3">
                <h3 className="text-sm">Free delivery</h3>
                <p className="text-xs underline font-bold">
                  Enter your postal code for deliver availability
                </p>
              </div>
            </div>
            <hr />
            <div className="flex  p-2">
              <RotateCcw className="w-8" />
              <div className="ml-3">
                <h3 className="text-sm">Return Delivery</h3>
                <p className="text-xs underline font-bold">
                  Free 30 days delivery return. Details
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className=" mt-10">
          <div className="flex justify-between items-center mb-6 mt-10">
            <div className="flex gap-2 items-center">
              <p className="font-semibold text-2xl">Related items</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:flex">
            <WebProduct
              imgUrl="https://picsum.photos/237/192"
              name="Product 1"
              price={100}
              quantity={1}
              description="Product 1 description"
              reviews={200}
              rating={4}
              id={1}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
