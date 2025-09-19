import { Routes } from '@angular/router';

export default [
  { path: '', loadComponent: () => import('../admin').then((c) => c.Admin) },
  {
    path: 'productos',
    loadComponent: () => import('../products-admin/products-admin').then((c) => c.ProductsAdmin),
  },
  {
    path: 'categorias',
    loadComponent: () =>
      import('../categories-admin/categories-admin').then((c) => c.CategoriesAdmin),
  },
] as Routes;
