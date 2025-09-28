import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

/* Services */
import { CartService } from '../../../core/services/cart-service';

import { CurrencyColombianPipe } from '../../../core/pipes/currency-colombian.pipe';

@Component({
  selector: 'app-cart-detail',
  imports: [RouterLink, CurrencyColombianPipe],
  templateUrl: './cart-detail.html',
})
export class CartDetail {
  cartService = inject(CartService);
}
