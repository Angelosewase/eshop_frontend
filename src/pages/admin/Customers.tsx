import { PageHeaderWithIcons } from "../../components/custom";
import {
  CustomersTable,
  CustomersTableColumns,
} from "../../components/custom/tables/customers";
import { Customer } from "../../components/custom/tables/customers/columns";

const dummyCustomersData: Array<Customer> = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "123-456-7890",
    role: "admin",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phoneNumber: "987-654-3210",
    role: "user",
  },
  {
    id: "3",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    phoneNumber: "555-555-5555",
    role: "user",
  },
  {
    id: "4",
    name: "Bob Brown",
    email: "bob.brown@example.com",
    phoneNumber: "444-444-4444",
    role: "manager",
  },
  {
    id: "5",
    name: "Charlie Davis",
    email: "charlie.davis@example.com",
    phoneNumber: "333-333-3333",
    role: "admin",
  },
];

function Customers() {
  return (
    <div className="flex-1 px-2">
      <PageHeaderWithIcons title="Customers" />
      <div>
        <CustomersTable
          data={dummyCustomersData}
          columns={CustomersTableColumns}
        />
      </div>
    </div>
  );
}

export default Customers;
