import { PageHeaderWithIcons } from "../../components/custom";
import StatisticsCard, { statisticsCardPropsInterface } from "../../components/custom/StatisticsCard";

const DashboardStats: Array<statisticsCardPropsInterface> = [
  {
    Header: <h4 className="text-sm  font-semibold">Total inventory volume</h4>,
    fact: "100k",
  },
  {
    Header: <h4 className="text-sm  font-semibold">inventory value</h4>,
    fact: "96.4k",
  },
  {
    Header: <h4 className="text-sm  font-semibold">Partners inventory</h4>,
    fact: "10.1k",
  },
];

function Inventory() {
  return (
    <div className="flex-1 px-2">
      <PageHeaderWithIcons title="Inventory" />
      <div className="w-full grid grid-cols-4 gap-6 mt-3">
        {DashboardStats.map((data, idx) => (
          <StatisticsCard {...data} key={idx} />
        ))}
      </div>
    </div>
  );
}

export default Inventory;
