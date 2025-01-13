import { ColumnDef, Row } from "@tanstack/react-table";

export type InventoryProduct = {
  id: string;
  name: string;
  category: string;
  number: number;
};
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "../ColumnHeader";

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
      <h1 className="text-start  font-medium text-gray-500">Product</h1>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-start  font-medium">{row.getValue("name")}</div>
      );
    },
  },
  {
    accessorKey: "number",
    header: () => (
      <h1 className="text-start  font-medium text-gray-500">Inventory</h1>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-start  font-medium">{row.getValue("number")}</div>
      );
    },
  },
  {
    accessorKey: "category",

    header: () => (
      <h1 className="text-start  font-medium text-gray-500">Category</h1>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-start  font-medium">
          {row.getValue("category")}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <h1 className="text-start  font-medium text-gray-500">Category</h1>
    ),
    cell: () => {
      return <div className="text-start font-medium">Actions</div>;
    },
  },
];


export default columns;