import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

import { SupabaseService } from '../../database/supabase-service';

import { Profile } from '../interfaces/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private supabaseService = inject(SupabaseService);
  private supabase = this.supabaseService.supabase;


  register = async (email: string, password: string) => await this.supabase.auth.signUp({
    email,
    password,
  });

  updateUser = async (id: string, profile: Profile) => await this.supabase.from('profiles').update(profile).eq('id', id);
}
