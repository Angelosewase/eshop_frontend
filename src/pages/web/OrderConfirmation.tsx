import { useNavigate } from "react-router-dom";
import { CheckCircle, ShoppingBag } from "lucide-react";

export default function OrderConfirmation() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-lg mx-auto text-center">
        <div className="mb-6 flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate('/orders')}
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            View Orders
          </button>
          <button
            onClick={() => navigate('/explore')}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <ShoppingBag className="h-4 w-4" />
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
} 