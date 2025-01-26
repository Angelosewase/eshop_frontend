interface Props {
  id: number;
  name: string;
  imgUrl: string;
  description: string;
  reviews: number;
  price: number;
  rating: number;
  quantity?: number;
}

import { Heart, Star } from "lucide-react";

function WebProduct({
  name,
  imgUrl,
  description,
  reviews,
  price,
  rating,
}: Props) {
  return (
    <div className="max-w-xs rounded-2xl   bg-white min-w-[30%] mr-4 mb-8  ">
      {/* Image Section */}
      <div className="relative rounded-2xl overflow-hidden">
        <img
          src={imgUrl} // Replace with your image source
          alt="Product"
          className="w-full h-[300px] object-cover"
        />
        <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-200">
          <Heart className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Product Details */}
      <div className="mt-2 px-4 py-1 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 truncate">
            {name}
          </h3>
          <p className="text-sm text-gray-500">{description}</p>

          {/* reviews */}
          <div className="flex items-center mt-1">
            {Array(rating)
              .fill(0)
              .map((_, index) => (
                <Star key={index} className="h-3 w-3 text-yellow-500" />
              ))}
            <Star className="h-3 w-3 text-gray-300" />
            <span className="ml-2 text-sm text-gray-600">({reviews})</span>
          </div>
        </div>
        <span className="text-lg font-semibold text-gray-800">{price} FRW</span>
        {/* Price and Actions */}
      </div>
      <div className=" flex items-center justify-between px-4 ">
        <button className="px-4 py-1 text-sm bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">
          Add to cart
        </button>
        <button className="px-4 py-1 text-sm bg-black text-white rounded-xl">
          Buy
        </button>
      </div>
    </div>
  );
}

export default WebProduct;
