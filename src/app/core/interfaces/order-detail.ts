export interface OrderDetail {
  id: number;
  created_at: string;
  subtotal: number;
  taxes: number;
  grandtotal: number;

  customer: {
    fullname: string;
    phone: string;
    address: string;
  };
}
