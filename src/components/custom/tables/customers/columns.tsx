import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash2, Edit, Mail, Phone, AlertCircle } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import { Badge } from "../../../../components/ui/badge";
import { useState } from "react";

export type Customer = {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string | null;
  role: string;
  status?: "active" | "inactive";
  lastActive?: string;
  joinedDate?: string;
};

const columns = (onDeleteCustomer: (id: string) => void): ColumnDef<Customer>[] => [
  {
    id: "profile",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const firstName = name.split(" ")[0];
      const firstLetter = firstName[0].toUpperCase();
      const lastName = name.split(" ")[1];
      const lastLetter = lastName ? lastName[0].toUpperCase() : "";
      return (
        <div className="flex items-center justify-center font-medium">
          <div className="w-10 h-10 bg-gray-100 rounded-full mr-3 flex items-center justify-center">
            {firstLetter}{lastLetter}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    cell: ({ row }) => {
      return (
        <div className="text-start font-medium -ml-16">{row.getValue("name")}</div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return (
        <div className="text-start font-medium flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-500" />
          <span>{email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.getValue("phoneNumber") as string | null | undefined;
      return (
        <div className="text-start font-medium">
          {phone || "No phone number"}
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <div className="text-start font-medium">
          <Badge variant={role.toLowerCase() === "admin" ? "default" : "secondary"}>
            {role}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string | undefined;
      return (
        <div className="text-start font-medium">
          {status && (
            <Badge variant={status === "active" ? "default" : "destructive"} className={status === "active" ? "bg-green-100 text-green-800" : ""}>
              {status}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-800 hover:bg-red-100"
            onClick={() => {
              if (confirm(`Are you sure you want to delete ${customer.name}? This action cannot be undone.`)) {
                onDeleteCustomer(customer.id);
              }
            }}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem className="cursor-pointer">
                <Edit className="h-4 w-4 mr-2" />
                Edit Customer
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                onClick={() => {
                  if (confirm(`Are you sure you want to delete ${customer.name}? This action cannot be undone.`)) {
                    onDeleteCustomer(customer.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Customer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export default columns;