import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import CartService from "../../features/cart/cartService";
import { useGetCartQuery } from "../../features/cart/cartApiSlice";
import { formatPrice, safeParseFloat } from "../../lib/utils";

interface CartProductProps {
  id: number;
  name: string;
  image: string;
  quantity: number;
  productSku: {
    id: number;
    price: string | number;
    quantity: number;
  };
  onQuantityChange: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

const CartProduct = ({
  id,
  name,
  image,
  quantity,
  productSku,
  onQuantityChange,
  onRemove,
}: CartProductProps) => {
  const [itemQuantity, setItemQuantity] = useState(quantity);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const calculateSubtotal = (
    price: string | number | null | undefined,
    qty: number,
  ) => {
    if (price === undefined || price === null) return 0;
    const priceAsNumber =
      typeof price === "string" ? parseFloat(price) : Number(price);
    return isNaN(priceAsNumber) ? 0 : priceAsNumber * qty;
  };

  useEffect(() => {
    setItemQuantity(quantity);
  }, [quantity]);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity > 0) {
      setIsUpdating(true);
      try {
        setItemQuantity(newQuantity);
        await CartService.updateQuantity(id, newQuantity);
        onQuantityChange(id, newQuantity);
      } catch (error) {
        console.error("Error updating quantity:", error);
        toast.error("Failed to update quantity. Please try again.");
        setItemQuantity(quantity);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleIncrement = () => {
    handleQuantityChange(itemQuantity + 1);
  };

  const handleDecrement = () => {
    if (itemQuantity > 1) {
      handleQuantityChange(itemQuantity - 1);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await CartService.removeFromCart(id);
      toast.success("Item removed from cart");
      onRemove(id);
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item. Please try again.");
      setIsRemoving(false);
    }
  };

  return (
    <div
      className={`group flex flex-col sm:flex-row items-center gap-4 p-4 mb-4 bg-white rounded-lg border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md ${isRemoving ? "opacity-0 scale-95" : "opacity-100"
        }`}
    >
      <div className="w-full sm:w-20 h-20 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex-1 flex flex-col sm:flex-row items-center sm:items-start gap-3">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Unit Price: {formatPrice(productSku?.price)}
          </p>
        </div>

        <div className="flex items-center">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
            <button
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleDecrement}
              disabled={itemQuantity <= 1 || isUpdating}
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <div className="w-10 h-8 text-center border-x border-gray-200 relative">
              {isUpdating && (
                <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center">
                  <div className="w-3 h-3 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                </div>
              )}
              <input
                type="number"
                className="w-full h-full text-center focus:outline-none text-sm"
                min={1}
                value={itemQuantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val >= 1) {
                    handleQuantityChange(val);
                  }
                }}
                disabled={isUpdating}
                aria-label="Quantity"
              />
            </div>
            <button
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleIncrement}
              disabled={isUpdating}
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div className="w-24 text-right">
          <p className="font-medium text-gray-900">
            {formatPrice(calculateSubtotal(productSku?.price, itemQuantity))}
          </p>
        </div>

        <button
          onClick={handleRemove}
          disabled={isRemoving}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Remove item"
        >
          {isRemoving ? (
            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Trash2 size={16} />
          )}
        </button>
      </div>
    </div>
  );
};

interface CheckoutProcessDetailsProps {
  total: string | number | null | undefined;
}

const CheckoutProcessDetails = ({ total }: CheckoutProcessDetailsProps) => {
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-6 max-w-md w-full">
      <h2 className="font-semibold text-xl mb-6 pb-2 border-b border-gray-100">
        Order Summary
      </h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <p className="text-gray-600">Subtotal</p>
          <span className="font-medium">{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-600">Shipping</p>
          <span className="text-green-600">Free</span>
        </div>
        {safeParseFloat(total) >= 10000 && (
          <div className="flex justify-between text-green-600">
            <p>Free Shipping Applied</p>
            <span>-{formatPrice(0)}</span>
          </div>
        )}
        <div className="pt-4 border-t border-dashed border-gray-200">
          <div className="flex justify-between">
            <p className="font-medium">Total</p>
            <span className="font-bold text-lg">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <Link
        to="/checkout"
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
      >
        Proceed to Checkout
        <ChevronRight className="h-4 w-4" />
      </Link>

      <div className="mt-6">
        <Link
          to="/explore"
          className="text-blue-600 hover:text-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

const Cart = () => {
  const { data: cartData, isLoading, error } = useGetCartQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error loading cart</div>
      </div>
    );
  }

  if (!cartData?.items?.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <ShoppingBag className="h-16 w-16 text-gray-400" />
        <h2 className="text-2xl font-semibold text-gray-900">
          Your cart is empty
        </h2>
        <p className="text-gray-500">
          Add some items to your cart to get started
        </p>
        <Link
          to="/explore"
          className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Shopping Cart</h1>
            <p className="text-gray-500">
              {cartData.items.length}{" "}
              {cartData.items.length === 1 ? "item" : "items"}
            </p>
          </div>

          <div className="space-y-4">
            {cartData.items.map((item) => (
              <CartProduct
                key={item.id}
                id={item.id}
                name={item.product?.name || ""}
                image={item.product?.cover || ""}
                quantity={item.quantity}
                productSku={
                  item.productSku || { id: 0, price: "0", quantity: 0 }
                }
                onQuantityChange={CartService.updateQuantity}
                onRemove={CartService.removeFromCart}
              />
            ))}
          </div>
        </div>

        <div className="lg:w-96">
          <CheckoutProcessDetails total={cartData.total} />
        </div>
      </div>
    </div>
  );
};

export default Cart;
