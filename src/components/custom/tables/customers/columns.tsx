import { ColumnDef } from "@tanstack/react-table";

export type Customer = {
  id: string;
  name:string;
  email: string;
  phoneNumber: string;
  role:string
};

 const columns: ColumnDef<Customer>[] = [
  {
    id: "profile",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const firstName = name.split(" ")[0];
      const firstLetter = firstName[0].toUpperCase();
      const lastName = name.split(" ")[1];
      const lastLetter = lastName ? lastName[0].toUpperCase() : "";
      return (
        <div className="flex items-center justify-center  font-medium">
          <div className="w-10 h-10 bg-gray-100 rounded-full mr-3 flex items-center justify-center">
            {firstLetter}{lastLetter}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    cell: ({ row }) => {
      return (
        <div className="text-start  font-medium -ml-16">{row.getValue("name")}</div>
      );
    },
  },
  {
    accessorKey: "email",
    cell: ({ row }) => {
      return (
        <div className="text-start  font-medium">{row.getValue("email")}</div>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    cell: ({ row }) => {
      return (
        <div className="text-start  font-medium">
          {row.getValue("phoneNumber")}
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    cell: ({ row }) => {
      return (
        <div className="text-start  font-medium">{row.getValue("role")}</div>
      );
    },
  },
  {
    accessorKey: "status",
    cell: ({ row }) => {
      return (
        <div className="text-start  font-medium">{row.getValue("status")}</div>
      );
    },
  },
  {
    id: "actions",
    cell: () => {
      return <div className="flex items-center gap-8 text-blue-500 ">
        <button className="bg-red-100 text-red-600 py-1 px-4 rounded-full">Delete</button>
      </div>;
    },
  },
];


export default columns;