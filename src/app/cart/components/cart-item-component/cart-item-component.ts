import { Component, OnInit, input, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

/* Services */
import { CartService } from '../../../core/services/cart-service';
import { UploadImageService } from '../../../core/services/upload-image-service';

/* Interfaces */
import { CartItem } from '../../../core/interfaces/cart-item';

/* Pipes */
import { CurrencyColombianPipe } from '../../../core/pipes/currency-colombian.pipe';

@Component({
  selector: 'app-cart-item-component',
  imports: [RouterLink, CurrencyColombianPipe],
  templateUrl: './cart-item-component.html',
})
export class CartItemComponent implements OnInit {
  /* Inputs */
  cartItem = input.required<CartItem>();

  /* Services */
  cartService = inject(CartService);
  imageService = inject(UploadImageService);

  /* Signals */
  urlImage = signal<string>('/images/no-image-2.png');

  /* constants */
  BUCKET_NAME = 'product_images';

  ngOnInit(): void {
    if (this.cartItem().product.image) {
      this.getImage(this.cartItem().product.image as string);
    }
  }

  async getImage(image: string) {
    const { data } = await this.imageService.getImage(this.BUCKET_NAME, image);
    this.urlImage.set(data.publicUrl);
  }

  readonly canIncrement = computed(() => {
    const item = this.cartItem();
    return item.quantity < item.product.stock;
  });

  increment() {
    this.cartService.updateQuantity(this.cartItem().product.id, 1);
  }

  decrement() {
    this.cartService.updateQuantity(this.cartItem().product.id, -1);
  }

  remove() {
    this.cartService.removeItem(this.cartItem().product.id);
  }
}
