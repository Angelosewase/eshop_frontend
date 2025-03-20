export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  skus: {
    id: number;
    size: string;
    color: string;
    quantity: number;
  }[];
  createdAt: string;
  updatedAt: string;
} 