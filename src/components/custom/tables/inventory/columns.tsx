import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../../../ui/checkbox";
import { FolderX, Pen, SquareArrowOutUpRight, Package, Tag, AlertCircle } from "lucide-react";
import { Button } from "../../../ui/button";
import { useDeleteProductMutation } from "../../../../features/inventory/productSlice";
import { useState } from "react";
import { ViewProductModal } from "../../modals/ViewProductModal";
import { EditProductModal } from "../../modals/EditProductModal";
import { useGetProductQuery } from "../../../../features/inventory/productSlice";
import { toast } from "sonner";
import { Badge } from "../../../ui/badge";

export type InventoryProduct = {
  id: number;
  name: string;
  category: string;
  number: number;
};

const ActionCell = ({ row }: { row: any }) => {
  const [deleteProduct] = useDeleteProductMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: product } = useGetProductQuery(row.original.id);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteProduct(row.original.id);
      setIsOpen(false);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
    setIsLoading(false);
  };

  return (
    <div>
      {/* Add your action cell content here */}
    </div>
  );
};

const columns: ColumnDef<InventoryProduct>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: unknown) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: unknown) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: () => (
      <div className="flex items-center gap-2">
        <Package className="h-4 w-4 text-gray-500" />
        <span className="font-medium text-gray-500">Product</span>
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium">{row.getValue("name")}</div>
      );
    },
  },
  {
    accessorKey: "number",
    header: () => (
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-gray-500" />
        <span className="font-medium text-gray-500">Inventory</span>
      </div>
    ),
    cell: ({ row }) => {
      const quantity = row.getValue("number") as number;
      return (
        <div className="font-medium">
          {quantity <= 0 ? (
            <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
              Out of Stock
            </Badge>
          ) : quantity < 10 ? (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
              Low Stock: {quantity}
            </Badge>
          ) : (
            <span>{quantity} in stock</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: () => (
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-gray-500" />
        <span className="font-medium text-gray-500">Category</span>
      </div>
    ),
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      return (
        <Badge variant="secondary" className="font-medium">
          {category}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <span className="font-medium text-gray-500">Actions</span>
    ),
    cell: ({ row }) => <ActionCell row={row} />
  },
];

export default columns;