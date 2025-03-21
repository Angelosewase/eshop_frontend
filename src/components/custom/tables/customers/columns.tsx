import { ColumnDef } from "@tanstack/react-table";
import { Mail, Trash2 } from "lucide-react";
import { DataTableColumnHeader } from "./data-table-column-header.tsx";
import { Button } from "@/components/ui/button";

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  lastOrder: string;
  totalOrders: number;
  role: "USER" | "ADMIN";
}

export const columns = (handleDelete: (id: string) => void): ColumnDef<Customer>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span className="font-medium">{row.getValue("name")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{row.getValue("email")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status === "active"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
            }`}
        >
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "lastOrder",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Order" />
    ),
  },
  {
    accessorKey: "totalOrders",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Orders" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDelete(row.original.id.toString())}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      );
    },
  },
];

export default columns;
