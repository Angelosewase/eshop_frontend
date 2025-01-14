import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

export type Complain = {
  id: string;
  customerName: string;
  email: string;
  description: string;
};

const columns: ColumnDef<Complain>[] = [
  {
    id: "select",
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: unknown) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className=""
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "customerName",
    cell: ({ row }) => {
      const name = row.getValue("customerName") as string;
      const firstName = name.split(" ")[0];
      const firstLetter = firstName[0].toUpperCase();
      const lastName = name.split(" ")[1];
      const lastLetter = lastName ? lastName[0].toUpperCase() : "";
      return (
        <div className="flex items-center justify-center  font-medium -ml-16">
          <div className="w-10 h-10 bg-gray-100 rounded-full mr-3 flex items-center justify-center">
            {firstLetter}
            {lastLetter}
          </div>
        </div>
      );
    },
  },
  {
    id: "description",
    cell: ({ row }) => {
     const data = row.original;
      return (
        <div className="text-start  font-medium -ml-10">
          <div className="">
            <div className="font-bold">
              {data.customerName}-<span className="text-gray-500 font-normal">{data.email}</span>
            </div>
            <div className="text-sm text-gray-700 text-nowrap truncate">
              {data.description}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: () => {
      return (
        <div className="flex items-center gap-8 text-blue-500 ">
          <button className="bg-blue-100 text-blue-600 py-1 px-4 rounded-full">
            Reply
          </button>
        </div>
      );
    },
  },
];

export default columns;
