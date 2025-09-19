import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

/* Components */
import { Loading } from '../../../shared/ui/loading/loading';

/* Services */
import { ProductData } from '../../../core/services/product-data';

/* Interfaces */
import { Product } from '../../../core/interfaces/product';

/* DTO's */
import { CreateProductDto } from '../../../core/dtos/create-product.dto';
import { UpdateProductDto } from '../../../core/dtos/update-product.dto';

/* Types */
import { RequestStatus } from '../../../core/types/request-status-type';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, RouterLink, Loading],
  templateUrl: './product-form.html',
})
export class ProductForm {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private productService: ProductData = inject(ProductData);
  requestStatus = signal<RequestStatus>('init');
  product = signal<Product | null>(null);

  form = this.formBuilder.group({
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(0)]],
    stock: [0, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(0)]],
  });

  async save() {
    this.form.markAllAsTouched();
    if (!this.form.valid) return;
    this.form.disable();
    this.requestStatus.set('loading');

    const dto: CreateProductDto = this.form.getRawValue() as unknown as CreateProductDto;

    const { data, error } = await this.productService.create(dto);

    if (error) {
      this.requestStatus.set('error');
      setTimeout(() => {
        this.requestStatus.set('init');
        this.form.enable();
      }, 3000);
      return;
    }

    if (data) {
      this.requestStatus.set('success');

      setTimeout(() => {
        this.requestStatus.set('init');
        this.form.reset();
        this.form.enable();
      }, 3000);
    }
  }
}
