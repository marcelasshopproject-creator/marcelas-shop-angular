export interface CreateProductDto {
  code: string;
  name: string;
  category: number;
  price: number;
  stock: number;
  image?: string;
  description?: string;
}
