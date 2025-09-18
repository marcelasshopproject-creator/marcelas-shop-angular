import { Component, inject, signal, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../../core/validators/password-match-validator';

/* Components */
import { Loading } from '../../shared/ui/loading/loading';

/* Services */
import { LoginService } from '../../core/services/login-service';
import { ProfileService } from '../../core/services/profile-service';


/* Interfaces */
import { Profile } from '../../core/interfaces/profile';

/* Types */
import { RequestStatus } from '../../core/types/request-status-type';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule, Loading],
  templateUrl: './register-form.html',
})
export class RegisterForm {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private profileService: ProfileService = inject(ProfileService);
  private loginService: LoginService = inject(LoginService);
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

  async register() {
    this.form.markAllAsTouched();
    if (!this.form.valid) return;
    this.form.disable();
    this.requestStatus.set('loading');

    const { fullname, address, phone, email, password } = this.form.value;

    const {
      data: { user },
      error: authError,
    } = await this.profileService.register(email!, password!);

    if (authError) {
      this.requestStatus.set('error');
      setTimeout(() => {
        this.requestStatus.set('init');
        this.form.enable();
      }, 3000);
      return;
    }

    if (user) {
      const profile: Profile = {
        fullname: fullname!,
        address: address!,
        phone: phone!,
        is_admin: false,
        is_deleted: false,
        is_blocked: false,
      };
      const { error: profileError } = await this.profileService.updateUser(user.id, profile);
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
