import { Component, inject, computed } from '@angular/core';

import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-order-component',
  imports: [],
  templateUrl: './order-component.html',
})
export class OrderComponent {
  private authService = inject(AuthService);

  readonly name = computed(() => this.authService.profile()?.fullname ?? '');
  readonly phone = computed(() => this.authService.profile()?.phone ?? '');
  readonly address = computed(() => this.authService.profile()?.address ?? '');
}
