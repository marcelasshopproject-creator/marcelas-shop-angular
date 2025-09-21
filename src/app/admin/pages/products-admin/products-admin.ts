import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

/* Services */
import { ProductData } from '../../../core/services/product-data';

/* Interfaces */
import { Product } from '../../../core/interfaces/product';

/* Types */
import { RequestStatus } from '../../../core/types/request-status-type';

/* Pipes */
import { CurrencyColombianPipe } from '../../../core/pipes/currency-colombian.pipe';

@Component({
  selector: 'app-products-admin',
  imports: [RouterLink, CurrencyColombianPipe],
  templateUrl: './products-admin.html',
})
export class ProductsAdmin {
  private productService: ProductData = inject(ProductData);
  requestStatus = signal<RequestStatus>('init');
  products = signal<Product[]>([]);

  async ngOnInit() {
    this.getProducts();
  }

  async getProducts() {
    this.requestStatus.set('loading');
    const { data, error } = await this.productService.getAll();
    if (error) {
      this.requestStatus.set('error');
      this.products.set([]);
    }
    if (data) {
      this.products.set(data);
      this.requestStatus.set('success');
    }
  }

  async delete(id: number) {
    const confirmDelete = confirm('¿Estás seguro de borrar el producto?');
    if (!confirmDelete) return;
    const { error } = await this.productService.delete(id);
    if (error) {
      alert('No se pudo borrar el producto');
    } else {
      this.getProducts();
    }
  }
}
