import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

/* Services */
import { CategoryData } from '../../../core/services/category-data';

/* Interface */
import { Category } from '../../../core/interfaces/category';

/* Types */
import { RequestStatus } from '../../../core/types/request-status-type';

@Component({
  selector: 'app-categories-admin',
  imports: [RouterLink],
  templateUrl: './categories-admin.html',
})
export class CategoriesAdmin implements OnInit {
  private categoryService = inject(CategoryData);
  categories = signal<Category[]>([]);
  requestStatus = signal<RequestStatus>('init');

  getCategories = async () => {
    this.requestStatus.set('loading');
    const { error, data } = await this.categoryService.getAll();
    if (data) {
      this.categories.set(data as Category[]);
      this.requestStatus.set('success');
    }
    if (error) {
      this.requestStatus.set('error');
      this.categories.set([]);
    }
  };

  deleteCategory = async (id: Category['id']) => {
    const confirmDelete = confirm('¿Estás seguro de borrar la categoría');
    if (!confirmDelete) return;
    const { error } = await this.categoryService.delete(id);
    if (error) {
      alert('No se pudo borrar la categoría');
    } else {
      this.getCategories();
    }
  };

  ngOnInit(): void {
    this.getCategories();
  }
}
