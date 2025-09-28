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

  getOrders() {
  const profile = this.authService.profile();
  if (!profile?.id) return;
  return this.supabase
    .from(this.TABLENAME)
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false }); // 👈 Ordenar descendente
  }


  /**
   * Crea la orden, los order_items y actualiza el stock de los productos comprados.
   * - Verifica stock antes de crear la orden.
   * - Si falla la inserción de items o la actualización de stock, intenta revertir la orden creada.
   */
  async createOrder() {
    const profile = this.authService.profile();
    if (!profile?.id) return;

    const items = this.cartService.items$();
    if (!items || items.length === 0) {
      throw new Error('El carrito está vacío');
    }

    // Totales
    const subtotal = this.cartService.subtotal();
    const taxes = this.cartService.taxes();
    const total = this.cartService.grandTotal();

    // 1) Verificar stock disponible para todos los productos del carrito
    const productIds = items.map((i) => i.product.id);
    const { data: productsData, error: productsError } = await this.supabase
      .from('products')
      .select('id, stock, name')
      .in('id', productIds);

    if (productsError) {
      console.error('Error al obtener productos para verificar stock', productsError);
      throw productsError;
    }

    // Map de stock por id
    const stockMap = new Map<string | number, number>();
    (productsData || []).forEach((p: any) => stockMap.set(p.id, p.stock ?? 0));

    // Validar que haya stock suficiente
    const insufficient: { productId: any; name?: string; needed: number; available: number }[] = [];
    for (const item of items) {
      const available = stockMap.get(item.product.id) ?? 0;
      if (item.quantity > available) {
        const prod = (productsData || []).find((p: any) => p.id === item.product.id);
        insufficient.push({ productId: item.product.id, name: prod?.name, needed: item.quantity, available });
      }
    }

    if (insufficient.length > 0) {
      // No continuar: retornar información del/los productos con stock insuficiente
      const msg = insufficient
        .map((i) => `${i.name ?? i.productId}: requerido ${i.needed}, disponible ${i.available}`)
        .join('; ');
      throw new Error(`Stock insuficiente para: ${msg}`);
    }

    // 2) Crear la orden (detalle)
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

    if (orderError) {
      console.error('Error creando la orden', orderError);
      throw orderError;
    }

    // 3) Preparar order_items y guardarlos
    const orderItems: CreateOrderItemDto[] = items.map((item) => ({
      order_id: order.id,
      product: item.product.id,
      quantity: item.quantity,
      price_at_time: item.product.price,
    }));

    const { error: itemsError } = await this.supabase.from(this.ITEM_TABLE).insert(orderItems);

    if (itemsError) {
      // Intentar rollback: borrar la order creada
      try {
        await this.supabase.from(this.TABLENAME).delete().eq('id', order.id);
      } catch (rbErr) {
        console.error('Error haciendo rollback de order tras fallo insert items', rbErr);
      }
      console.error('Error insertando order items', itemsError);
      throw itemsError;
    }

    // 4) Actualizar stock para cada producto (restar quantity)
    // Intentamos actualizar producto por producto; si falla, hacemos rollback de order + order_items
    try {
      for (const item of items) {
        const currentStock = stockMap.get(item.product.id) ?? 0;
        const newStock = Math.max(0, currentStock - item.quantity);

        const { error: updateError } = await this.supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', item.product.id);

        if (updateError) {
          throw updateError;
        }
      }
    } catch (stockUpdateErr) {
      // Rollback: borrar order_items y order
      try {
        await this.supabase.from(this.ITEM_TABLE).delete().eq('order_id', order.id);
        await this.supabase.from(this.TABLENAME).delete().eq('id', order.id);
      } catch (rbErr) {
        console.error('Error haciendo rollback después de fallo al actualizar stock', rbErr);
      }

      console.error('Error actualizando stock tras crear order', stockUpdateErr);
      throw stockUpdateErr;
    }

    // 5) Limpiar carrito y refrescar estado
    await this.clearCart(profile.id);

    return { order, items: orderItems };
  }

  private async clearCart(userId: string) {
    await this.supabase.from('cart_items').delete().eq('user_id', userId);
    this.cartService.refresh();
  }
}
