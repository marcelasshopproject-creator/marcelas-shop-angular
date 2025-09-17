import { Routes } from '@angular/router';

export default [
  { path: '', loadComponent: () => import('../admin').then((m) => m.Admin) },
] as Routes;
