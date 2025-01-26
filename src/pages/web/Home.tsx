import {
  BestSales,
  CashBack2,
  CashbackSection,
  Hero,
  PopularProducts,
  TopCategory,
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
    </div>
  );
}

export default Home;
