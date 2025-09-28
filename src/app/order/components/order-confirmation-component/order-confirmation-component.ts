import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-order-confirmation-component',
  imports: [RouterLink],
  templateUrl: './order-confirmation-component.html',
})
export class OrderConfirmationComponent {
  private authService = inject(AuthService);

  date = new Date();
  finalDate = `${this.date.getDate()}/${this.date.getMonth() + 1}/${this.date.getFullYear()}`;

  readonly name = computed(() => this.authService.profile()?.fullname ?? '');
  readonly phone = computed(() => this.authService.profile()?.phone ?? '');
  readonly address = computed(() => this.authService.profile()?.address ?? '');
}
