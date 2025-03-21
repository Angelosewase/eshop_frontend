import { Row } from "@tanstack/react-table";
import { Order } from "./columns";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export function Actions({ row }: { row: Row<Order> }) {
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
              <Grip /> Order #{order.id}
            </div>
            <div className="flex items-center gap-3">
              <Redo2 />
            </div>
          </div>
          <div className="mt-5">
            <div className="text-gray-500 text-sm flex items-center gap-4 my-1 px-3">
              <User size={20} />
              <p>{order.customerName}</p>
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
              <p>{order.product}</p>
            </div>
          </div>
          <div className="flex items-center mt-2 justify-between px-5 py-2 font-semibold">
            <p>Total</p>
            <p className="text-black">${order.amount}</p>
          </div>
        </div>
        <div className="w-full grid grid-cols-3 items-center h-10">
          <button className="flex text-black hover:bg-gray-500 items-center h-10 justify-center gap-2 text-sm bg-[#AAB2BA3D]/20">
            <ArrowUpFromLine />
            <p>upload</p>
          </button>
          <button className="flex text-black hover:bg-gray-500 items-center justify-center gap-2 h-10 bg-[#AAB2BA3D]/20">
            <Copy />
            <p>duplicate</p>
          </button>
          <button className="flex text-black hover:bg-gray-500 items-center justify-center gap-2 h-10 bg-[#AAB2BA3D]/20">
            <Printer />
            <p>print</p>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
