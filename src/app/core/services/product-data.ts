import { Injectable, inject } from '@angular/core';

/* Service */
import { SupabaseService } from '../../database/supabase-service';

/* Interfaces */
import { Product } from '../interfaces/product';

/* DTO's */
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';

@Injectable({
  providedIn: 'root',
})
export class ProductData {
  private supabaseService = inject(SupabaseService);
  private supabase = this.supabaseService.supabase;

  private TABLENAME = 'products';

  getAllAvailable = async () =>
    this.supabase
      .from(this.TABLENAME)
      .select('*, category(*)')
      .eq('is_deleted', false)
      .gt('stock', 0);

  getAll = async () =>
    this.supabase.from(this.TABLENAME).select('*, category(*)').eq('is_deleted', false);

  get = async (id: Product['id']) =>
    this.supabase
      .from(this.TABLENAME)
      .select('*, category(*)')
      .eq('id', id)
      .eq('is_deleted', false)
      .single();

  create = async (dto: CreateProductDto) => this.supabase.from(this.TABLENAME).insert(dto).select();

  update = async (id: Product['id'], dto: UpdateProductDto) =>
    this.supabase.from(this.TABLENAME).update(dto).eq('id', id).select();

  delete = async (id: Product['id']) =>
    this.supabase.from(this.TABLENAME).update({ is_deleted: true }).eq('id', id);
}
