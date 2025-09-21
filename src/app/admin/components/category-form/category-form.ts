import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, ActivatedRoute, Params } from '@angular/router';

/* Components */
import { Loading } from '../../../shared/ui/loading/loading';

/* Services */
import { CategoryData } from '../../../core/services/category-data';

/* Interfaces */
import { Category } from '../../../core/interfaces/category';

/* DTO's */
import { CreateCategoryDto } from '../../../core/dtos/create-category.dto';
import { UpdateCategoryDto } from '../../../core/dtos/update-category.dto';

/* Types */
import { FormMode } from '../../../core/types/form-mode-type';
import { RequestStatus } from '../../../core/types/request-status-type';

@Component({
  selector: 'app-category-form',
  imports: [ReactiveFormsModule, RouterLink, Loading, RouterLink],
  templateUrl: './category-form.html',
})
export class CategoryForm implements OnInit {
  /* Services */
  private activateRoute = inject(ActivatedRoute);
  private categoryService: CategoryData = inject(CategoryData);
  private formBuilder: FormBuilder = inject(FormBuilder);

  /* Signals */
  requestStatus = signal<RequestStatus>('init');
  requestStatusLoading = signal<RequestStatus>('init');
  category = signal<Category | null>(null);
  categoryId = signal<Category['id'] | null>(null);
  formMode = signal<FormMode>('create');

  /* Form */
  form = this.formBuilder.group({
    name: ['', [Validators.required]],
  });

    /* Get Category */
    async getCategory() {
      this.requestStatusLoading.set('loading');
      const { error, data } = await this.categoryService.get(this.categoryId() as Category['id']);
      if (error) {
        alert('Error al obtener la categoría');
        this.requestStatusLoading.set('error');
        this.form.disable();
      }
      if (data) {
        this.requestStatusLoading.set('success');
        this.category.set(data);
        this.form.patchValue({
          name: data.name,
        });
      }
    }

  /* NgOnInit */
  ngOnInit(): void {
    this.activateRoute.params.subscribe((params: Params) => {
      const id = params['id'];
      if (!id || isNaN(id)) return;
      this.categoryId.set(parseInt(id));
      this.formMode.set('edit');
      this.getCategory();
    });
  }

  /* Create Category */
  async create(dto: CreateCategoryDto) {
     const { data, error } = await this.categoryService.create(dto);

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

  /* Update Category */
  async update(dto: UpdateCategoryDto) {
    const { data, error } = await this.categoryService.update(this.categoryId() as Category['id'], dto);

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
        this.form.enable();
      }, 3000);
    }
  }

  /* Save the form */
  async save() {
    this.form.markAllAsTouched();
    if (!this.form.valid) return;
    this.form.disable();
    this.requestStatus.set('loading');

    const dto = this.form.getRawValue() as CreateCategoryDto | UpdateCategoryDto;

    if (this.formMode() === 'create') {
      this.create(dto as CreateCategoryDto);
    } else {
      this.update(dto as UpdateCategoryDto);
    }
  }
}
