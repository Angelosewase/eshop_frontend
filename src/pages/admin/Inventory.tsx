import { PageHeaderWithIcons } from "../../components/custom";
import StatisticsCard, {
  statisticsCardPropsInterface,
} from "../../components/custom/StatisticsCard";
import {
  InventoryColumns,
  InventoryDataTable,
} from "../../components/custom/tables/inventory";
import {
  AddInventoryProduct,
  StyledAddInventoryProduct
} from "../../components/custom/modals";
import { useGetProductsQuery } from "../../features/inventory/productSlice";
import { transformProductsIntoInventoryProducts } from "../../lib/utils";
import { Progress } from "../../components/ui/progress";
import {
  Package,
  DollarSign,
  Users,
  AlertCircle,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Plus
} from "lucide-react";
import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../components/ui/dialog";

function formatCurrency(amount: number): string {
  const shortened = shortenNumber(amount);
  if (shortened.includes('k')) {
    return `$${shortened}`;
  } else if (shortened.includes('M')) {
    return `$${shortened}`;
  } else if (shortened.includes('B')) {
    return `$${shortened}`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function shortenNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

function Inventory() {
  const { data: productsData, isLoading } = useGetProductsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTab, setSelectedTab] = useState("all");

  // Calculate statistics
  const stats = {
    totalProducts: productsData?.products?.length || 0,
    totalVolume: productsData?.products?.reduce(
      (acc, product) => acc + (product.productSkus?.[0]?.quantity || 0),
      0
    ) || 0,
    totalValue: productsData?.products?.reduce(
      (acc, product) =>
        acc + (product.productSkus?.[0]?.price || 0) * (product.productSkus?.[0]?.quantity || 0),
      0
    ) || 0,
    partnerProducts: productsData?.products?.filter(
      (product) => product.isPartnerProduct
    ).length || 0,
    lowStockItems: productsData?.products?.filter(
      (product) => (product.productSkus?.[0]?.quantity || 0) < 10 && (product.productSkus?.[0]?.quantity || 0) > 0
    ).length || 0,
    outOfStock: productsData?.products?.filter(
      (product) => (product.productSkus?.[0]?.quantity || 0) === 0
    ).length || 0,
  };

  // Filter products based on search term and category
  const filteredProducts = productsData?.products?.filter(product => {
    const matchesSearch = searchTerm === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "all" ||
      (product.category?.name || "").toLowerCase() === selectedCategory.toLowerCase();

    const matchesTab = selectedTab === "all" ||
      (selectedTab === "low-stock" && (product.productSkus?.[0]?.quantity || 0) < 10 && (product.productSkus?.[0]?.quantity || 0) > 0) ||
      (selectedTab === "out-of-stock" && (product.productSkus?.[0]?.quantity || 0) === 0) ||
      (selectedTab === "partner" && product.isPartnerProduct);

    return matchesSearch && matchesCategory && matchesTab;
  });

  // Get unique categories
  const categories = ["all", ...new Set(productsData?.products?.map(product => product.category?.name || "").filter(Boolean))];

  if (isLoading) {
    return (
      <div className="flex-1 p-8 h-full">
        <PageHeaderWithIcons title="Inventory" />
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {[...Array(4)].map((_, idx) => (
            <Card key={idx} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="w-full flex items-center justify-center mt-12">
          <Progress className="w-56" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <StyledAddInventoryProduct />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(stats.totalProducts)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatNumber(stats.totalVolume)} units in stock
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inventory Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(stats.totalValue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatNumber(stats.totalVolume)} units
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Partner Products
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(stats.partnerProducts)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((stats.partnerProducts / stats.totalProducts) * 100).toFixed(1)}% of inventory
            </p>
          </CardContent>
        </Card>
        <Card className={stats.lowStockItems > 0 ? "border-red-200 bg-red-50" : ""}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className={`text-sm font-medium ${stats.lowStockItems > 0 ? "text-red-500" : "text-muted-foreground"}`}>
              Low Stock Alert
            </CardTitle>
            <AlertCircle className={`h-4 w-4 ${stats.lowStockItems > 0 ? "text-red-500" : "text-muted-foreground"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${stats.lowStockItems > 0 ? "text-red-600" : ""}`}>
              {formatNumber(stats.lowStockItems)}
            </div>
            <p className={`text-xs ${stats.lowStockItems > 0 ? "text-red-500" : "text-muted-foreground"} mt-1`}>
              {stats.outOfStock} out of stock
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between my-6 gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Sort
          </Button>
        </div>
      </div>

      {/* Tabs and Table */}
      <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
          <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
          <TabsTrigger value="partner">Partner Products</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <InventoryDataTable
                columns={InventoryColumns}
                data={transformProductsIntoInventoryProducts(filteredProducts || [])}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="low-stock" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <InventoryDataTable
                columns={InventoryColumns}
                data={transformProductsIntoInventoryProducts(filteredProducts || [])}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="out-of-stock" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <InventoryDataTable
                columns={InventoryColumns}
                data={transformProductsIntoInventoryProducts(filteredProducts || [])}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="partner" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <InventoryDataTable
                columns={InventoryColumns}
                data={transformProductsIntoInventoryProducts(filteredProducts || [])}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Inventory;
