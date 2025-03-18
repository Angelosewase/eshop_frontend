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
    cell: ({ row }) => {
      const [deleteProduct] = useDeleteProductMutation();
      const product = row.original;
      const [viewModalOpen, setViewModalOpen] = useState(false);
      const [editModalOpen, setEditModalOpen] = useState(false);

      // Ensure we have a valid product ID for the query
      const productId = Number(product.id);
      const skipQuery = (!viewModalOpen && !editModalOpen) || isNaN(productId);

      const { data: fullProduct } = useGetProductQuery(productId, {
        skip: skipQuery
      });

      if (isNaN(productId)) {
        console.error('Invalid product ID in table row:', product.id);
      }

      // Only show modals if we have valid product data
      const showModals = fullProduct && typeof fullProduct.id === 'number' && !isNaN(Number(fullProduct.id));

      const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this product?')) {
          try {
            const productId = Number(product.id);
            if (isNaN(productId)) {
              console.error('Invalid product ID:', product.id);
              return;
            }

            await deleteProduct(productId).unwrap();
            toast.success('Product deleted successfully');
          } catch (error: any) {
            console.error('Failed to delete product:', error);
            toast.error('Failed to delete product');
          }
        }
      };

      const handleViewClick = () => {
        // Ensure product ID is valid before opening the modal
        if (typeof product.id === 'number' && !isNaN(product.id)) {
          setViewModalOpen(true);
        } else {
          console.error('Invalid product ID for view:', product.id);
          toast.error('Cannot view product: Invalid ID');
        }
      };

      const handleEditClick = () => {
        if (typeof product.id === 'number' && !isNaN(product.id)) {
          setEditModalOpen(true);
        } else {
          console.error('Invalid product ID for edit:', product.id);
          toast.error('Cannot edit product: Invalid ID');
        }
      };

      return (
        <>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
              onClick={handleEditClick}
              title="Edit Product"
            >
              <Pen size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
              onClick={handleViewClick}
              title="View Product"
            >
              <SquareArrowOutUpRight size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={handleDelete}
              title="Delete Product"
            >
              <FolderX size={16} />
            </Button>
          </div>

          {showModals && (
            <>
              <ViewProductModal
                product={fullProduct}
                open={viewModalOpen}
                onOpenChange={setViewModalOpen}
              />
              <EditProductModal
                product={fullProduct}
                open={editModalOpen}
                onOpenChange={setEditModalOpen}
              />
            </>
          )}
        </>
      );
    },
  },
];

export default columns;