import { PageHeaderWithIcons } from "../../components/custom";
import {
  CustomersTable,
  CustomersTableColumns,
} from "../../components/custom/tables/customers";
import { useGetCustomersQuery } from "../../features/users/userSlice";

function Customers() {
  const { data } = useGetCustomersQuery();
  return (
    <div className="flex-1 px-2">
      <PageHeaderWithIcons title="Customers" />
      <div>
        <CustomersTable
          data={data?.users || []}
          columns={CustomersTableColumns}
        />
      </div>
    </div>
  );
}

export default Customers;
