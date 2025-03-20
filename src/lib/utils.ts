import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Order } from "../components/custom/tables/orders/columns";
import { OrderDetails } from "../features/orders/ordersSlice";
import { InventoryProduct } from "../components/custom/tables/inventory/columns";
import { Product } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenNumber(num: number): string {
  if (num >= 1e12) {
    return (num / 1e12).toFixed(1) + 'T';
  }
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + 'B';
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M';
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + 'k';
  }
  return num.toString();
}

export function formatCurrency(amount: number): string {
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

export function formatNumber(num: number): string {
  return shortenNumber(num);
}

export function transformOrderDetailItoOrderI(
  OrderDetails: OrderDetails[]
): Order[] {
  return OrderDetails.map((orderDetail) => ({
    ...orderDetail,
    id: orderDetail.id.toString(),
    user: { email: orderDetail.user.email },
    total: orderDetail.total,
    createdAt: orderDetail.createdAt.toString(),
  }));
}

export function transformProductsIntoInventoryProducts(
  products: Product[]
): Array<InventoryProduct> {
  const transformed = products.map((product) => {
    return {
      id: product.id,
      name: product.name || "",
      category:
        typeof product.category === "string"
          ? product.category
          : product.category?.name || "",
      number: product.productSkus?.reduce((sum, sku) => sum + sku.quantity, 0) || 0,
    };
  });
  return transformed;
}
