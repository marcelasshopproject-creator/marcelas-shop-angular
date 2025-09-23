import { Component, inject, computed, OnInit, signal } from '@angular/core';

import { OrderComponentItems } from '../order-component-items/order-component-items';

import { AuthService } from '../../../core/services/auth-service';
import { CartService } from '../../../core/services/cart-service';

@Component({
  selector: 'app-order-component',
  imports: [OrderComponentItems],
  templateUrl: './order-component.html',
})
export class OrderComponent implements OnInit {
  private authService = inject(AuthService);
  private cartService = inject(CartService);

  readonly name = computed(() => this.authService.profile()?.fullname ?? '');
  readonly phone = computed(() => this.authService.profile()?.phone ?? '');
  readonly address = computed(() => this.authService.profile()?.address ?? '');
  readonly cartItems: any = computed(() => this.cartService.items$() ?? []);

  ngOnInit(): void {
    this.cartService.loadCart()
  }


}
