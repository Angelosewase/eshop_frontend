import { ArrowRight, ShieldCheck, Truck, CreditCard } from "lucide-react";
import { BestSales, PopularProducts } from "../../components/custom/web";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Discover Amazing Products
            </h1>
            <p className="text-gray-600 mb-8">
              Shop the latest trends and find incredible deals on our curated
              selection of products.
            </p>
            <Link to="/explore">
              <Button className="flex items-center gap-2">
                Start Shopping <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <ShieldCheck className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Secure Shopping</h3>
              <p className="text-sm text-gray-600">
                Your data is always protected
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <Truck className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Fast Delivery</h3>
              <p className="text-sm text-gray-600">Get your items quickly</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <CreditCard className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Easy Payments</h3>
              <p className="text-sm text-gray-600">Multiple payment options</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Best Selling Products</h2>
        <BestSales />
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Popular Products</h2>
        <PopularProducts />
      </section>
    </div>
  );
}

export default Home;
