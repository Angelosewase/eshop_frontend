import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Order } from "../components/custom/tables/orders/columns";
import { OrderDetails } from "../features/orders/ordersSlice";
import { InventoryProduct } from "../components/custom/tables/inventory/columns";
import { Product } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function transformOrderDetailItoOrderI(
  OrderDetails: OrderDetails[]
): Order[] {
  return OrderDetails.map((orderDetail) => ({
    id: orderDetail.id.toString(),
    customerName: orderDetail.user.email,
    type: "online",
    status: "pending",
    product: "product",
    amount: orderDetail.total,
    date: orderDetail.createdAt.toString(),
  }));
}

export function transformProductsIntoInventoryProducts(
  products: Product[]
): Array<InventoryProduct> {
  return products.map((product) => ({
    id: product.id.toString() || "",
    name: product.name || "",
    category:
      typeof product.category === "string"
        ? product.category
        : product.category?.name || "",
    number: 20,
  }));
}
