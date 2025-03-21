import { useState, useEffect } from "react";
import {
  MinusIcon,
  PlusIcon,
  RotateCcw,
  ShoppingCart,
  Star,
  Truck,
  Heart,
  Share2,
  ChevronRight,
  MessageSquare,
  Check,
  StarHalf,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetProductQuery,
  useGetProductsQuery,
} from "../../features/inventory/productSlice";
import CartService from "../../features/cart/cartService";
import { toast } from "sonner";

const ProductDetails = () => {
  const { id } = useParams();
  const { data: product, isLoading } = useGetProductQuery(Number(id));
  // Fetch related products from the same category
  const { data: relatedProductsData } = useGetProductsQuery(
    {
      categoryId: product?.categoryId,
      limit: 4,
    },
    { skip: !product?.categoryId },
  );

  const [quantity, setQuantity] = useState(1);
  const [selectedSku, setSelectedSku] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlist, setIsWishlist] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Set initial SKU when product loads
  useEffect(() => {
    if (product?.productSkus && product.productSkus.length > 0) {
      setSelectedSku(0);
    }
  }, [product]);

  // Initialize cart when component mounts
  useEffect(() => {
    const initCart = async () => {
      try {
        await CartService.initializeCart();
        console.log("Cart initialized in ProductDetails");
      } catch (error) {
        console.error("Error initializing cart:", error);
      }
    };

    initCart();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center text-gray-500">Product not found</div>
      </div>
    );
  }

  if (!product.productSkus || product.productSkus.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center text-gray-500">
          This product is currently unavailable
        </div>
      </div>
    );
  }

  const currentSku =
    selectedSku !== null && product.productSkus
      ? product.productSkus[selectedSku]
      : null;
  const price = currentSku?.price || 0;

  // Filter out null or undefined values from images array
  const images = [
    product.cover,
    ...(product.productSkus?.map((sku) => sku.colorAttribute?.value) || []),
  ].filter(Boolean) as string[];

  // If no images are available, use a placeholder
  if (images.length === 0) {
    images.push("/placeholder.jpg");
  }

  const handleAddToCart = async () => {
    if (!currentSku) {
      toast.error("Please select a product variant");
      return;
    }

    if (currentSku.quantity <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    try {
      await CartService.addToCart(
        Number(id),
        quantity,
        currentSku.id, // Pass the SKU ID
      );

      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("Failed to add item to cart. Please try again.");
    }
  };

  const handleBuyNow = async () => {
    if (!currentSku) {
      toast.error("Please select a product variant");
      return;
    }

    if (currentSku.quantity <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    try {
      await CartService.addToCart(
        Number(id),
        quantity,
        currentSku.id, // Pass the SKU ID
      );

      navigate("/checkout");
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("Failed to add item to cart. Please try again.");
    }
  };

  const handleWishlist = () => {
    setIsWishlist(!isWishlist);
    toast.success(isWishlist ? `Removed from wishlist` : `Added to wishlist`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  // Get related products, excluding the current product
  const relatedProducts =
    relatedProductsData?.products
      ?.filter((p) => p.id !== Number(id))
      ?.slice(0, 4) || [];

  // Calculate rating percentages based on actual reviews
  const calculateRatingPercentages = () => {
    if (!product.reviews || product.reviews.length === 0) {
      return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    }

    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    product.reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        ratingCounts[review.rating as keyof typeof ratingCounts]++;
      }
    });

    const totalReviews = product.reviews.length;
    const percentages = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    Object.keys(ratingCounts).forEach((rating) => {
      const key = Number(rating) as keyof typeof percentages;
      percentages[key] = Math.round((ratingCounts[key] / totalReviews) * 100);
    });

    return percentages;
  };

  const ratingPercentages = calculateRatingPercentages();

  // Function to render star ratings
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        )}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star
            key={i + fullStars + (hasHalfStar ? 1 : 0)}
            className="h-4 w-4 text-gray-300"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <span className="hover:text-gray-800 cursor-pointer">Home</span>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="hover:text-gray-800 cursor-pointer">Products</span>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-gray-800 font-medium">{product.name}</span>
      </div>

      {/* Product Main Section */}
      <div className="flex flex-col lg:flex-row gap-8 mb-16">
        {/* Product Images */}
        <div className="lg:w-3/5">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="md:w-1/6 order-2 md:order-1">
              <div className="flex md:flex-col gap-2 mt-4 md:mt-0">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`border rounded cursor-pointer transition-all ${selectedImage === index ? "border-blue-500 shadow-md" : "border-gray-200"}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Main Image */}
            <div className="md:w-5/6 order-1 md:order-2">
              <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-[400px] md:h-[500px] object-contain p-4"
                />
              </div>

              {/* Image Actions */}
              <div className="flex justify-end mt-4 gap-2">
                <button
                  onClick={handleWishlist}
                  className={`p-2 rounded-full border ${isWishlist ? "bg-red-50 border-red-200 text-red-500" : "border-gray-200 hover:bg-gray-50"}`}
                  aria-label="Add to wishlist"
                >
                  <Heart
                    className={`h-5 w-5 ${isWishlist ? "fill-red-500 text-red-500" : ""}`}
                  />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full border border-gray-200 hover:bg-gray-50"
                  aria-label="Share product"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:w-2/5">
          <div className="sticky top-4">
            {/* Product Title and Rating */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>

            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {renderRating(product.averageRating || 0)}
                <span className="ml-2 text-sm text-gray-500">
                  {product.averageRating?.toFixed(1) || "0.0"} (
                  {product.reviews?.length || 0} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-3xl font-bold text-gray-900">
                ${Number(price).toFixed(2)}
              </span>
              {currentSku?.quantity && currentSku.quantity < 10 && (
                <span className="ml-3 text-sm text-orange-600">
                  Only {currentSku.quantity} left in stock
                </span>
              )}
            </div>

            {/* Availability */}
            <div className="flex items-center mb-6">
              <div
                className={`h-3 w-3 rounded-full mr-2 ${currentSku?.quantity ? "bg-green-500" : "bg-red-500"}`}
              ></div>
              <span
                className={`text-sm ${currentSku?.quantity ? "text-green-600" : "text-red-600"}`}
              >
                {currentSku?.quantity ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Short Description */}
            <div className="mb-6">
              <p className="text-gray-600 line-clamp-3">
                {product.description || "No description available"}
              </p>
            </div>

            <hr className="my-6" />

            {/* Colors */}
            {product.productSkus?.some((sku) => sku.colorAttribute?.value) && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Colors</h3>
                <div className="flex flex-wrap gap-3">
                  {product.productSkus?.map((sku, index) => (
                    <button
                      key={sku.id}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selectedSku === index
                          ? "ring-2 ring-offset-2 ring-black"
                          : "hover:ring-1 hover:ring-gray-300"
                      }`}
                      style={{
                        backgroundColor: sku.colorAttribute?.value || "#373F51",
                      }}
                      onClick={() => setSelectedSku(index)}
                      aria-label={`Select color ${sku.colorAttribute?.value || "default"}`}
                    >
                      {selectedSku === index && (
                        <Check className="h-5 w-5 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.productSkus?.some((sku) => sku.sizeAttribute?.value) && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-900">Size</h3>
                  <button className="text-sm text-blue-600 hover:underline">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.productSkus?.map((sku, index) => (
                    <button
                      key={sku.id}
                      className={`py-2 px-4 rounded border-2 text-sm font-medium transition-colors ${
                        selectedSku === index
                          ? "bg-black text-white border-black"
                          : "border-gray-300 text-gray-700 hover:border-gray-900"
                      }`}
                      onClick={() => setSelectedSku(index)}
                    >
                      {sku.sizeAttribute?.value || "One Size"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm w-36 bg-white">
                <button
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <div className="flex-1 text-center border-x border-gray-300">
                  <input
                    type="number"
                    min="1"
                    max={currentSku?.quantity || 1}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (
                        !isNaN(val) &&
                        val >= 1 &&
                        (!currentSku?.quantity || val <= currentSku.quantity)
                      ) {
                        setQuantity(val);
                      }
                    }}
                    className="w-full h-10 text-center focus:outline-none"
                    aria-label="Quantity"
                  />
                </div>
                <button
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setQuantity((q) => q + 1)}
                  disabled={
                    !currentSku?.quantity || quantity >= currentSku.quantity
                  }
                  aria-label="Increase quantity"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
              {currentSku?.quantity && (
                <p className="text-xs text-gray-500 mt-2">
                  {currentSku.quantity} items available
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                className="flex-1 bg-white border-2 border-black text-black py-3 px-6 rounded-lg font-medium hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black disabled:border-gray-300"
                disabled={!currentSku?.quantity || quantity <= 0}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>
              <button
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
                disabled={!currentSku?.quantity || quantity <= 0}
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>

            {/* Product Actions */}
            <div className="flex items-center gap-4 mb-6 text-sm">
              <button
                onClick={handleWishlist}
                className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${
                  isWishlist
                    ? "text-red-600 bg-red-50 hover:bg-red-100"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Heart
                  className={`h-4 w-4 ${isWishlist ? "fill-red-500" : ""}`}
                />
                {isWishlist ? "Saved" : "Save"}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>

            {/* Delivery Info */}
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-5 mb-6 border border-gray-100 shadow-sm">
              <div className="flex items-start mb-4">
                <div className="bg-blue-50 p-2 rounded-full mr-3 flex-shrink-0">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Free Delivery</h4>
                  <p className="text-sm text-gray-600">
                    Free standard shipping on orders over $50
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-50 p-2 rounded-full mr-3 flex-shrink-0">
                  <RotateCcw className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Easy Returns</h4>
                  <p className="text-sm text-gray-600">
                    30-day free returns policy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mb-16">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              className={`py-4 px-6 font-medium text-sm whitespace-nowrap ${
                activeTab === "description"
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm whitespace-nowrap ${
                activeTab === "specifications"
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("specifications")}
            >
              Specifications
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm whitespace-nowrap ${
                activeTab === "reviews"
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews ({product.reviews?.length || 0})
            </button>
          </div>
        </div>

        <div className="py-6">
          {activeTab === "description" && (
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {product.description || "No description available"}
              </p>

              {/* Additional description content - this would come from the API in a real implementation */}
              {product.summary && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Summary</h3>
                  <p className="text-gray-700">{product.summary}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "specifications" && (
            <div>
              <table className="w-full text-left">
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <th className="py-3 pr-4 w-1/3 font-medium text-gray-900">
                      Category
                    </th>
                    <td className="py-3 text-gray-700">
                      {product.category?.name || "N/A"}
                    </td>
                  </tr>
                  {product.productSkus && product.productSkus.length > 0 && (
                    <>
                      <tr>
                        <th className="py-3 pr-4 w-1/3 font-medium text-gray-900">
                          SKU
                        </th>
                        <td className="py-3 text-gray-700">
                          {product.productSkus[0].sku}
                        </td>
                      </tr>
                      {product.productSkus[0].colorAttribute?.value && (
                        <tr>
                          <th className="py-3 pr-4 w-1/3 font-medium text-gray-900">
                            Color
                          </th>
                          <td className="py-3 text-gray-700">
                            {product.productSkus[0].colorAttribute.value}
                          </td>
                        </tr>
                      )}
                      {product.productSkus[0].sizeAttribute?.value && (
                        <tr>
                          <th className="py-3 pr-4 w-1/3 font-medium text-gray-900">
                            Size
                          </th>
                          <td className="py-3 text-gray-700">
                            {product.productSkus[0].sizeAttribute.value}
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                  <tr>
                    <th className="py-3 pr-4 w-1/3 font-medium text-gray-900">
                      Availability
                    </th>
                    <td className="py-3 text-gray-700">
                      {currentSku?.quantity && currentSku.quantity > 0
                        ? "In Stock"
                        : "Out of Stock"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              {/* Review Summary */}
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="md:w-1/3">
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="text-5xl font-bold text-gray-900 mb-2">
                      {product.averageRating?.toFixed(1) || "0.0"}
                    </div>
                    <div className="flex justify-center mb-2">
                      {renderRating(product.averageRating || 0)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Based on {product.reviews?.length || 0} reviews
                    </div>
                  </div>
                </div>

                <div className="md:w-2/3">
                  <h3 className="font-medium text-lg mb-4">Rating Breakdown</h3>

                  {/* Rating bars */}
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const percentage =
                      ratingPercentages[
                        rating as keyof typeof ratingPercentages
                      ];

                    return (
                      <div key={rating} className="flex items-center mb-2">
                        <div className="flex items-center w-12">
                          <span className="text-sm font-medium text-gray-700">
                            {rating}
                          </span>
                          <Star className="h-4 w-4 text-gray-400 ml-1" />
                        </div>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full mx-3">
                          <div
                            className="h-2 bg-yellow-400 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="w-12 text-right">
                          <span className="text-sm text-gray-500">
                            {percentage}%
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  <button className="mt-4 bg-black text-white py-2 px-4 rounded font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Write a Review
                  </button>
                </div>
              </div>

              {/* Review List */}
              <div className="border-t border-gray-200 pt-8">
                <h3 className="font-medium text-lg mb-6">Customer Reviews</h3>

                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="mb-8 pb-8 border-b border-gray-200 last:border-0"
                    >
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">User #{review.userId}</h4>
                        <span className="text-sm text-gray-500">
                          Verified Purchase
                        </span>
                      </div>
                      <div className="flex items-center mb-3">
                        {renderRating(review.rating)}
                      </div>
                      <p className="text-gray-700 mb-3">
                        {review.comment || "No comment provided"}
                      </p>
                      <div className="flex items-center">
                        <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                          <span>Helpful</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No reviews yet. Be the first to review this product!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div>
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((product) => (
              <div
                key={product.id}
                className="group cursor-pointer"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <div className="bg-gray-100 rounded-lg overflow-hidden mb-3 aspect-square relative">
                  <img
                    src={product.cover || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.success(`${product.name} added to wishlist!`);
                    }}
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                  {product.name}
                </h3>
                <div className="flex items-center mt-1 mb-1">
                  {renderRating(product.averageRating || 0)}
                  <span className="text-xs text-gray-500 ml-1">
                    {product.averageRating?.toFixed(1) || "0.0"}
                  </span>
                </div>
                <div className="font-bold">
                  ${Number(product.productSkus?.[0]?.price || 0).toFixed(2)}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-4 text-center py-8 text-gray-500">
              No related products found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
