import { OrderDetails } from "../../../features/orders/ordersSlice";
import { formatCurrency } from "../../../lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "../../ui/dialog";
import {
  ArrowUpFromLine,
  Copy,
  Printer,
  Redo2,
  User,
  Calendar,
  CreditCard,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { Badge } from "../../ui/badge";
import { Separator } from "../../ui/separator";
import { Button } from "../../ui/button";

interface ViewOrderModalProps {
  order: OrderDetails;
}

export default function ViewOrderModal({ order }: ViewOrderModalProps) {
  // Ensure payment status exists, default to "pending" if not
  const paymentStatus = order.payment?.status || "pending";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
          View order details
        </span>
      </DialogTrigger>
      <DialogContent className="p-0 rounded-lg max-w-3xl">
        {/* Header */}
        <div className="w-full bg-gray-50 rounded-t-lg">
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">Order #{order.id}</h2>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`px-3 py-1 ${getStatusColor(paymentStatus)}`}>
                <span className="flex items-center gap-1.5">
                  {getStatusIcon(paymentStatus)}
                  {paymentStatus.charAt(0).toUpperCase() +
                    paymentStatus.slice(1)}
                </span>
              </Badge>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Redo2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-lg">Customer Information</h3>
              <p className="text-muted-foreground">{order.user.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium capitalize">
                  {(order.payment as any)?.method || "Credit Card"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Shipping Method</p>
                <p className="font-medium">Standard Delivery</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="p-6">
          <div className="flex items-center gap-6 mb-6">
            <h3 className="text-lg font-medium">Order Items</h3>
            <Separator className="flex-1" />
          </div>

          <div className="space-y-6">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-3 border-b border-dashed last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://via.placeholder.com/64?text=No+Image";
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{item.product.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(Number(item.price || 0))} ×{" "}
                        {item.quantity}
                      </p>
                      {(item.product as any).sku && (
                        <p className="text-xs text-muted-foreground px-2 py-0.5 bg-gray-100 rounded">
                          SKU: {(item.product as any).sku}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <p className="font-medium">
                  {formatCurrency(
                    Number(item.price || 0) * Number(item.quantity || 0),
                  )}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">
                  {formatCurrency(order.total)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">{formatCurrency(0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">{formatCurrency(0)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount</span>
                <span className="text-xl font-semibold">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 border-t">
          <Button
            variant="ghost"
            className="flex items-center justify-center gap-2 py-6 rounded-none hover:bg-gray-50"
          >
            <ArrowUpFromLine className="h-4 w-4" />
            <span>Upload</span>
          </Button>
          <Button
            variant="ghost"
            className="flex items-center justify-center gap-2 py-6 rounded-none hover:bg-gray-50 border-x"
          >
            <Copy className="h-4 w-4" />
            <span>Duplicate</span>
          </Button>
          <Button
            variant="ghost"
            className="flex items-center justify-center gap-2 py-6 rounded-none hover:bg-gray-50"
          >
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
