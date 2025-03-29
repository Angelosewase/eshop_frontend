import { Column } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDown } from "lucide-react";
import { Button } from "../../../ui/button";

interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className="text-sm font-medium text-gray-500">{title}</div>;
  }

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting()}
      className="-ml-4 h-8 data-[state=open]:bg-accent"
    >
      <span className="text-sm font-medium text-gray-500">{title}</span>
      {{
        asc: <ArrowUpIcon className="ml-2 h-4 w-4" />,
        desc: <ArrowDownIcon className="ml-2 h-4 w-4" />,
      }[column.getIsSorted() as string] ?? (
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        )}
    </Button>
  );
} 

export default DataTableColumnHeader;
