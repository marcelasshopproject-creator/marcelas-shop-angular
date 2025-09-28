import { Component, inject, effect } from '@angular/core';
import { RouterLink } from '@angular/router';

/* Services */
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  standalone: true,
})
export class Header {
  private authService = inject(AuthService);

  readonly session = this.authService.session;
  readonly profile = this.authService.profile;
  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly isAdmin = this.authService.isAdmin;

  signOut(): void {
    this.authService.signOut();
  }
}
