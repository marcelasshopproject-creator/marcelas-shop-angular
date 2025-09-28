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
  errorMessage = signal<string>(''); // 🔹 Nuevo estado para mensajes de error

  form = this.formBuilder.group(
    {
      fullname: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-zÀ-ÿ\s]+$/),
        ],
      ],
      address: ['', [Validators.required]],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]+$/),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]{2,4}$/),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/),
        ],
      ],
      passwordRepeat: [
        '',
        [Validators.required],
      ],
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
      // 🔹 Verifica si el error es de usuario ya registrado
      if (authError.message.includes('already registered') || authError.message.includes('exists')) {
        this.errorMessage.set('ERROR, ESTOS DATOS YA LOS POSEEN UNA CUENTA YA CREADA');
      } else {
        this.errorMessage.set('Error al crear el usuario');
      }

      this.requestStatus.set('error');
      setTimeout(() => {
        this.requestStatus.set('init');
        this.form.enable();
        this.errorMessage.set('');
      }, 3000);
      return;
    }

    if (user) {
      const profile: CreateProfileDto = {
        fullname: fullname!,
        address: address!,
        phone: phone!,
      };

      const { error: profileError } = await this.authService.updateProfile(
        user.id,
        profile
      );

      if (profileError) {
        this.errorMessage.set('Error al guardar el perfil');
        this.requestStatus.set('error');
        setTimeout(() => {
          this.requestStatus.set('init');
          this.form.enable();
          this.errorMessage.set('');
        }, 3000);
        return;
      }

      await this.authService.signOut();

      alert("CUENTA CREADA CON ÉXITO, LOGUEATE PARA ENTRAR");

      setTimeout(() => {
        this.requestStatus.set('init');
        this.form.enable();
        this.changeToLoginMode.emit();
      }, 3000);

      this.form.reset();
    }
  }
}
