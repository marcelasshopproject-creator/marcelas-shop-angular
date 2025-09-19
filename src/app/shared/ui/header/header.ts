import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Session, User } from '@supabase/supabase-js';

/* Services */
import { AuthService } from '../../../core/services/auth-service';

/* Interfaces */
import { AuthState } from '../../../core/interfaces/auth-state';
import { Profile } from '../../../core/interfaces/profile';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
})
export class Header implements OnInit {
  private authService = inject(AuthService);

  private user = signal<User | null>(null);
  private session = signal<any | null>(null);
  profile = signal<Profile | null>(null);

  async ngOnInit(): Promise<void> {
    const session = await this.authService.session;
    this.user.set(session);
    this.authService.authChanges(async (_, session) => {
      this.session.set(session);
      //console.log(this.session())
      const user: User = this.session().user;
      this.user.set(user);
      this.getProfile();
    });
  }

  async getProfile() {
    try {
      const { user } = this.session();
      const { data: profile, error, status } = await this.authService.profile(user);
      if (error && status !== 406) {
        throw error;
      }
      if (profile) {
        this.profile.set(profile);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }

  signOut() {
    this.authService.signOut();
    this.getProfile()
  }
}
