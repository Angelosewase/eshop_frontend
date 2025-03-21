import { useGetProductsQuery } from "../../features/inventory/productSlice";
import DataTable from "../../components/custom/tables/inventory/data-table";
import columns from "../../components/custom/tables/inventory/columns";
import { transformProductsIntoInventoryProducts } from "../../lib/utils";

const Inventory = () => {
  const { data: productsData } = useGetProductsQuery({});
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={transformProductsIntoInventoryProducts(productsData?.products || [])} />
    </div>
  );
};

export default Inventory;
