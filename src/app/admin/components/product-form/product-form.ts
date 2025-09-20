import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

/* Components */
import { Loading } from '../../../shared/ui/loading/loading';

/* Services */
import { CategoryData } from '../../../core/services/category-data';
import { ProductData } from '../../../core/services/product-data';
import { UploadImageService } from '../../../core/services/upload-image-service';

/* Interfaces */
import { Category } from '../../../core/interfaces/category';
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
export class ProductForm implements OnInit{
  private formBuilder: FormBuilder = inject(FormBuilder);
  private categoryService: CategoryData = inject(CategoryData);
  private productService: ProductData = inject(ProductData);
  private uploadImageService: UploadImageService = inject(UploadImageService);
  requestStatus = signal<RequestStatus>('init');
  requestStatusCategories = signal<RequestStatus>('init');
  product = signal<Product | null>(null);
  categories = signal<Category[]>([])
  imageName = signal<string>('Ninguna imagen seleccionada');
  finalImageName = signal<string | null>(null);
  uploadImage = signal<boolean>(false);
  filePath = signal<string | null>(null);
  file = signal<any>(null);
  requestImageStatus = signal<RequestStatus>('init');
  BUCKET_NAME = 'product_images';

  form = this.formBuilder.group({
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
    category: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(0)]],
    stock: [0, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(0)]],
  });

  ngOnInit(): void {
    this.getCategories()
  }

  async getCategories() {
    this.requestStatusCategories.set("loading")
    const { error, data} = await this.categoryService.getAll()
    if(error) {
      this.requestStatusCategories.set("error")
    }
    if(data) {
      this.requestStatusCategories.set("success")
      this.categories.set(data)
    }
  }

  verifyFile(e: any) {
    const newFile = e.target.files[0];
    if (!newFile) return;
    this.imageName.set(new Date().getTime().toString());
    const { valid, filePath, file } = this.uploadImageService.verifyImage(
      newFile,
      this.imageName()
    );
    if (!valid) {
      this.imageName.set('Ninguna imagen seleccionada');
      this.uploadImage.set(false);
      this.filePath.set('');
      this.file.set(null);
    }
    if (file && filePath) {
      this.filePath.set(filePath);
      this.file.set(file);
      this.uploadImage.set(true);
    }
  }

  async upload() {
    if (this.file && this.filePath) {
      this.requestImageStatus.set('loading');
      const { data, error } = await this.uploadImageService.uploadImage(
        this.file(),
        this.BUCKET_NAME,
        this.filePath() as string
      );
      if (error) {
        alert('Error al subir la imagen');
        this.requestImageStatus.set('error');
        return;
      }
      if (data) {
        const { fullPath } = data;
        this.finalImageName.set(fullPath);
        this.requestImageStatus.set('success');
      }
    }
  }

  async save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.form.disable();
    const dto: CreateProductDto = this.form.getRawValue() as unknown as CreateProductDto;
    if (this.uploadImage()) {
      await this.upload();
      if (this.requestImageStatus() === 'error') {
        alert('Error subiendo la imagen');
        this.form.enable();
        return;
      }
      dto.image = this.finalImageName() as string;
    }
    this.requestStatus.set('loading');

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
        this.uploadImage.set(false);
        this.imageName.set('Ninguna imagen seleccionada');
        this.finalImageName.set(null);
        this.uploadImage.set(false);
        this.filePath.set(null);
        this.file.set(null);

        this.form.reset();
        this.form.enable();
      }, 3000);
    }
  }
}
