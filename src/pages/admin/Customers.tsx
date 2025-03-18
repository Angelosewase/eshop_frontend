import {
  CustomersTable,
} from "../../components/custom/tables/customers";
import columns from "../../components/custom/tables/customers/columns";
import { useGetCustomersQuery } from "../../features/users/userSlice";
import { Card } from "../../components/ui/card";
import { Users, UserPlus, UserCheck, UserX } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useState, useEffect } from "react";
import { Customer } from "../../components/custom/tables/customers/columns";
import { toast } from "sonner";

function Customers() {
  const { data, isLoading } = useGetCustomersQuery();
  const [filterRole, setFilterRole] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [processedCustomers, setProcessedCustomers] = useState<Customer[]>([]);

  // Process the data to ensure all required fields are present
  useEffect(() => {
    if (data?.users) {
      const processed = data.users.map(customer => ({
        ...customer,
        // Ensure required fields are never undefined
        phoneNumber: customer.phoneNumber || null,
        email: customer.email || "No email provided"
      }));
      setProcessedCustomers(processed);
    }
  }, [data]);

  const filteredCustomers = processedCustomers.filter(customer => {
    const matchesSearch = searchTerm === "" ||
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "all" || customer.role.toLowerCase() === filterRole.toLowerCase();

    return matchesSearch && matchesRole;
  });

  const stats = {
    total: processedCustomers.length,
    active: processedCustomers.filter(user => user.role === "USER").length,
    admins: processedCustomers.filter(user => user.role === "ADMIN").length,
  };

  // Handle customer deletion
  const handleDeleteCustomer = (customerId: string) => {
    // In a real application, you would call an API to delete the customer
    // For now, we'll just update the local state
    const updatedCustomers = processedCustomers.filter(
      customer => customer.id !== customerId
    );
    setProcessedCustomers(updatedCustomers);

    // Show success toast
    toast.success("Customer deleted successfully");
  };

  return (
    <div className="min-h-screen space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add New Customer
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6 flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Users className="h-6 w-6 text-blue-700" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{stats.total}</h3>
            <p className="text-sm text-gray-500">Total Customers</p>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-full">
            <UserCheck className="h-6 w-6 text-green-700" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{stats.active}</h3>
            <p className="text-sm text-gray-500">Active Users</p>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-full">
            <UserX className="h-6 w-6 text-purple-700" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{stats.admins}</h3>
            <p className="text-sm text-gray-500">Admin Users</p>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="user">Users</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">Export</Button>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg border">
        {isLoading ? (
          <div className="p-8 text-center">Loading customers...</div>
        ) : (
          <CustomersTable
            data={filteredCustomers}
            columns={columns(handleDeleteCustomer)}
          />
        )}
      </div>
    </div>
  );
}

export default Customers;
