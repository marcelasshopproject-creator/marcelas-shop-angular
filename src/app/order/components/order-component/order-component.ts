import { Component, inject, computed, OnInit, signal, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { OrderComponentItems } from '../order-component-items/order-component-items';

import { AuthService } from '../../../core/services/auth-service';
import { CartService } from '../../../core/services/cart-service';

import { CurrencyColombianPipe } from '../../../core/pipes/currency-colombian.pipe';

@Component({
  selector: 'app-order-component',
  imports: [RouterLink, OrderComponentItems, CurrencyColombianPipe],
  templateUrl: './order-component.html',
})
export class OrderComponent implements OnInit {
  private authService = inject(AuthService);
  private cartService = inject(CartService);

  readonly name = computed(() => this.authService.profile()?.fullname ?? '');
  readonly phone = computed(() => this.authService.profile()?.phone ?? '');
  readonly address = computed(() => this.authService.profile()?.address ?? '');
  readonly cartItems = computed(() => this.cartService.items$() ?? []);
  readonly subtotal = computed(() => this.cartService.subtotal())
  readonly taxes = computed(() => this.cartService.taxes())
  readonly grandTotal = computed(() => this.cartService.grandTotal())

  accepTerms = signal<boolean>(false)

  toggleAccept = () => {
    this.accepTerms.update(c => !c)
  }

  ngOnInit(): void {
    this.cartService.loadCart()
  }


}
