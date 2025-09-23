import { Routes } from '@angular/router';

/* Guards */
import { adminGuard } from './core/guards/admin-guard';
import { authenticatedGuard } from './core/guards/authenticated-guard';
import { unAuthenticatedGuard } from './core/guards/un-authenticated-guard';

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
    path: 'carrito',
    loadComponent: () => import('./cart/cart').then((c) => c.Cart),
    canActivate: [authenticatedGuard],
  },
  {
    path: 'pedido',
    loadChildren: () => import('./order/order-shell/order.routes'),
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin-shell/admin.routes'),
    canActivate: [adminGuard],
  },
  {
    path: 'ingresar',
    loadComponent: () => import('./login/login').then((c) => c.Login),
    canActivate: [unAuthenticatedGuard],
  },
  {
    path: '**',
    redirectTo: 'tienda',
    pathMatch: 'full',
  },
];
