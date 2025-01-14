import {
  ChartColumnStacked,
  HeartHandshake,
  Kanban,
  PersonStanding,
} from "lucide-react";
import { PageHeaderWithIcons, StatisticsCard } from "../../components/custom";
import { statisticsCardPropsInterface } from "../../components/custom/StatisticsCard";
import { AddCategoryModal } from "../../components/custom/modals";

const DashboardStats: Array<statisticsCardPropsInterface> = [
  {
    Header: (
      <div className="flex items-center gap-1">
        <Kanban size={20} />
        <h4 className="text-sm  font-semibold">Products</h4>
      </div>
    ),
    fact: "100k",
  },
  {
    Header: (
      <div className="flex items-center gap-1">
        <ChartColumnStacked size={20} />
        <h4 className="text-sm  font-semibold">Categories</h4>
      </div>
    ),
    fact: "96.4k",
  },
  {
    Header: (
      <div className="flex items-center gap-1">
        <HeartHandshake size={20} />
        <h4 className="text-sm  font-semibold">Deals</h4>
      </div>
    ),
    fact: "10.1k",
  },
  {
    Header: (
      <div className="flex items-center gap-1">
        <PersonStanding size={20} />
        <h4 className="text-sm  font-semibold">Customers</h4>
      </div>
    ),
    fact: "104",
  },
];

function Home() {
  return (
    <div className="flex-1 flex flex-col px-2 h-full a">
      <PageHeaderWithIcons title="Dashboard" />
      <div className="w-full grid grid-cols-4 gap-6 h-3/12">
        {DashboardStats.map((data, idx) => (
          <StatisticsCard {...data} key={idx} />
        ))}
      </div>
      <div className="flex flex-1 py-4 gap-14 ">
        <ProductCategories />
        <div className="flex-1 "></div>
      </div>
    </div>
  );
}

export default Home;

const ProductCategories = () => {
  return (
    <div className="flex-1 bg-[#D8DBE2] rounded-lg px-5">
      <div className="flex justify-between items-center py-3">
        <h1 className="text-2xl font-semibold">Product categories </h1>
        <AddCategoryModal />
      </div>
    </div>
  );
};
