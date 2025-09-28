import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RouterLink, ActivatedRoute, Params } from '@angular/router';

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
import { FormMode } from '../../../core/types/form-mode-type';
import { RequestStatus } from '../../../core/types/request-status-type';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, RouterLink, Loading],
  templateUrl: './product-form.html',
})
export class ProductForm implements OnInit {
  /* Services */
  private activateRoute = inject(ActivatedRoute);
  private categoryService: CategoryData = inject(CategoryData);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private productService: ProductData = inject(ProductData);
  private uploadImageService: UploadImageService = inject(UploadImageService);

  /* constants */
  BUCKET_NAME = 'product_images';

  /* Signals */
  formMode = signal<FormMode>('create');
  requestStatus = signal<RequestStatus>('init');
  requestStatusCategories = signal<RequestStatus>('init');
  requestStatusLoading = signal<RequestStatus>('init');
  productId = signal<Product['id'] | null>(null);
  product = signal<Product | null>(null);
  categories = signal<Category[]>([]);
  errorMessage = signal<string>('');
  imageName = signal<string>('Ninguna imagen seleccionada');
  finalImageName = signal<string | null>(null);
  uploadImage = signal<boolean>(false);
  filePath = signal<string | null>(null);
  file = signal<any>(null);
  requestImageStatus = signal<RequestStatus>('init');

  /* Form */
  form = this.formBuilder.group({
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
    category: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(0)]],
    stock: [0, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(0)]],
    image: [''],
    description: ['', [Validators.required, Validators.minLength(30), Validators.maxLength(200)]],
  });

  /* NgOnInit */
  ngOnInit(): void {
    this.getCategories();
    this.activateRoute.params.subscribe((params: Params) => {
      const id = params['id'];
      if (!id || isNaN(id)) return;
      this.productId.set(parseInt(id));
      this.formMode.set('edit');
      this.getProduct();
    });
  }

  /* GetCategories */
  async getCategories() {
    this.requestStatusCategories.set('loading');
    const { error, data } = await this.categoryService.getAll();
    if (error) {
      this.requestStatusCategories.set('error');
    }
    if (data) {
      this.requestStatusCategories.set('success');
      this.categories.set(data);
    }
  }

  async getProduct() {
    this.requestStatusLoading.set('loading');
    const { error, data } = await this.productService.get(this.productId() as Product['id']);
    if (error) {
      alert('Ocurrió un error al recuperar la información');
      this.requestStatusLoading.set('error');
      this.form.disable();
    }
    if (data) {
      this.formMode.set('edit');
      this.product.set(data);
      if (data.image) {
        this.imageName.set('Contiene imagen');
      }
      this.form.patchValue({
        ...data,
        category: data.category?.id || '',
      });
      this.requestStatusLoading.set('success');
    }
  }

  /* VerifyImageFile */
  verifyFile(e: any) {
    const newFile = e.target.files[0];
    if (!newFile) return;
    this.imageName.set(new Date().getTime().toString());
    const { valid, filePath, file } = this.uploadImageService.verifyImage(
      newFile,
      this.imageName()
    );
    if (!valid) {
      this.removeImage();
    }
    if (file && filePath) {
      this.filePath.set(filePath);
      this.file.set(file);
      this.uploadImage.set(true);
    }
  }

  /* Upload Image */
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

  /* Remove Image */
  removeImage() {
    this.imageName.set('Ninguna imagen seleccionada');
    this.uploadImage.set(false);
    this.filePath.set('');
    this.file.set(null);
    this.form.patchValue({ image: '' });
  }

  /* Create Product */
  async create(dto: CreateProductDto) {
    const { data, error } = await this.productService.create(dto);

    if (error) {
      this.requestStatus.set('error');
      this.errorMessage.set('Error al crear el producto');
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

  /* Create Product */
  async update(dto: UpdateProductDto) {
    const { data, error } = await this.productService.update(
      this.productId() as Product['id'],
      dto
    );

    if (error) {
      this.requestStatus.set('error');
      this.errorMessage.set('Error al actualizar el producto');
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
        this.uploadImage.set(false);
        this.form.enable();
      }, 3000);
    }
  }

  /* Save the form */
  async save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.form.disable();

    const formValue = this.form.getRawValue();

    if (this.uploadImage()) {
      await this.upload();
      if (this.requestImageStatus() === 'error') {
        this.errorMessage.set('Error al cargar la imagen');
        this.form.enable();
        setTimeout(() => {
          this.requestImageStatus.set('init');
        }, 3000);
        return;
      }
      formValue.image = this.finalImageName() as string;
    }
    this.requestStatus.set('loading');
    if (this.formMode() === 'create') {
      this.create(formValue as unknown as CreateProductDto);
    } else {
      this.update(formValue as unknown as UpdateProductDto);
    }
  }
}
