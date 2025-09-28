import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';

import { OrderService } from '../../../core/services/order-service';
import { OrderDetail } from '../../../core/interfaces/order-detail';
import { CurrencyColombianPipe } from '../../../core/pipes/currency-colombian.pipe';

@Component({
  selector: 'app-orders',
  imports: [DatePipe, CurrencyColombianPipe],
  templateUrl: './orders.html',
})
export class Orders implements OnInit {
  private orderService = inject(OrderService);

  orders = signal<OrderDetail[]>([]);

  ngOnInit(): void {
    this.getOrders();
  }

  private async getOrders() {
    const res = await this.orderService.getOrders();
    const { error, data } = res as any;
    if (error) {
      alert('No se pudieron cargar los pedidos');
    }
    if (data) {
      console.log('Pedidos cargados:', data);
      this.orders.set(data);
    }
  }
}
