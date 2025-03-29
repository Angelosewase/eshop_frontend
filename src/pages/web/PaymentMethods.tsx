import { useState } from "react";
import {
  useGetUserPaymentMethodsQuery,
  useAddPaymentMethodMutation,
  useDeletePaymentMethodMutation,
  useSetDefaultPaymentMethodMutation,
  PaymentMethodRequest,
} from "../../features/payments/paymentMethodsSlice";
import { toast } from "sonner";
import {
  CreditCard,
  Plus,
  Trash2,
  CheckCircle,
  Star,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function PaymentMethods() {
  const { data, isLoading, error } = useGetUserPaymentMethodsQuery();
  const [addPaymentMethod, { isLoading: isAdding }] =
    useAddPaymentMethodMutation();
  const [deletePaymentMethod, { isLoading: isDeleting }] =
    useDeletePaymentMethodMutation();
  const [setDefaultPaymentMethod, { isLoading: isSettingDefault }] =
    useSetDefaultPaymentMethodMutation();

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<PaymentMethodRequest>({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
    isDefault: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    // Format card number with spaces
    if (name === "cardNumber") {
      const formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19);

      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    }
    // Format expiry date as MM/YY
    else if (name === "expiryDate") {
      const cleaned = value.replace(/\D/g, "");
      let formatted = cleaned;

      if (cleaned.length > 2) {
        formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
      }

      setFormData((prev) => ({ ...prev, [name]: formatted }));
    }
    // Handle checkbox
    else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    }
    // Handle other inputs
    else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when field is edited
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

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = "Card number is required";
    } else if (formData.cardNumber.replace(/\s/g, "").length < 16) {
      newErrors.cardNumber = "Card number must be 16 digits";
    }

    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required";
    }

    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = "Expiry date is required";
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = "Expiry date must be in MM/YY format";
    }

    if (!formData.cvv.trim()) {
      newErrors.cvv = "CVV is required";
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = "CVV must be 3 or 4 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCard = async () => {
    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }

    try {
      await addPaymentMethod(formData).unwrap();
      toast.success("Payment method added successfully");
      setShowAddForm(false);
      setFormData({
        cardNumber: "",
        cardholderName: "",
        expiryDate: "",
        cvv: "",
        isDefault: false,
      });
    } catch (error) {
      console.error("Failed to add payment method:", error);
      toast.error("Failed to add payment method");
    }
  };

  const handleDeleteCard = async (id: number) => {
    if (
      window.confirm("Are you sure you want to delete this payment method?")
    ) {
      try {
        await deletePaymentMethod(id).unwrap();
        toast.success("Payment method deleted successfully");
      } catch (error) {
        console.error("Failed to delete payment method:", error);
        toast.error("Failed to delete payment method");
      }
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await setDefaultPaymentMethod(id).unwrap();
      toast.success("Default payment method updated");
    } catch (error) {
      console.error("Failed to set default payment method:", error);
      toast.error("Failed to update default payment method");
    }
  };

  const getCardTypeIcon = (cardNumber: string) => {
    const firstDigit = cardNumber.charAt(0);

    if (firstDigit === "4") {
      return "Visa";
    } else if (firstDigit === "5") {
      return "Mastercard";
    } else if (firstDigit === "3") {
      return "American Express";
    } else if (firstDigit === "6") {
      return "Discover";
    }

    return "Credit Card";
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Payment Methods</h1>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Failed to load payment methods. Please try again later.</span>
          </div>
        </div>
      ) : (
        <>
          {/* Payment Methods List */}
          <div className="mb-8">
            {data?.data && data.data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.data.map((card) => (
                  <div
                    key={card.id}
                    className={`bg-white rounded-lg shadow-sm p-4 border ${card.isDefault ? "border-blue-500" : "border-gray-200"}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <CreditCard className="h-6 w-6 text-gray-700 mr-2" />
                        <span className="font-medium">
                          {getCardTypeIcon(card.cardNumber)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {card.isDefault && (
                          <div className="flex items-center text-blue-600 text-sm mr-2">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span>Default</span>
                          </div>
                        )}
                        <div className="flex">
                          {!card.isDefault && (
                            <button
                              onClick={() => handleSetDefault(card.id)}
                              disabled={isSettingDefault}
                              className="text-gray-500 hover:text-blue-600 p-1"
                              title="Set as default"
                            >
                              <Star className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteCard(card.id)}
                            disabled={isDeleting}
                            className="text-gray-500 hover:text-red-600 p-1"
                            title="Delete card"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mb-2">
                      <div className="text-lg font-mono">
                        •••• •••• •••• {card.lastFourDigits}
                      </div>
                    </div>

                    <div className="flex justify-between text-sm text-gray-600">
                      <div>{card.cardholderName}</div>
                      <div>Expires: {card.expiryDate}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No payment methods found
                </h3>
                <p className="text-gray-500 mb-4">
                  Add a payment method to make checkout faster.
                </p>
              </div>
            )}
          </div>

          {/* Add New Card Button */}
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add New Payment Method
            </button>
          )}

          {/* Add New Card Form */}
          {showAddForm && (
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 max-w-2xl">
              <h2 className="text-xl font-semibold mb-4">
                Add New Payment Method
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number*
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={`w-full px-3 py-2 border rounded-md ${errors.cardNumber ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.cardNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.cardNumber}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cardholder Name*
                  </label>
                  <input
                    type="text"
                    name="cardholderName"
                    value={formData.cardholderName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className={`w-full px-3 py-2 border rounded-md ${errors.cardholderName ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.cardholderName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.cardholderName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date*
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    className={`w-full px-3 py-2 border rounded-md ${errors.expiryDate ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.expiryDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.expiryDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV*
                  </label>
                  <input
                    type="password"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    maxLength={4}
                    className={`w-full px-3 py-2 border rounded-md ${errors.cvv ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.cvv && (
                    <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">
                      Set as default payment method
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCard}
                  disabled={isAdding}
                  className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                >
                  {isAdding ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Add Card
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium mb-2">Payment Security</h3>
        <p className="text-gray-600 text-sm">
          Your payment information is securely stored and encrypted. We never
          store your full card details on our servers. All transactions are
          processed through secure payment gateways.
        </p>
      </div>
    </div>
  );
}
