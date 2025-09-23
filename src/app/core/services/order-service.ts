import { Injectable, inject, signal } from '@angular/core';

/* Services */
import { AuthService } from './auth-service';
import { CartService } from './cart-service';
import { SupabaseService } from '../../database/supabase-service';

/* DTO's */
import { CreateOrderDetailDto } from '../dtos/create-order-detail.dto';
import { CreateOrderItemDto } from '../dtos/create-order-item.dto';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private supabaseService = inject(SupabaseService);
  private supabase = this.supabaseService.supabase;
  private authService = inject(AuthService);
  private cartService = inject(CartService);

  private TABLENAME = 'orders';
  private ITEM_TABLE = 'order_items';

  async createOrder() {
    const profile = this.authService.profile();
    if (!profile?.id) return;

    const items = this.cartService.items$();

    const subtotal = this.cartService.subtotal();
    const taxes = this.cartService.taxes();
    const total = this.cartService.grandTotal();

    const newOrder: CreateOrderDetailDto = {
      user_id: profile.id,
      subtotal,
      taxes,
      grandtotal: total,
    };

    const { data: order, error: orderError } = await this.supabase
      .from(this.TABLENAME)
      .insert(newOrder)
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems: CreateOrderItemDto[] = items.map((item) => ({
      order_id: order.id,
      product: item.product.id,
      quantity: item.quantity,
      price_at_time: item.product.price,
    }));

    const { error: itemsError } = await this.supabase.from(this.ITEM_TABLE).insert(orderItems);

    if (itemsError) throw itemsError;

    await this.clearCart(profile.id);

    return { order, items: orderItems };
  }

  private async clearCart(userId: string) {
    await this.supabase.from('cart_items').delete().eq('user_id', userId);
    this.cartService.refresh();
  }
}
