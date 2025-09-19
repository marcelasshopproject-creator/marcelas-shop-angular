import { Injectable, inject, signal } from '@angular/core';
import { AuthSession, AuthChangeEvent, Session } from '@supabase/supabase-js';

import { SupabaseService } from '../../database/supabase-service';

import { AuthUser as AuthUserInterface } from '../interfaces/auth-user';
import { Profile } from '../interfaces/profile';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabaseService = inject(SupabaseService);
  private supabase = this.supabaseService.supabase;

  _session = signal<AuthSession | null>(null);

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session.set(data.session);
    });
    return this._session;
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  signUp = async (email: string, password: string) =>
    await this.supabase.auth.signUp({
      email,
      password,
    });

  signIn = async (user: AuthUserInterface) => {
    const { email, password } = user;
    return await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  signOut() {
    this.supabase.auth.signOut();
  }

  updateProfile = async (id: string, profile: Profile) =>
    await this.supabase.from('profiles').update(profile).eq('id', id);
}
