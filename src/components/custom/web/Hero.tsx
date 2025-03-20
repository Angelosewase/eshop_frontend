import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const heroSlides = [
  {
    id: 1,
    title: "New Arrivals",
    subtitle: "Spring Collection 2024",
    description: "Discover the latest trends and styles",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070",
    link: "/products?category=new-arrivals"
  },
  {
    id: 2,
    title: "Summer Essentials",
    subtitle: "Hot Deals Up to 50% Off",
    description: "Get ready for summer with our exclusive collection",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071",
    link: "/products?category=summer"
  },
  {
    id: 3,
    title: "Luxury Collection",
    subtitle: "Elegance Redefined",
    description: "Premium quality for the discerning customer",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070",
    link: "/products?category=luxury"
  }
];

const featuredCategories = [
  {
    id: 1,
    name: "Women's Fashion",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2071",
    link: "/products?category=women"
  },
  {
    id: 2,
    name: "Men's Collection",
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1974",
    link: "/products?category=men"
  },
  {
    id: 3,
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999",
    link: "/products?category=accessories"
  },
  {
    id: 4,
    name: "New Season",
    image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=2070",
    link: "/products?category=new-season"
  }
];

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Slider */}
      <div className="relative h-[600px] rounded-2xl overflow-hidden mb-12">
        {/* Slides */}
        <div className="relative w-full h-full">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <div className="absolute inset-0 bg-black/40" />
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-2xl text-white">
                    <h2 className="text-sm font-medium mb-2 opacity-90">{slide.subtitle}</h2>
                    <h1 className="text-5xl font-bold mb-4">{slide.title}</h1>
                    <p className="text-lg mb-8 opacity-90">{slide.description}</p>
                    <Link
                      to={slide.link}
                      className="inline-flex items-center bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-opacity-90 transition-colors"
                    >
                      Shop Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/80'
                }`}
            />
          ))}
        </div>
      </div>

      {/* Featured Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredCategories.map((category) => (
          <Link
            key={category.id}
            to={category.link}
            className="group relative h-[300px] rounded-xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">{category.name}</h3>
                <span className="inline-flex items-center text-white text-sm font-medium">
                  Shop Now
                  <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Hero;