import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';

/* Components */
import { AddToCartButton } from '../../../shared/ui/add-to-cart-button/add-to-cart-button';
import { Loading } from '../../../shared/ui/loading/loading';

/* Services */
import { ProductData } from '../../../core/services/product-data';
import { UploadImageService } from '../../../core/services/upload-image-service';

/* Interfaces */
import { Product } from '../../../core/interfaces/product';

/* Types */
import { RequestStatus } from '../../../core/types/request-status-type';

/* Pipes */
import { CurrencyColombianPipe } from '../../../core/pipes/currency-colombian.pipe';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, Loading, AddToCartButton, CurrencyColombianPipe],
  templateUrl: './product-detail.html',
})
export class ProductDetail implements OnInit {
  private activateRoute: ActivatedRoute = inject(ActivatedRoute);
  private productService: ProductData = inject(ProductData);
  private imageService: UploadImageService = inject(UploadImageService);

  /* constants */
  BUCKET_NAME = 'product_images';

  /* Signals */
  requestStatus = signal<RequestStatus>('init');
  productId = signal<Product['id'] | null>(null);
  product = signal<Product | null>(null);
  urlImage = signal<string>('/images/no-image-2.png');

  /* NgOnInit */
  ngOnInit(): void {
    this.activateRoute.params.subscribe((params: Params) => {
      const id = params['id'];
      if (!id || isNaN(id)) return;
      this.productId.set(parseInt(id));
      this.getProduct();
    });
  }

  async getProduct() {
    this.requestStatus.set('loading');
    const { error, data } = await this.productService.get(this.productId() as Product['id']);
    if (error) {
      alert('Ocurrió un error al recuperar la información');
      this.requestStatus.set('error');
      console.error(error);
    }
    if (data) {
      this.product.set(data);
      if (this.product()?.image) {
        const { data } = await this.imageService.getImage(
          this.BUCKET_NAME,
          this.product()?.image as string
        );
        this.urlImage.set(data.publicUrl);
      }
      this.requestStatus.set('success');
    }
  }
}
