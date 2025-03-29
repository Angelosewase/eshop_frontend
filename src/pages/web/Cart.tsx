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

const CartProduct = ({
  id,
  image,
  name,
  productSku,
  quantity,
}: {
  id: number;
  image: string;
  name: string;
  productSku: {
    id: number;
    price: string | number;
    quantity: number;
  };
  quantity: number;
  productSkuId?: number;
}) => {
  const [itemQuantity, setItemQuantity] = useState(quantity);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Format price for display - converts cents to dollars with safety checks
  const formatPrice = (cents: string | number | null | undefined) => {
    if (cents === undefined || cents === null) return "$0.00";
    const amount =
      typeof cents === "string" ? parseFloat(cents) : Number(cents);
    if (isNaN(amount)) return "$0.00";
    const dollars = amount / 100;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(dollars);
  };

  // Calculate subtotal with proper type conversion and safety checks
  const calculateSubtotal = (
    price: string | number | null | undefined,
    qty: number
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
      } catch (error) {
        console.error("Error updating quantity:", error);
        toast.error("Failed to update quantity. Please try again.");
        // Revert to previous quantity
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
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item. Please try again.");
      setIsRemoving(false);
    }
  };

  return (
    <div
      className={`group flex flex-col sm:flex-row items-center gap-4 p-4 mb-4 bg-white rounded-lg border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md ${
        isRemoving ? "opacity-0 scale-95" : "opacity-100"
      }`}
    >
      {/* Product Image */}
      <div className="w-full sm:w-20 h-20 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col sm:flex-row items-center sm:items-start gap-3">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Unit Price: {formatPrice(productSku?.price)}
          </p>
        </div>

        {/* Quantity Controls */}
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

        {/* Subtotal */}
        <div className="w-24 text-right">
          <p className="font-medium text-gray-900">
            {formatPrice(calculateSubtotal(productSku?.price, itemQuantity))}
          </p>
        </div>

        {/* Remove Button */}
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

const Cart = () => {
  const [isClearing, setIsClearing] = useState(false);
  const { data: cartData, isLoading, refetch } = useGetCartQuery();



  // Format price for display - converts cents to dollars with safety checks
  const formatPrice = (cents: string | number | null | undefined) => {
    if (cents === undefined || cents === null) return "$0.00";
    const amount =
      typeof cents === "string" ? parseFloat(cents) : Number(cents);
    if (isNaN(amount)) return "$0.00";
    const dollars = amount / 100;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(dollars);
  };
  useEffect(() => {
    const fetchCart = async () => {
      try {
        console.log("Fetching cart in Cart component");
        await CartService.initializeCart();
        refetch();
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCart();
  }, [refetch]);

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      setIsClearing(true);
      try {
        await CartService.clearCart();
        toast.success("Cart cleared successfully");
      } catch (error) {
        console.error("Error clearing cart:", error);
        toast.error("Failed to clear cart. Please try again.");
      } finally {
        setIsClearing(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <ShoppingBag className="mr-2" /> Your Cart
      </h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : !cartData || cartData.items.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <div className="flex justify-center mb-4">
            <ShoppingBag size={64} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm p-1 mb-4">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="font-semibold text-lg">
                  Cart Items ({cartData.items.length})
                </h2>
                <button
                  onClick={handleClearCart}
                  disabled={isClearing}
                  className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center"
                >
                  {isClearing ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full mr-2"></div>
                      Clearing...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} className="mr-1" /> Clear Cart
                    </>
                  )}
                </button>
              </div>

              {cartData.items.map((item) => (
                <CartProduct
                  key={item.id}
                  id={item.id}
                  name={item.product.name}
                  image={item.product.cover}
                  productSku={item.productSku}
                  quantity={item.quantity}
                  productSkuId={item.productsSkuId}
                />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="font-semibold text-lg mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartData?.total)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(cartData?.total)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                Proceed to Checkout <ChevronRight size={16} className="ml-1" />
              </Link>

              <Link
                to="/explore"
                className="w-full mt-3 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <ArrowLeft size={16} className="mr-1" /> Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
