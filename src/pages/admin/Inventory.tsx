import { PageHeaderWithIcons } from "../../components/custom";
import StatisticsCard, {
  statisticsCardPropsInterface,
} from "../../components/custom/StatisticsCard";
import { InventoryProduct } from "../../components/custom/tables/inventory/columns";
import { InventoryColumns, InventoryDataTable } from "../../components/custom/tables/inventory";
import { AddInventoryProduct } from "../../components/custom/modals";

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
  const categories = ["All", "Mending", "Bought", "Best sale", "discount"];
  return (
    <div className="flex-1 px-2 = h-full">
      <PageHeaderWithIcons title="Inventory" />
      <div className="w-full grid grid-cols-4 gap-6 mt-3">
        {DashboardStats.map((data, idx) => (
          <StatisticsCard {...data} key={idx} />
        ))}
      </div>
      <TabComponent categories={categories} />
      <InventoryTable />
    </div>
  );
}

export default Inventory;

export const TabComponent = ({ categories }: { categories: Array<string> }) => {
  return (
    <div className="w-full border-b border-gray-400 flex items-center py-2 mt-4 gap-4 -mb-8">
      {categories.map((category, idx) => (
        <div key={idx}>
          <button className="hover:bg-gray-200 text-lg font-medium py-1.5 px-3 rounded-lg">
            {category}
          </button>
        </div>
      ))}

      <AddInventoryProduct />
    </div>
  );
};

export function fetchData({
  categories,
}: {
  categories: Array<string>;
}): Array<InventoryProduct> {
  return Array.from({ length: 100 }).map((_, idx) => ({
    id: (idx + 1).toString(),
    name: `Product ${idx + 1}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    number: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
  })) as Array<InventoryProduct>;
}


export function InventoryTable() {
  const categories = ["All", "Mending", "Bought", "Best sale", "discount"];
  const data = fetchData({ categories });
  return (
    <div className="container mx-auto py-10">
      <InventoryDataTable columns={InventoryColumns} data={data} />
    </div>
  );
}