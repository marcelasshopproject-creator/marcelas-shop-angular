import { Component, input, inject, signal, effect } from '@angular/core';

import { CartItem } from '../../../core/interfaces/cart-item';

import { UploadImageService } from '../../../core/services/upload-image-service';

import { CurrencyColombianPipe } from '../../../core/pipes/currency-colombian.pipe';

interface ItemWithImage {
  item: CartItem;
  url: string;
}

@Component({
  selector: 'app-order-component-items',
  imports: [CurrencyColombianPipe],
  templateUrl: './order-component-items.html',
})
export class OrderComponentItems {
  cartItems = input.required<CartItem[]>();
  private imageService = inject(UploadImageService);

  /* constants */
  BUCKET_NAME = 'product_images';

  items = signal<ItemWithImage[]>([]);

  constructor() {
    effect(() => {
      const items = this.cartItems();
      this.loadImages(items);
    });
  }

  async getImage(image: string) {
    const { data } = await this.imageService.getImage(this.BUCKET_NAME, image);
    return data.publicUrl as string;
  }

  async loadImages(items: CartItem[]) {
    const itemsWithImage: ItemWithImage[] = [];

    for (const item of items) {
      let url = '/images/no-image-2.png';

      if (item.product.image) {
        try {
          const { data } = await this.imageService.getImage(this.BUCKET_NAME, item.product.image);
          url = data.publicUrl;
        } catch (error) {
          console.error('Error cargando imagen:', error);
        }
      }

      itemsWithImage.push({ item, url });
    }
    this.items.set(itemsWithImage);
  }
}
