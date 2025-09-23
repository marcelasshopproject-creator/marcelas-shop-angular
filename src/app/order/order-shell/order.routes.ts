import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () =>
      import('../components/order-component/order-component').then((c) => c.OrderComponent),
  },
  {
    path: 'pago',
    loadComponent: () =>
      import('../components/payment-component/payment-component').then((c) => c.PaymentComponent),
  },
  {
    path: 'confirmacion',
    loadComponent: () =>
      import('../components/order-confirmation-component/order-confirmation-component').then(
        (c) => c.OrderConfirmationComponent
      ),
  },
] as Routes;
