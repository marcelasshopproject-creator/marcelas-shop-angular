export interface CreateOrderItemDto {
  order_id: number;
  product: number;
  quantity: number;
  price_at_time: number;
}
