import { Injectable, inject, signal } from '@angular/core';
import { AuthSession, AuthChangeEvent, Session } from '@supabase/supabase-js';

import { SupabaseService } from '../../database/supabase-service';

import { Profile } from '../interfaces/profile';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabaseService = inject(SupabaseService);
  private supabase = this.supabaseService.supabase;

  session = signal<AuthSession | null>(null)
}
