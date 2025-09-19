import { Component, inject, signal, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

/* Components */
import { Loading } from '../../shared/ui/loading/loading';

/* Services */
import { AuthService } from '../../core/services/auth-service';

/* Interfaces */
import { AuthUser } from '../../core/interfaces/auth-user';

/* Types */
import { RequestStatus } from '../../core/types/request-status-type';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, Loading],
  templateUrl: './login-form.html',
})
export class LoginForm {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  showPassword = signal(false);
  requestStatus = signal<RequestStatus>('init');

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async signIn() {
    this.form.markAllAsTouched();
    if (!this.form.valid) return;
    this.form.disable();
    this.requestStatus.set('loading');

    const authUser: AuthUser = this.form.value as AuthUser

    const {
      data: { user },
      error: authError,
    } = await this.authService.signIn(authUser!);

    if (authError) {
      this.requestStatus.set('error');
      setTimeout(() => {
        this.requestStatus.set('init');
        this.form.enable();
      }, 3000);
      return;
    }

    if (user) {
      this.requestStatus.set('success');
      this.form.enable();
      this.form.reset();
      this.router.navigate(['/tienda']);
    }
  }
}
