import { Heart, ShoppingCart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/Reduxhooks";
import { toast } from "sonner";
import { MouseEvent } from "react";
import CartService from "../../features/cart/cartService";

interface Props {
  id: number;
  name: string;
  imgUrl: string;
  description: string;
  reviews: number;
  price: number;
  rating: number;
  quantity?: number;
  defaultSkuId?: number; // Default SKU ID for the product
}

function WebProduct({
  id,
  name,
  imgUrl,
  description,
  reviews,
  price,
  rating,
  quantity = 0,
  defaultSkuId,
}: Props) {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent navigation to product page

    if (quantity <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    if (!defaultSkuId) {
      // If the product requires SKU selection, redirect to product details
      navigate(`/product/${id}`);
      toast.info("Please select product options");
      return;
    }

    try {
      await CartService.addToCart(
        id,
        1, // Default quantity
        defaultSkuId // Must have a valid SKU ID
      );

      toast.success(`${name} added to cart!`);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("Failed to add item to cart. Please try again.");
    }
  };

  const handleBuyNow = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent navigation to product page

    if (quantity <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    if (!defaultSkuId) {
      // If the product requires SKU selection, redirect to product details
      navigate(`/product/${id}`);
      toast.info("Please select product options");
      return;
    }

    try {
      await CartService.addToCart(
        id,
        1, // Default quantity
        defaultSkuId // Must have a valid SKU ID
      );

      navigate('/checkout');
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("Failed to add item to cart. Please try again.");
    }
  };

  return (
    <div className="max-w-xs rounded bg-white min-w-[23.86%] mr-4 mb-8" onClick={handleProductClick}>
      {/* Image Section */}
      <div className="relative rounded-md overflow-hidden">
        <img
          src={imgUrl}
          alt={name}
          className="w-full h-[300px] object-cover"
        />
        <button
          className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-200"
          onClick={(e) => e.stopPropagation()} // Prevent navigation when clicking the heart
        >
          <Heart className="h-5 w-5 text-gray-500" />
        </button>
        {quantity <= 0 && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="mt-2 px-4 py-1 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 truncate">
            {name}
          </h3>
          <p className="text-sm text-gray-500 truncate">{description}</p>

          {/* reviews */}
          <div className="flex items-center mt-1">
            {Array(Math.floor(rating))
              .fill(0)
              .map((_, index) => (
                <Star key={index} className="h-3 w-3 text-yellow-500" />
              ))}
            {Array(5 - Math.floor(rating))
              .fill(0)
              .map((_, index) => (
                <Star key={index} className="h-3 w-3 text-gray-300" />
              ))}
            <span className="ml-2 text-sm text-gray-600">({reviews})</span>
          </div>
        </div>
        <span className="text-lg font-semibold text-gray-800">${price.toFixed(2)}</span>
      </div>
      <div className="flex items-center justify-between px-4 pb-3 pt-1">
        <button
          className={`px-4 py-2 text-sm rounded-lg flex items-center gap-1 ${quantity > 0
            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          onClick={handleAddToCart}
          disabled={quantity <= 0}
        >
          <ShoppingCart size={16} />
          Add to cart
        </button>
        <button
          className={`px-4 py-2 text-sm rounded-lg font-semibold ${quantity > 0
            ? 'bg-black text-white hover:bg-gray-800'
            : 'bg-gray-700 text-gray-300 cursor-not-allowed'
            }`}
          onClick={handleBuyNow}
          disabled={quantity <= 0}
        >
          Buy
        </button>
      </div>
    </div>
  );
}

export default WebProduct;
