import { Product } from "./product";
export interface CartItem {
  id: number;
  user_id: string;
  product: Product;
  quantity: number;
}
