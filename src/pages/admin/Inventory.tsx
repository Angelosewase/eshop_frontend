import { PageHeaderWithIcons } from "../../components/custom";
import StatisticsCard, {
  statisticsCardPropsInterface,
} from "../../components/custom/StatisticsCard";
import {
  InventoryColumns,
  InventoryDataTable,
} from "../../components/custom/tables/inventory";
import { AddInventoryProduct } from "../../components/custom/modals";
import { useGetProductsQuery } from "../../features/inventory/productSlice";
import { transformProductsIntoInventoryProducts } from "../../lib/utils";

function Inventory() {
  const categories = ["All", "Mending", "Bought", "Best sale", "discount"];
  const { data: productsData } = useGetProductsQuery();
  const DashboardStats: Array<statisticsCardPropsInterface> = [
    {
      Header: (
        <h4 className="text-sm  font-semibold">Total inventory volume</h4>
      ),
      fact: productsData?.total.toString() || "unknown",
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

export function InventoryTable() {
  const { data, isLoading, isError } = useGetProductsQuery();
  const productDetails = data?.products;

  return (
    <div className="container mx-auto py-10">
      {isLoading && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
        </div>
      )}
      {isError && (
        <div className="w-full h-64 flex items-center justify-center">
          <p className="text-center text-lg text-red-500">
            Oops, something went wrong! Please try again later.
          </p>
        </div>
      )}
      <InventoryDataTable
        columns={InventoryColumns}
        data={transformProductsIntoInventoryProducts(productDetails || [])}
      />
    </div>
  );
}
