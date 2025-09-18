import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tienda',
    pathMatch: 'full',
  },
  {
    path: 'tienda',
    loadChildren: () => import('./products/features/product-shell/product.route'),
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin-shell/admin.routes'),
  },
  {
    path: 'ingresar',
    loadComponent: () => import('./login/login').then(c => c.Login)
  },
  {
    path: '**',
    redirectTo: 'tienda',
    pathMatch: 'full',
  },
];
  