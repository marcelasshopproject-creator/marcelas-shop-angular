import { Component, OnInit, inject, signal } from '@angular/core';

import { OrderService } from '../../../core/services/order-service';

import { OrderDetail } from '../../../core/interfaces/order-detail';

@Component({
  selector: 'app-orders',
  imports: [],
  templateUrl: './orders.html',
})
export class Orders implements OnInit {
  private orderService = inject(OrderService)

  orders = signal<OrderDetail[]>([])

  ngOnInit(): void {
    this.getOrders()
  }

  private async getOrders(){
    const res = await this.orderService.getOrders()
    console.log(res);
  }
}
