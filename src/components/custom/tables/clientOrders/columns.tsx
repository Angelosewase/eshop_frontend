import { ColumnDef, Row } from "@tanstack/react-table";

import {
  Dialog,
  DialogContent,
  DialogTrigger,

} from "../../../ui/dialog";

import { OrderStatus } from './OrderStatus';
import { Actions } from "./Actions";

export type Order = {
  id: string;
  customerName: string;
  type: "online" | "offline";
  status: "pending" | "processing" | "success" | "failed";
  product: string;
  amount: number;
  date: string;
};

import {
  ArrowUpFromLine,
  Copy,
  Grip,
  Image,
  Mail,
  MoreHorizontal,
  Phone,
  Printer,
  Redo2,
  User,
} from "lucide-react";

import { Button } from "../../..//ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../..//ui/dropdown-menu";
import { Checkbox } from "../../../ui/checkbox";
import { DataTableColumnHeader } from "../ColumnHeader";

export const columns: ColumnDef<Order>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order ID" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-start  font-medium">{row.getValue("id")}</div>
      );
    },
  },

  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-start  font-medium">{row.getValue("type")}</div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-start  font-medium">{row.getValue("status")}</div>
      );
    },
  },
  {
    accessorKey: "product",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-start  font-medium">{row.getValue("product")}</div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-start font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-start  font-medium">{row.getValue("date")}</div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <Actions row={row} />;
    },
  },
];

export default columns;
