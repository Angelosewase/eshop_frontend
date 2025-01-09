import { ChartColumnStacked, HeartHandshake, Kanban, PersonStanding } from "lucide-react";
import { PageHeaderWithIcons, StatisticsCard } from "../../components/custom";
import { statisticsCardPropsInterface } from "../../components/custom/StatisticsCard";

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
    <div className="flex-1 px-2">
      <PageHeaderWithIcons title="Dashboard" />
      <div className="w-full grid grid-cols-4 gap-6">
        {DashboardStats.map((data, idx) => (
          <StatisticsCard {...data} key={idx} />
        ))}
      </div>
    </div>
  );
}

export default Home;
