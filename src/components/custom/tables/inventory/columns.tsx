import { ColumnDef } from "@tanstack/react-table";
import { formatPrice } from "../../../../lib/utils";
import { Product } from "../../../../features/inventory/productSlice";
import { DataTableColumnHeader } from "./data-table-column-header.tsx";
import { Checkbox } from "../../../ui/checkbox";
import {
  Tag,
  Pen,
  FolderX,
  SquareArrowOutUpRight,
} from "lucide-react";
import { Button } from "../../../ui/button";
import {
  useDeleteProductMutation,
  useGetProductQuery,
} from "../../../../features/inventory/productSlice";
import { useState } from "react";
import { ViewProductModal } from "../../modals/ViewProductModal";
import { EditProductModal } from "../../modals/EditProductModal";
import { Badge } from "../../../ui/badge";

export interface InventoryProduct extends Omit<Product, 'description' | 'summary' | 'cover' | 'category' | 'subCategories' | 'productSkus' | 'reviews'> {
  number: number;
  description?: string | null;
  summary?: string | null;
  cover?: string | null;
  category?: { id: number; name: string; } | null;
  subCategories?: Array<{ id: number; name: string; }> | null;
  productSkus?: Array<any> | null;
  reviews?: Array<any> | null;
}

const ActionCell = ({ row }: { row: any }) => {
  const [deleteProduct] = useDeleteProductMutation();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: product } = useGetProductQuery(row.original.id);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteProduct(row.original.id);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsViewModalOpen(true)}
        className="h-8 w-8"
      >
        <SquareArrowOutUpRight className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsEditModalOpen(true)}
        className="h-8 w-8"
      >
        <Pen className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        disabled={isLoading}
        className="h-8 w-8"
      >
        <FolderX className="h-4 w-4" />
      </Button>
      {isViewModalOpen && product && (
        <ViewProductModal
          open={isViewModalOpen}
          onOpenChange={() => setIsViewModalOpen(false)}
          product={product}
        />
      )}
      {isEditModalOpen && product && (
        <EditProductModal
          open={isEditModalOpen}
          onOpenChange={() => setIsEditModalOpen(false)}
          product={product}
        />
      )}
    </div>
  );
};

export const columns: ColumnDef<InventoryProduct>[] = [
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
    accessorKey: "number",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "productSkus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const skus = row.getValue("productSkus") as Array<{
        price: string | number;
      }>;
      return formatPrice(skus?.[0]?.price || 0);
    },
  },
  {
    accessorKey: "productSkus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
    cell: ({ row }) => {
      const skus = row.getValue("productSkus") as Array<{
        quantity: number;
      }>;
      const quantity = skus?.[0]?.quantity || 0;
      return (
        <div
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${quantity === 0
            ? "bg-red-100 text-red-800"
            : quantity < 10
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
            }`}
        >
          {quantity}
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
    header: () => <span className="font-medium text-gray-500">Actions</span>,
    cell: ({ row }) => <ActionCell row={row} />,
  },
];

export default columns;
