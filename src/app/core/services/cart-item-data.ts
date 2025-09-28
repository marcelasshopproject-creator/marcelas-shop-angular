import { Injectable, inject } from '@angular/core';

/* Service */
import { SupabaseService } from '../../database/supabase-service';

/* Interfaces */
import { Profile } from '../interfaces/profile';
import { Product } from '../interfaces/product';

/* DTO's */
import { CreateCartItemDto } from '../dtos/create-cart-item.dto';
import { UpdateCartItemDto } from '../dtos/update-cart-item.dto';

@Injectable({
  providedIn: 'root',
})
export class CartItemData {
  private supabaseService = inject(SupabaseService);
  private supabase = this.supabaseService.supabase;

  private TABLENAME = 'cart_items';

  getAll = (id: Profile['id']) =>
    this.supabase.from(this.TABLENAME).select('*, product(*)').eq('user_id', id);

  get = (user: Profile['id'], product: Product['id']) =>
    this.supabase
      .from(this.TABLENAME)
      .select('*, product(*)')
      .eq('user_id', user)
      .eq('product', product)
      .single();

  create = (dto: CreateCartItemDto) => this.supabase.from(this.TABLENAME).insert(dto).select();

  update = (user: Profile['id'], product: Product['id'], dto: UpdateCartItemDto) =>
    this.supabase
      .from(this.TABLENAME)
      .update(dto)
      .eq('user_id', user)
      .eq('product', product)
      .select();

  delete = (user: Profile['id'], product: Product['id']) =>
    this.supabase.from(this.TABLENAME).delete().eq('user_id', user).eq('product', product).select();
}
