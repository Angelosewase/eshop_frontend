import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppSelector } from "../../hooks/Reduxhooks";
import {
  selectCartItems
} from "../../features/cart/cartSlice";
import { useCreateOrderMutation } from "../../features/orders/ordersSlice";
import { toast } from "sonner";
import CartService from "../../features/cart/cartService";
import { useGetCartQuery } from "../../features/cart/cartApiSlice";
import { formatPrice, safeParseFloat } from "../../lib/utils";
import {
  CreditCard,
  Truck,
  AlertCircle,
  Plus,
  ChevronRight,
  ArrowLeft,
  User,
  MapPin,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { selectUser } from "../../features/auth/authSlice";

interface CartItem {
  id: number;
  product: {
    name: string;
  };
  productSku: {
    price: string | number;
  };
  quantity: number;
}

interface CartData {
  items: CartItem[];
  total: number;
}

interface OrderSummaryProps {
  cartData: CartData;
}

const calculateSubtotal = (
  price: string | number | null | undefined,
  qty: number,
) => {
  if (price === undefined || price === null) return 0;
  const priceAsNumber =
    typeof price === "string" ? parseFloat(price) : Number(price);
  return isNaN(priceAsNumber) ? 0 : priceAsNumber * qty;
};

const OrderSummary = ({ cartData }: OrderSummaryProps) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-lg font-medium mb-4">Order Summary</h2>

      <div className="space-y-4 mb-6">
        {cartData.items.map((item) => (
          <div key={item.id} className="flex justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium">{item.product.name}</h3>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                Unit price: {formatPrice(item.productSku.price)}
              </p>
              <p className="text-sm font-medium">
                {formatPrice(
                  calculateSubtotal(item.productSku.price, item.quantity),
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 pt-4 border-t border-gray-200">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formatPrice(cartData.total)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span>{formatPrice(0)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span>{formatPrice(0)}</span>
        </div>
        {safeParseFloat(cartData.total) >= 10000 && (
          <div className="flex justify-between text-green-600">
            <span>Free Shipping Applied</span>
            <span>-{formatPrice(0)}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-lg pt-4 border-t border-gray-200">
          <span>Total</span>
          <span>{formatPrice(cartData.total)}</span>
        </div>
      </div>
    </div>
  );
};

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  paymentMethod: "card" | "cash";
}

const Checkout = () => {
  const navigate = useNavigate();
  const cartItems = useAppSelector(selectCartItems);
  const [createOrder, { isLoading: isOrderLoading }] = useCreateOrderMutation();
  const { data: cartData, isLoading } = useGetCartQuery();
  const user = useAppSelector(selectUser);

  const [formData, setFormData] = useState<FormData>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    paymentMethod: "card",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    CartService.initializeCart();
  }, []);

  useEffect(() => {
    if (cartItems.length === 0 && !isLoading) {
      navigate("/cart");
    }
  }, [cartItems.length, isLoading, navigate]);

  useEffect(() => {
    if (!isLoading && (!cartData || !cartData.items || cartData.items.length === 0)) {
      toast.error("Your cart is empty");
      navigate("/cart");
    }
  }, [cartData, isLoading, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.postalCode.trim())
      newErrors.postalCode = "Postal code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: parseFloat(item.productSku?.price?.toString() || "0") / 100,
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
        },
        paymentMethod: formData.paymentMethod,
        email: formData.email,
      };

      const response = await createOrder(orderData).unwrap();
      console.log(response)
      await CartService.clearCart();
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      console.error("Failed to place order:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!cartData || !cartData.items || cartData.items.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="mb-6">
            <Link
              to="/cart"
              className="text-gray-500 hover:text-black flex items-center gap-1 text-sm"
            >
              <ArrowLeft size={14} />
              <span>Back to Cart</span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold mb-8">Checkout</h1>

          <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm mb-6 border border-gray-100">
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <User className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold">Contact Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name*
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${errors.firstName ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${errors.lastName ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      {errors.lastName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email*
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${errors.email ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number*
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${errors.phone ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                    placeholder="+250 123 456 789"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Address Section */}
            <div className="mb-8 pt-6 border-t border-gray-100">
              <div className="flex items-center mb-6">
                <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold">Shipping Address</h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address*
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${errors.address ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                    placeholder="123 Main Street, Apt 4B"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City*
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${errors.city ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                      placeholder="Kigali"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle size={12} className="mr-1" />
                        {errors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code*
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${errors.postalCode ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                      placeholder="00000"
                    />
                    {errors.postalCode && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle size={12} className="mr-1" />
                        {errors.postalCode}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
                    style={{
                      backgroundImage:
                        'url(\'data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 15l-4.243-4.243 1.415-1.414L12 12.172l2.828-2.829 1.415 1.414z"/></svg>\')',
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                    }}
                  >
                    <option value="Rwanda">Rwanda</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Uganda">Uganda</option>
                    <option value="Tanzania">Tanzania</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="pt-6 border-t border-gray-100">
              <div className="flex items-center mb-6">
                <Wallet className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold">Payment Method</h2>
              </div>

              <div className="space-y-4">
                <label
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${formData.paymentMethod === "card" ? "border-blue-500 bg-blue-50 shadow-sm" : "border-gray-200 hover:border-blue-200 hover:bg-blue-50/30"}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === "card"}
                    onChange={handleInputChange}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <CreditCard className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <span className="font-medium">Credit/Debit Card</span>
                    <p className="text-xs text-gray-500 mt-1">
                      Pay securely with your card
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${formData.paymentMethod === "cash" ? "border-blue-500 bg-blue-50 shadow-sm" : "border-gray-200 hover:border-blue-200 hover:bg-blue-50/30"}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === "cash"}
                    onChange={handleInputChange}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <Truck className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <span className="font-medium">Cash on Delivery</span>
                    <p className="text-xs text-gray-500 mt-1">
                      Pay when you receive your order
                    </p>
                  </div>
                </label>

                <div className="mt-4 text-sm">
                  <Link
                    to="/payment-methods"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Manage saved payment methods
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          {!isLoading && cartData && (
            <OrderSummary
              cartData={{
                items: cartData.items.map(item => ({
                  id: item.id,
                  product: { name: item.product?.name ?? 'Unknown Product' },
                  productSku: { price: item.productSku?.price ?? 0 },
                  quantity: item.quantity
                })),
                total: cartData.total
              } as CartData}
            />
          )}
          <button
            onClick={handlePlaceOrder}
            disabled={isLoading}
            className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm hover:shadow flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isOrderLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                Complete Order
                <ChevronRight size={18} />
              </>
            )}
          </button>

          <div className="mt-6 flex items-start text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
            <ShieldCheck className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
            <span>
              Your personal data will be used to process your order, support
              your experience, and for other purposes described in our privacy
              policy.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
