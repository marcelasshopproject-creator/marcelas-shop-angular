import { Injectable, inject } from '@angular/core';

import { SupabaseService } from '../../database/supabase-service';

import { AuthUser as AuthUserInterface } from '../interfaces/auth-user';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private supabaseService = inject(SupabaseService);
  private supabase = this.supabaseService.supabase;

  login = async (user: AuthUserInterface) => {
    const { email, password } = user;
    return await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
  };
}
