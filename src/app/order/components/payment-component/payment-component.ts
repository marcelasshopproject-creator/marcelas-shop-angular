import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { faker } from '@faker-js/faker';

import { AuthService } from '../../../core/services/auth-service';
import { CartService } from '../../../core/services/cart-service';

import { CurrencyColombianPipe } from '../../../core/pipes/currency-colombian.pipe';

@Component({
  selector: 'app-payment-component',
  imports: [RouterLink, CurrencyColombianPipe],
  templateUrl: './payment-component.html'
})
export class PaymentComponent {
  private authService = inject(AuthService);
  private cartService = inject(CartService);

  readonly name = computed(() => this.authService.profile()?.fullname ?? '');
  readonly subtotal = computed(() => this.cartService.subtotal())
  readonly taxes = computed(() => this.cartService.taxes())
  readonly grandTotal = computed(() => this.cartService.grandTotal())

  fakeCreditCardNumber = faker.finance.creditCardNumber()
  fakeCreditCardCvv = faker.finance.creditCardCVV()
  fakeCreditCardExpiration = faker.finance.creditCardNumber()
}
