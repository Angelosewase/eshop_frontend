export interface User {
  id: number;
  avatar?: string;
  firstName: string | null;
  lastName: string | null;
  username: string;
  email: string | null;
  password: string;
  phoneNumber: string | null;
  role: "USER" | "ADMIN";
  createdAt: Date;
  deletedAt?: Date;
  addresses?: Address[];
  cart?: Cart;
  orderDetails?: OrderDetail[];
  wishlist?: Wishlist[];
  reviews?: Review[];
}

export interface Address {
  id: number;
  userId: number;
  title?: string;
  addressLine1: string;
  addressLine2?: string;
  country: string;
  city: string;
  postalCode: string;
  landmark?: string;
  phoneNumber: string;
  createdAt: Date;
  deletedAt?: Date;
  user?: User;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  deletedAt?: Date;
  subCategories?: SubCategory[];
  products?: Product[];
}

export interface SubCategory {
  id: number;
  parentId: number;
  name: string;
  description?: string;
  createdAt: Date;
  deletedAt?: Date;
  category?: Category;
  products?: Product[];
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  summary?: string;
  cover?: string;
  categoryId: number;
  createdAt: Date;
  deletedAt?: Date;
  category?: Category;
  subCategories?: SubCategory[];
  productSkus?: ProductSku[];
  wishlist?: Wishlist[];
  cartItems?: CartItem[];
  orderItems?: OrderItem[];
  reviews?: Review[];
}

export interface ProductAttribute {
  id: number;
  type: string;
  value: string;
  createdAt: Date;
  deletedAt?: Date;
  skusSize?: ProductSku[];
  skusColor?: ProductSku[];
}

export interface ProductSku {
  id: number;
  productId: number;
  sizeAttributeId: number;
  colorAttributeId: number;
  sku: string;
  price: string;
  quantity: number;
  createdAt: Date;
  deletedAt?: Date;
  product?: Product;
  sizeAttribute?: ProductAttribute;
  colorAttribute?: ProductAttribute;
  cartItems?: CartItem[];
  orderItems?: OrderItem[];
}

export interface Wishlist {
  id: number;
  userId: number;
  productId: number;
  createdAt: Date;
  deletedAt?: Date;
  user?: User;
  product?: Product;
}

export interface Cart {
  id: number;
  userId: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  items?: CartItem[];
}

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  productsSkuId: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  cart?: Cart;
  product?: Product;
  productSku?: ProductSku;
}

export interface OrderDetail {
  id: number;
  userId: number;
  paymentId: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  items?: OrderItem[];
  payment?: PaymentDetail;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productsSkuId: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  order?: OrderDetail;
  product?: Product;
  productSku?: ProductSku;
}

export interface PaymentDetail {
  id: number;
  orderId: number;
  amount: number;
  provider: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  order?: OrderDetail;
}

export interface Review {
  id: number;
  rating: number;
  comment?: string;
  productId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  product?: Product;
  user?: User;
}
