import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private _supabase: SupabaseClient;

  constructor() {
    this._supabase = createClient(
      environment.supabaseUrl, 
      environment.supabaseAnonKey
    );
  }

  get supabase(): SupabaseClient {
    return this._supabase;
  }
}
