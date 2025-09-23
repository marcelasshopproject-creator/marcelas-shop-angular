import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

/* Components */
import { CartDetail } from './components/cart-detail/cart-detail';
import { CartItemComponent } from './components/cart-item-component/cart-item-component';

/* Services */
import { CartService } from '../core/services/cart-service';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, CartDetail, CartItemComponent],
  templateUrl: './cart.html',
})
export class Cart implements OnInit {
  cartService = inject(CartService);
  cartItems = this.cartService.items$;
  total = this.cartService.total;
  isLoading = this.cartService.isLoading;

  ngOnInit(): void {
    this.cartService.refresh();
  }
}
