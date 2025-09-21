// header.component.ts
import { Component, inject, effect } from '@angular/core';
import { RouterLink } from '@angular/router';

/* Services */
import { AuthService } from '../../../core/services/auth-service';

/* Interfaces */
import { Profile } from '../../../core/interfaces/profile';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  standalone: true,
})
export class Header {
  private authService = inject(AuthService);

  // Usamos directamente los signals del servicio
  readonly session = this.authService.session;
  readonly profile = this.authService.profile;
  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly isAdmin = this.authService.isAdmin;

  // Opcional: efecto para logs o side effects
  constructor() {
    effect(() => {
      console.log('Header actualizado - Usuario autenticado:', this.isAuthenticated());
      console.log('Perfil:', this.profile());
    });
  }

  // Método para cerrar sesión
  signOut(): void {
    this.authService.signOut();
  }
}
