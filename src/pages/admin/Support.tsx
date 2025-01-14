import { HelpSupportColumns, HelpSupportDataTable } from "../../components/custom/tables/Help&Support";
import { Complain } from "../../components/custom/tables/Help&Support/columns";

const complainsDummyData: Array<Complain> = [
  {
    id: "1",
    customerName: "John Doe",
    email: "john.doe@example.com",
    description: "I have a problem with my order.",
  },
  {
    id: "2",
    customerName: "Jane Doe",
    email: "jane.doe@example.com",
    description: "My order is delayed.",
  },
  {
    id: "3",
    customerName: "Bob Smith",
    email: "bob.smith@example.com",
    description: "I have a question about my order.",
  },
  {
    id: "4",
    customerName: "Alice Johnson",
    email: "alice.johnson@example.com",
    description: "I have a complaint about the customer service.",
  },
  {
    id: "5",
    customerName: "David Brown",
    email: "david.brown@example.com",
    description: "I have a problem with my account.",
  },
];

function Support() {
  return (
    <div className="px-4">
      <div className=" w-full py-3  items-center">
        <h1 className="text-3xl font-bold">Help & support </h1>
      </div>
    <div className="w-[90%]">

      <HelpSupportDataTable data={complainsDummyData} columns={HelpSupportColumns}/>
    </div>
    </div>
  );
}

export default Support;
