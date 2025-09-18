import { Component, signal } from '@angular/core';

/* Components */
import { LoginForm } from './login-form/login-form';
import { RegisterForm } from './register-form/register-form';

@Component({
  selector: 'app-login',
  imports: [LoginForm, RegisterForm],
  templateUrl: './login.html',
})
export class Login {
  loginMode = signal<boolean>(true);

  changeToLoginMode() {
    this.loginMode.set(true);
  }
}
