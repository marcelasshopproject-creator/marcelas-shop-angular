import { Routes } from "@angular/router";

export default [
    { path: '', loadComponent: () => import('../product-list/product-list').then(m => m.ProductList) }
] as Routes