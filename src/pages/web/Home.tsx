import { useEffect } from "react";
import { ArrowRight, TrendingUp, Star, Package, Truck, Clock, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import {
  BestSales,
  CashBack2,
  CashbackSection,
  Hero,
  PopularProducts,
  TopCategory,
  TrendingProducts,
  Services2HelpUShop,
} from "../../components/custom/web";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free shipping on orders over $100"
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "100% secure payment"
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Dedicated support"
  },
  {
    icon: Package,
    title: "Easy Returns",
    description: "30 day return policy"
  }
];

const promotions = [
  {
    title: "New Collection",
    description: "Spring/Summer 2024",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070",
    link: "/products?collection=new"
  },
  {
    title: "Special Offer",
    description: "Save up to 50%",
    image: "https://images.unsplash.com/photo-1470309864661-68328b2cd0a5?q=80&w=2070",
    link: "/products?offer=special"
  }
];

function Home() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <feature.icon className="h-10 w-10 text-blue-600 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Products Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Popular Products</h2>
              <p className="text-gray-500 mt-1">Discover our most loved items</p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <PopularProducts />
        </div>
      </div>

      {/* Promotions Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {promotions.map((promo, index) => (
            <Link
              key={index}
              to={promo.link}
              className="group relative h-[400px] rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <img
                src={promo.image}
                alt={promo.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                <div>
                  <h3 className="text-3xl font-bold mb-2">{promo.title}</h3>
                  <p className="text-lg mb-6 opacity-90">{promo.description}</p>
                  <span className="inline-flex items-center px-6 py-3 border-2 border-white rounded-full hover:bg-white hover:text-black transition-colors">
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Best Sales Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Best Sellers</h2>
              <p className="text-gray-500 mt-1">Our most popular products</p>
            </div>
            <Link
              to="/products?sort=best-selling"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <BestSales />
        </div>
      </div>

      {/* Trending Products Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
            <p className="text-gray-500 mt-1">What's hot right now</p>
          </div>
          <Link
            to="/products?sort=trending"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        <TrendingProducts />
      </div>

      {/* Categories Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
              <p className="text-gray-500 mt-1">Find what you're looking for</p>
            </div>
            <Link
              to="/categories"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              All Categories
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <TopCategory />
        </div>
      </div>

      {/* Cashback Section */}
      <div className="container mx-auto px-4 py-16">
        <CashbackSection />
      </div>

      {/* Services Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <Services2HelpUShop />
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-blue-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and get exclusive offers, new arrival alerts, and insider-only discounts
          </p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-white text-blue-600 rounded-full font-medium hover:bg-blue-50 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Home;
