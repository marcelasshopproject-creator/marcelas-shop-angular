import { Component, inject, signal, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../../core/validators/password-match-validator';

/* Components */
import { Loading } from '../../shared/ui/loading/loading';

/* Services */
import { AuthService } from '../../core/services/auth-service';


/* DTO's */
import { CreateProfileDto } from '../../core/dtos/create-profile.dto';

/* Types */
import { RequestStatus } from '../../core/types/request-status-type';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule, Loading],
  templateUrl: './register-form.html',
})
export class RegisterForm {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  changeToLoginMode = output();
  showPassword = signal(false);
  requestStatus = signal<RequestStatus>('init');

  form = this.formBuilder.group(
    {
      fullname: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordRepeat: ['', [Validators.required, Validators.minLength(6)]],
    },
    { validators: passwordMatchValidator }
  );

  setChangeToLoginMode() {
    this.changeToLoginMode.emit();
  }

  async signUp() {
    this.form.markAllAsTouched();
    if (!this.form.valid) return;
    this.form.disable();
    this.requestStatus.set('loading');

    const { fullname, address, phone, email, password } = this.form.value;

    const {
      data: { user },
      error: authError,
    } = await this.authService.signUp(email!, password!);

    if (authError) {
      this.requestStatus.set('error');
      setTimeout(() => {
        this.requestStatus.set('init');
        this.form.enable();
      }, 3000);
      return;
    }

    if (user) {
      const profile: CreateProfileDto = {
        fullname: fullname!,
        address: address!,
        phone: phone!,
      };
      const { error: profileError } = await this.authService.updateProfile(user.id, profile);
      if (profileError) {
        this.requestStatus.set('error');
        setTimeout(() => {
          this.requestStatus.set('init');
          this.form.enable();
        }, 3000);
        return;
      }

      setTimeout(() => {
        this.requestStatus.set('init');
        this.form.enable();
        this.changeToLoginMode.emit();
      }, 3000);
      this.form.reset();
    }
  }
}
