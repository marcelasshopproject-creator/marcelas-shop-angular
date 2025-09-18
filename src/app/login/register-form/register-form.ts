import { Component, inject, signal, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SupabaseService } from '../../database/supabase-service';
import { passwordMatchValidator } from '../../core/validators/password-match-validator';

import { RequestStatus } from '../../core/types/request-status-type';

import { Loading } from '../../shared/ui/loading/loading';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule, Loading],
  templateUrl: './register-form.html',
})
export class RegisterForm {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private supabaseService: SupabaseService = inject(SupabaseService);
  changeToLoginMode = output();
  showPassword = signal(false);
  requestStatus = signal<RequestStatus>('init');

  form = this.formBuilder.nonNullable.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordRepeat: ['', [Validators.required, Validators.minLength(6)]],
    },
    { validators: passwordMatchValidator }
  );

  setChangeToLoginMode() {
    this.changeToLoginMode.emit();
  }

  async register() {
    this.form.markAllAsTouched();
    if (!this.form.valid) return;
    this.form.disable();
    this.requestStatus.set('loading');

    const { email, password } = this.form.getRawValue();

    const {
      data: { user },
      error,
    } = await this.supabaseService.supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      this.requestStatus.set('error');
    }

    if (user) {
      this.requestStatus.set('success');
      this.form.reset();
    }
    
    setTimeout(() => {
      this.requestStatus.set('init');
      this.setChangeToLoginMode();
    }, 3000);
  }
}
