import {
  ChartColumnStacked,
  FolderX,
  HeartHandshake,
  Kanban,
  Pen,
  PersonStanding,
  SquareArrowOutUpRight,
} from "lucide-react";
import { PageHeaderWithIcons, StatisticsCard } from "../../components/custom";
import { statisticsCardPropsInterface } from "../../components/custom/StatisticsCard";
import { AddCategoryModal } from "../../components/custom/modals";
import { useGetProductsQuery } from "../../features/inventory/productSlice";
import { useGetCustomersQuery } from "../../features/users/userSlice";
import { useGetCategoriesQuery } from "../../features/inventory/categoriesSlice";

function Home() {
  const { data, error: productError } = useGetProductsQuery();
  const { data: customers, error: customerError } = useGetCustomersQuery();
  const { data: categories, error: categoryError } = useGetCategoriesQuery();

  const DashboardStats: Array<statisticsCardPropsInterface> = [
    {
      Header: (
        <div className="flex items-center gap-1">
          <Kanban size={20} />
          <h4 className="text-sm  font-semibold">Products</h4>
        </div>
      ),
      fact: productError ? "_" : data?.total.toString() || "unknown",
    },
    {
      Header: (
        <div className="flex items-center gap-1">
          <ChartColumnStacked size={20} />
          <h4 className="text-sm  font-semibold">Categories</h4>
        </div>
      ),
      fact: categoryError ? "_" : categories?.total.toString() || "unknown",
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
      fact: customerError ? "_" : customers?.total.toString() || "unknown",
    },
  ];
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
  const { data } = useGetCategoriesQuery();
  return (
    <div className="flex-1 bg-[#D8DBE2] rounded-lg px-5">
      <style>
        {`
          ::-webkit-scrollbar {
            width: 10px;
          }
          ::-webkit-scrollbar-thumb {
            background-color: rgb(100, 116, 139);
            border-radius: 10px;
          }
        `}
      </style>
      <div className="flex justify-between items-center py-3">
        <h1 className="text-2xl font-semibold">Product categories </h1>
        <AddCategoryModal />
      </div>
      <div className="flex-1 space-y-4 overflow-y-scroll">
        <div className="flex justify-between items-center border-b pb-2">
          <p className="text-base font-medium">Category Name</p>
          <p className="text-base font-medium">Products Count</p>
          <p className="text-base font-medium">Actions</p>
        </div>
        {data?.data.map((category) => (
          <div key={category.id} className="flex justify-between items-center py-3 border-b">
            <p className="text-sm text-gray-700">{category.name}</p>
            <p className="text-sm text-gray-700">{category.products?.length || 0}</p>
            <div className="flex items-center gap-4 text-blue-500">
              <Pen size={18} className="cursor-pointer hover:text-blue-700" />
              <SquareArrowOutUpRight size={18} className="cursor-pointer hover:text-blue-700" />
              <FolderX size={18} color="#ef4444" className="cursor-pointer hover:text-red-600" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
