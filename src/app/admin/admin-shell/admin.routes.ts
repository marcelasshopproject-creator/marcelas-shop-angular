import { Routes } from '@angular/router';

export default [
  { path: '', loadComponent: () => import('../admin').then((c) => c.Admin) },
  {
    path: 'productos',
    loadComponent: () => import('../pages/products-admin/products-admin').then((c) => c.ProductsAdmin),
  },
  {
    path: 'productos/crear',
    loadComponent: () =>
      import('../pages/product-create/product-create').then((c) => c.ProductCreate),
  },
  {
    path: 'productos/editar/:id',
    loadComponent: () => import('../pages/product-edit/product-edit').then((c) => c.ProductEdit),
  },
  {
    path: 'categorias',
    loadComponent: () =>
      import('../pages/categories-admin/categories-admin').then((c) => c.CategoriesAdmin),
  },
  {
    path: 'categorias/crear',
    loadComponent: () =>
      import('../pages/category-create/category-create').then((c) => c.CategoryCreate),
  },
  {
    path: 'categorias/editar/:id',
    loadComponent: () => import('../pages/category-edit/category-edit').then((c) => c.CategoryEdit),
  },
  {
    path: 'pedidos',
    loadComponent: () => import('../pages/orders/orders').then((c) => c.Orders),
  },
] as Routes;
