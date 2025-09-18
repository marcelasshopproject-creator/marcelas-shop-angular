import { Injectable, inject } from '@angular/core';

import { SupabaseService } from '../../database/supabase-service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private supabaseService = inject(SupabaseService);
  private supabase = this.supabaseService.supabase;

  login = async (email: string, password: string) =>
    await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
}
