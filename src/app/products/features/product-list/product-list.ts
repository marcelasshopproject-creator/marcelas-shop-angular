import { Component, OnInit, inject, signal } from '@angular/core';

/* Components */
import { Loading } from '../../../shared/ui/loading/loading';
import { ProductListItem } from '../product-list-item/product-list-item';

/* Services */
import { ProductData } from '../../../core/services/product-data';

/* Interfaces */
import { Product } from '../../../core/interfaces/product';

/* Types */
import { RequestStatus } from '../../../core/types/request-status-type';
@Component({
  selector: 'app-product-list',
  imports: [ProductListItem, Loading],
  templateUrl: './product-list.html',
})
export class ProductList implements OnInit {
  /* Services */
  private productService = inject(ProductData);

  /* Signals */
  products = signal<Product[]>([]);
  requestStatus = signal<RequestStatus>('init');

  ngOnInit(): void {
    this.getProducts();
  }

  async getProducts() {
    this.requestStatus.set('loading');
    const { error, data } = await this.productService.getAllAvailable();
    if (error) {
      alert("No se pudieron descargar los productos")
      this.requestStatus.set('error');
    }
    if (data) {
      this.products.set(data);
      this.requestStatus.set('success');
    }
  }
}
