import { Component, input, inject } from '@angular/core';

/* Services */
import { CartService } from '../../../core/services/cart-service';

@Component({
  selector: 'app-add-to-cart-button',
  imports: [],
  templateUrl: './add-to-cart-button.html',
})
export class AddToCartButton {
  productId = input.required<number>();

  /* Services */
  cartService = inject(CartService);

  async addToCart() {
    this.cartService.addItem(this.productId());
  }
}
