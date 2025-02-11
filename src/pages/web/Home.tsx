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

function Home() {
  return (
    <div>
      <Hero />
      <TopCategory />
      <BestSales />
      <CashbackSection />
      <PopularProducts />
      <CashBack2 />
      <TrendingProducts />
      <Services2HelpUShop />
    </div>
  );
}

export default Home;
