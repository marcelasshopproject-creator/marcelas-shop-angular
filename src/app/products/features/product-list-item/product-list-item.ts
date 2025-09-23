import { Component, OnInit, input, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

/* Components */
import { AddToCartButton } from '../../../shared/ui/add-to-cart-button/add-to-cart-button';

/* Services */
import { UploadImageService } from '../../../core/services/upload-image-service';

/* Interfaces */
import { Product } from '../../../core/interfaces/product';

/* Pipes */
import { CurrencyColombianPipe } from '../../../core/pipes/currency-colombian.pipe';

@Component({
  selector: 'app-product-list-item',
  imports: [RouterLink, AddToCartButton, CurrencyColombianPipe],
  templateUrl: './product-list-item.html',
})
export class ProductListItem implements OnInit {
  /* Input */
  product = input.required<Product>();
  urlImage = signal<string>('/images/no-image-2.png');

  /* Services */
  imageService = inject(UploadImageService);

  /* Constants */
  BUCKET_NAME = 'product_images';

  ngOnInit(): void {
    this.getUrlImage();
  }

  async getUrlImage() {
    if (this.product().image) {
      const { data } = await this.imageService.getImage(
        this.BUCKET_NAME,
        this.product().image as string
      );
      this.urlImage.set(data.publicUrl);
    }
  }
}
