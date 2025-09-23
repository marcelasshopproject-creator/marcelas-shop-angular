import { Component, inject, AfterViewInit, effect } from '@angular/core';
import { RouterLink } from '@angular/router';

/* Components */
import { CartItemComponent } from './components/cart-item-component/cart-item-component';

/* Services */
import { CartService } from '../core/services/cart-service';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, CartItemComponent],
  templateUrl: './cart.html',
})
export class Cart implements AfterViewInit {
  cartService = inject(CartService);
  cartItems = this.cartService.items$;
  total = this.cartService.total;
  isLoading = this.cartService.isLoading;

  ngAfterViewInit(): void {
    this.cartService.refresh();
  }
}
