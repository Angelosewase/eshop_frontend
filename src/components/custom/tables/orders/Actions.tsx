import { Row } from "@tanstack/react-table";
import { Order } from "./columns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, MoreHorizontal, Printer, Redo2 } from "lucide-react";
import ViewOrderModal from "../../modals/ViewOrderModal";

export function Actions({ row }: { row: Row<Order> }) {
  const order = row.original;

  return (
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
          onClick={() => navigator.clipboard.writeText(order.id.toString())}
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy order ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <ViewOrderModal order={order} />
        <DropdownMenuItem>
          <Printer className="h-4 w-4 mr-2" />
          Print order
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Redo2 className="h-4 w-4 mr-2" />
          Refresh order status
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
