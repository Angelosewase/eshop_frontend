import { ColumnDef, Row } from "@tanstack/react-table";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
 
} from "../../../ui/dialog";

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


 const columns: ColumnDef<Order>[] = [
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

function Actions({ row }: { row: Row<Order> }) {
  const order = row.original;

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(order.id)}
          >
            Copy order ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenu>
            <DialogTrigger asChild>
              <span className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
                View order details
              </span>
            </DialogTrigger>
          </DropdownMenu>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className="p-0 rounded-sm">
        <div className="w-full">
          <div className="flex justify-between items-center pr-10 border-b border-gray-500">
            <div className="flex items-center gap-2 py-3  px-2 font-semibold text-lg">
              <Grip /> Order #1232
            </div>
            <div className="flex items-center gap-3">
              <Redo2 />
            </div>
          </div>
          <div className="mt-5">
            <div className="text-gray-500 text-sm flex items-center gap-4 my-1 px-3">
              <User size={20} />
              <p>Esther Howard</p>
            </div>
            <div className="text-gray-500 text-sm flex items-center gap-4 my-1 px-3">
              <Mail size={20} />
              <p>EstherHoward@gmail.com</p>
            </div>
            <div className="text-gray-500 text-sm flex items-center gap-4 my-1 px-3">
              <Phone size={20} />
              <p>+25072556798</p>
            </div>
          </div>
        </div>

        <div className="mt-2 text-gray-500">
          <div className="flex items-end gap-5 px-4">
            <button className="border-b border-white hover:border-gray-500">
              Order items
            </button>
            <button className="border-b border-white hover:border-gray-500">
              delivery
            </button>
          </div>
          <div className="px-2  pt-3 pb-8 border-t border-b border-gray-500">
            <div className="flex items-center gap-3 text-base leading-5 p-3 ">
              <Image size={35} />
              <p>
                Breathe Right strips x2 Lolem Ipsum Sulut Amet sulut Amet
                black-white
              </p>
            </div>
          </div>
          <div className="flex items-center mt-2 justify-between px-5 py-2 font-semibold">
            <p>Total</p>
            <p className="text-black">$1223</p>
          </div>
        </div>
        <div className="w-full grid grid-cols-3 items-center h-10">
          <button className="   flex text-black hover:bg-gray-500 items-center h-10 justify-center gap-2 text-sm bg-[#AAB2BA3D]/20">
            <ArrowUpFromLine />
            <p>upload</p>
          </button>
          <button className="  flex text-black hover:bg-gray-500 items-center justify-center gap-2 h-10 bg-[#AAB2BA3D]/20">
            <Copy />
            <p>duplicate</p>
          </button>
          <button className=" flex text-black hover:bg-gray-500 items-center justify-center gap-2 h-10 bg-[#AAB2BA3D]/20">
            <Printer />
            <p>print</p>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default columns;
