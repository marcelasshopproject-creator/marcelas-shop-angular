// auth-service.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import { AuthSession, User } from '@supabase/supabase-js';

import { SupabaseService } from '../../database/supabase-service';
import { AuthUser as AuthUserInterface } from '../interfaces/auth-user';
import { Profile } from '../interfaces/profile';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabaseService = inject(SupabaseService);
  private supabase = this.supabaseService.supabase;

  // Estado reactivo
  private _session = signal<AuthSession | null>(null);
  private _user = signal<User | null>(null);
  private _profile = signal<Profile | null>(null);

  // Exposición pública (como lectura)
  readonly session = this._session.asReadonly();
  readonly user = this._user.asReadonly();
  readonly profile = this._profile.asReadonly();

  // Acceso directo: ¿está autenticado?
  readonly isAuthenticated = computed(() => this._session() !== null);

  // Acceso directo: ¿es administrador?
  readonly isAdmin = computed(() => this._profile()?.is_admin === true);

  constructor() {
    // Cargar sesión inicial
    this.initializeAuth();

    // Escuchar cambios globales de autenticación
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.setSession(session);
    });
  }

  private async initializeAuth() {
    const { data } = await this.supabase.auth.getSession();
    this.setSession(data.session);
  }

  private async setSession(session: AuthSession | null) {
    this._session.set(session);
    this._user.set(session?.user ?? null);

    if (session) {
      // Cargar perfil automáticamente al iniciar sesión
      await this.loadProfile(session.user);
    } else {
      this._profile.set(null); // Limpiar si cierra sesión
    }
  }

  private async loadProfile(user: User) {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error cargando perfil:', error);
        this._profile.set(null);
        return;
      }

      this._profile.set(data as Profile);
    } catch (err) {
      console.error('Excepción al cargar perfil:', err);
      this._profile.set(null);
    }
  }

  // Método público para recargar el perfil si es necesario
  async reloadProfile() {
    const user = this._user();
    if (user) {
      await this.loadProfile(user);
    }
  }

  // Métodos de autenticación
  signUp = async (email: string, password: string) => {
    return await this.supabase.auth.signUp({ email, password });
  };

  signIn = async (credentials: AuthUserInterface) => {
    const { email, password } = credentials;
    return await this.supabase.auth.signInWithPassword({ email, password });
  };

  signOut() {
    this.supabase.auth.signOut();
    // Opcional: limpiar manualmente si no se dispara onAuthStateChange
    this._session.set(null);
    this._user.set(null);
    this._profile.set(null);
  }

  updateProfile = async (id: string, updates: Partial<Profile>) => {
    const { data, error } = await this.supabase.from('profiles').update(updates).eq('id', id);

    if (!error) {
      // Actualizar localmente el perfil
      this._profile.update((p) => (p ? { ...p, ...updates } : null));
    }

    return { data, error };
  };
}
