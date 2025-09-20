import { Category } from "./category";
export interface Product {
  id: number;
  code: string;
  name: string;
  category?: Category;
  price: number;
  stock: number;
  image?: string;
  is_deleted: boolean;
}
