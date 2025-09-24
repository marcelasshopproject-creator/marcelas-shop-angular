import { Component, input, inject, signal } from '@angular/core';
import { CartService } from '../../../core/services/cart-service';

@Component({
  selector: 'app-add-to-cart-button',
  imports: [],
  templateUrl: './add-to-cart-button.html',
})
export class AddToCartButton {
  productId = input.required<number>();
  cartService = inject(CartService);

  showAlert = signal(false); // Control de alerta

  async addToCart() {
    const success = await this.cartService.addItem(this.productId());

    if (success) {
      // ✅ Mostrar la alerta rosa solo si se agregó bien
      this.showAlert.set(true);

      // Ocultar después de 2.5 segundos
      setTimeout(() => {
        this.showAlert.set(false);
      }, 2500);
    }
  }
}
