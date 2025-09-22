import { Routes } from '@angular/router';

/* Guard */
import { adminGuard } from './core/guards/admin-guard';

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
    canActivate: [adminGuard],
  },
  {
    path: 'ingresar',
    loadComponent: () => import('./login/login').then((c) => c.Login),
  },
  {
    path: '**',
    redirectTo: 'tienda',
    pathMatch: 'full',
  },
];
