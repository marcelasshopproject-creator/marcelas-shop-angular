import { Component } from '@angular/core';
import { ProductForm } from '../../components/product-form/product-form';
@Component({
  selector: 'app-product-edit',
  imports: [ProductForm],
  templateUrl: './product-edit.html',
})
export class ProductEdit {}
