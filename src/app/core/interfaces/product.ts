export interface Product {
  id: number;
  code: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
  is_deleted: boolean;
}
