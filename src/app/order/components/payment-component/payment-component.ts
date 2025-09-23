import { Component, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { faker } from '@faker-js/faker';

import { AuthService } from '../../../core/services/auth-service';
import { CartService } from '../../../core/services/cart-service';
import { OrderService } from '../../../core/services/order-service';

import { CurrencyColombianPipe } from '../../../core/pipes/currency-colombian.pipe';

@Component({
  selector: 'app-payment-component',
  imports: [CurrencyColombianPipe],
  templateUrl: './payment-component.html',
})
export class PaymentComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);

  readonly name = computed(() => this.authService.profile()?.fullname ?? '');
  readonly subtotal = computed(() => this.cartService.subtotal());
  readonly taxes = computed(() => this.cartService.taxes());
  readonly grandTotal = computed(() => this.cartService.grandTotal());

  fakeCreditCardNumber = faker.finance.creditCardNumber();
  fakeCreditCardCvv = faker.finance.creditCardCVV();
  fakeCreditCardExpiration = faker.finance.creditCardNumber();

  async createOrder() {
    try {
      await this.orderService.createOrder();
      this.router.navigate(['/pedido/confirmacion'])
    } catch(e) {
      alert("El pago no pudo ser procesado")
    }

  }
}
