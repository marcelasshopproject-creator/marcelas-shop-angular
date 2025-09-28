import { Injectable, inject, signal } from '@angular/core';

/* Service */
import { SupabaseService } from '../../database/supabase-service';

/* Interfaces */
import { Category } from '../interfaces/category';

/* DTO's */
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';

@Injectable({
  providedIn: 'root',
})
export class CategoryData {
  private supabaseService = inject(SupabaseService);
  private supabase = this.supabaseService.supabase;

  private TABLENAME = 'categories';

  getAll = async () => this.supabase.from(this.TABLENAME).select('*');

  get = async (id: Category['id']) =>
    this.supabase.from(this.TABLENAME).select('*').eq('id', id).single();

  create = async (dto: CreateCategoryDto) =>
    this.supabase.from(this.TABLENAME).insert(dto).select();

  update = async (id: Category['id'], dto: UpdateCategoryDto) =>
    this.supabase.from(this.TABLENAME).update(dto).eq('id', id).select();

  delete = async (id: Category['id']) => this.supabase.from(this.TABLENAME).delete().eq('id', id);
}
