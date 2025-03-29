import { Avatar } from "../ui/avatar";

interface Order {
  total: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

interface RecentSalesProps {
  data: Order[];
}

export function RecentSales({ data }: RecentSalesProps) {
  return (
    <div className="space-y-8">
      {data.map((order, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <span className="font-medium">
              {order.user?.name?.charAt(0) || "U"}
            </span>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium">{order.user?.name}</p>
            <p className="text-sm text-muted-foreground">{order.user?.email}</p>
          </div>
          <div className="ml-auto font-medium">
            +${parseFloat(order.total || "0").toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecentSales;
