import { Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cart-service';

@Component({
  selector: 'app-add-to-cart-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-to-cart-button.html',
})
export class AddToCartButton {
  productId = input.required<number>();
  cartService = inject(CartService);

  showAlert = signal(false);

async addToCart() {
  const success = await this.cartService.addItem(this.productId());

  if (success) {
    this.showAlert.set(true);

    setTimeout(() => {
      this.showAlert.set(false);
    }, 3000);
  }
}

}
