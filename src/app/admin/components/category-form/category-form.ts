import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

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
import { RequestStatus } from '../../../core/types/request-status-type';

@Component({
  selector: 'app-category-form',
  imports: [ReactiveFormsModule, RouterLink, Loading, RouterLink],
  templateUrl: './category-form.html',
})
export class CategoryForm {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private categoryService: CategoryData = inject(CategoryData);
  requestStatus = signal<RequestStatus>('init');
  category = signal<Category | null>(null);

  form = this.formBuilder.group({
    name: ['', [Validators.required]],
  });

  async save() {
    this.form.markAllAsTouched();
    if (!this.form.valid) return;
    this.form.disable();
    this.requestStatus.set('loading');

    const dto: CreateCategoryDto = this.form.getRawValue() as CreateCategoryDto;

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
}
