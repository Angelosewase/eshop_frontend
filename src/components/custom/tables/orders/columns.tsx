import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency } from "../../../../lib/utils";
import { OrderDetails } from "../../../../features/orders/ordersSlice";
import {
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Calendar,
  Package,
} from "lucide-react";
import { Checkbox } from "../../../ui/checkbox";
import { DataTableColumnHeader } from "../ColumnHeader";
import { Badge } from "../../../ui/badge";
import { Actions } from "./Actions";

export type Order = OrderDetails;

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
        <div className="flex items-center">
          <Package className="h-4 w-4 text-muted-foreground mr-2" />
          <span className="font-medium">#{row.getValue("id")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "user.email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="font-medium">{row.original.user.email}</div>
            <div className="text-xs text-muted-foreground">
              Customer ID: {row.original.user.id}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "payment.status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = (row.getValue("payment.status") as string) || "pending";

      const getStatusColor = (status: string) => {
        switch (status) {
          case "paid":
            return "bg-green-100 text-green-800 border-green-200";
          case "pending":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
          case "cancelled":
            return "bg-red-100 text-red-800 border-red-200";
          default:
            return "bg-gray-100 text-gray-800 border-gray-200";
        }
      };

      const getStatusIcon = (status: string) => {
        switch (status) {
          case "paid":
            return <CheckCircle2 className="h-4 w-4 text-green-600" />;
          case "pending":
            return <Clock className="h-4 w-4 text-yellow-600" />;
          case "cancelled":
            return <XCircle className="h-4 w-4 text-red-600" />;
          default:
            return <Clock className="h-4 w-4 text-gray-600" />;
        }
      };

      return (
        <Badge className={`px-2 py-1 ${getStatusColor(status)}`}>
          <span className="flex items-center gap-1.5">
            {getStatusIcon(status)}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </Badge>
      );
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total"));
      return (
        <div className="font-medium text-right">{formatCurrency(amount)}</div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
          <div>
            <div className="font-medium">
              {date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div>
            <div className="text-xs text-muted-foreground">
              {date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
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
