import { Product } from './product';

export interface OrderItem {
  id: number;
  order_id: number;
  product: Product;
  quantity: number;
  price_at_time: number;
}
