import { useGetOrdersQuery } from "../../features/orders/ordersSlice";
import { useGetProductsQuery } from "../../features/inventory/productSlice";
import { Card, CardHeader, CardTitle } from "../../components/ui/card";
import { Overview, RecentSales } from "../../components/custom";

function Dashboard() {
  const { data: ordersData } = useGetOrdersQuery();
  const { data: productsData } = useGetProductsQuery({});

  const totalOrders = ordersData?.orders?.length || 0;
  const totalRevenue =
    ordersData?.orders?.reduce(
      (acc, order) => acc + parseFloat(order.total || "0"),
      0,
    ) || 0;
  const totalProducts = productsData?.products?.length || 0;
  const totalInventoryValue =
    productsData?.products?.reduce((acc, product) => {
      const price = parseFloat(product.productSkus?.[0]?.price || "0");
      const quantity = product.productSkus?.[0]?.quantity || 0;
      return acc + price * quantity;
    }, 0) || 0;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <p className="text-2xl font-bold">{totalOrders}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <p className="text-2xl font-bold">{totalProducts}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Inventory Value
            </CardTitle>
            <p className="text-2xl font-bold">
              ${totalInventoryValue.toFixed(2)}
            </p>
          </CardHeader>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <Overview data={ordersData?.orders || []} />
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <RecentSales data={ordersData?.orders?.slice(0, 5) || []} />
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
