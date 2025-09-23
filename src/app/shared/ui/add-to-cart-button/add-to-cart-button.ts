import { Component, OnInit, input, inject, signal } from '@angular/core';

/* Services */
import { CartItemData } from '../../../core/services/cart-item-data';
import { AuthService } from '../../../core/services/auth-service';
import { UploadImageService } from '../../../core/services/upload-image-service';

import { CreateCartItemDto } from '../../../core/dtos/create-cart-item.dto';
import { UpdateCartItemDto } from '../../../core/dtos/update-cart-item.dto';

@Component({
  selector: 'app-add-to-cart-button',
  imports: [],
  templateUrl: './add-to-cart-button.html',
})
export class AddToCartButton {
  productId = input.required<number>();

  /* Services */
  authService = inject(AuthService);
  cartItemService = inject(CartItemData);

  async addToCart() {
    const user_id = this.authService.profile()?.id as string;
    try {
      const { data: dataGet } = await this.cartItemService.get(user_id, this.productId());
      if (!dataGet) {
        const item: CreateCartItemDto = {
          user_id,
          product: this.productId(),
          quantity: 1,
        };
        const { error: errorNewItem } = await this.cartItemService.create(item);
        if (errorNewItem) {
          alert('No se pudo agregar el producto');
        }
      } else {
        const newQuantity = (dataGet.quantity += 1);
        console.log(newQuantity);
        const dto: UpdateCartItemDto = { quantity: newQuantity };
        await this.cartItemService.update(user_id, this.productId(), dto);
      }
    } catch (e) {
      alert('No se puedo agregar el producto');
    }
  }
}
