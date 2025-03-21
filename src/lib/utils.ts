import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { OrderDetails } from "../features/orders/ordersSlice";
import { InventoryProduct } from "../components/custom/tables/inventory/columns";
import { Product as ProductFromSlice } from "../features/inventory/productSlice";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (cents: string | number | null | undefined) => {
  if (cents === undefined || cents === null) return "$0.00";
  const amount = typeof cents === "string" ? parseFloat(cents) : Number(cents);
  if (isNaN(amount)) return "$0.00";
  const dollars = amount / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(dollars);
};

export const safeParseFloat = (
  value: string | number | null | undefined,
): number => {
  if (value === undefined || value === null) return 0;
  const parsed = typeof value === "string" ? parseFloat(value) : Number(value);
  return isNaN(parsed) ? 0 : parsed;
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("en-US").format(num);
};

export const shortenNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + "B";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
};

export function formatCurrency(amount: number): string {
  const shortened = shortenNumber(amount);
  if (shortened.includes("k")) {
    return `$${shortened}`;
  } else if (shortened.includes("M")) {
    return `$${shortened}`;
  } else if (shortened.includes("B")) {
    return `$${shortened}`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export const transformOrderDetailItoOrderI = (orderDetails: OrderDetails[]) => {
  return orderDetails.map((orderDetail) => ({
    id: orderDetail.id,
    user: { email: orderDetail.user?.email || "" },
    total: orderDetail.total,
    createdAt: orderDetail.createdAt,
    userId: orderDetail.userId,
    paymentId: orderDetail.paymentId,
    updatedAt: orderDetail.updatedAt,
    items: orderDetail.items || [],
    payment: {
      status: orderDetail.payment?.status || "pending",
    },
  }));
};

export function transformProductsIntoInventoryProducts(
  products: ProductFromSlice[],
): Array<InventoryProduct> {
  const transformed = products.map((product) => ({
    ...product,
    number: product.productSkus?.reduce((sum, sku) => sum + sku.quantity, 0) || 0
  }));
  return transformed;
}
