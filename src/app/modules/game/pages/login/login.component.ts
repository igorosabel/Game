import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginData, LoginResult, RegisterData } from '@interfaces/interfaces';
import { urldecode } from '@osumi/tools';
import ApiService from '@services/api.service';
import UserService from '@services/user.service';
import HeaderComponent from '@shared/components/header/header.component';

@Component({
  selector: 'game-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule, HeaderComponent],
})
export default class LoginComponent {
  private as: ApiService = inject(ApiService);
  private user: UserService = inject(UserService);
  private router: Router = inject(Router);

  selectedTab: WritableSignal<string> = signal<string>('login');
  loginData: LoginData = {
    email: '',
    pass: '',
  };
  registerData: RegisterData = {
    email: '',
    conf: '',
    pass: '',
  };
  loading: WritableSignal<boolean> = signal<boolean>(false);
  loginError: WritableSignal<boolean> = signal<boolean>(false);
  registerError: WritableSignal<string> = signal<string>(null);

  selectTab(option: string): void {
    if (this.loading) {
      return;
    }
    this.selectedTab.set(option);
  }

  checkLogin(ev: Event): void {
    if (ev) {
      ev.preventDefault();
    }
    this.loginError.set(false);

    if (this.loginData.email == '') {
      alert('¡No puedes dejar el email en blanco!');
      return;
    }

    if (this.loginData.pass == '') {
      alert('¡No puedes dejar la contraseña en blanco!');
      return;
    }

    this.loading.set(true);
    this.as.login(this.loginData).subscribe((result: LoginResult): void => {
      if (result.status === 'ok') {
        this.user.logged = true;
        this.user.id = result.id;
        this.user.email = urldecode(result.email);
        this.user.token = urldecode(result.token);
        this.user.saveLogin();

        this.router.navigate(['/game/hall']);
      } else {
        this.loading.set(false);
        this.loginError.set(true);
      }
    });
  }

  checkRegister(ev: Event): void {
    if (ev) {
      ev.preventDefault();
    }
    this.registerError = null;
    if (this.registerData.email == '') {
      alert('¡No puedes dejar el email en blanco!');
      return;
    }

    if (this.registerData.conf == '') {
      alert('¡No puedes dejar la confirmación del email en blanco!');
      return;
    }

    if (this.registerData.email !== this.registerData.conf) {
      alert('¡Los emails introducidos no coinciden!');
      return;
    }

    if (this.registerData.pass == '') {
      alert('¡No puedes dejar la contraseña en blanco!');
      return;
    }

    this.loading.set(true);
    this.as
      .register(this.registerData)
      .subscribe((result: LoginResult): void => {
        if (result.status === 'ok') {
          this.user.logged = true;
          this.user.id = result.id;
          this.user.email = urldecode(result.email);
          this.user.token = urldecode(result.token);
          this.user.saveLogin();

          this.router.navigate(['/game/hall']);
        } else {
          this.loading.set(false);
          this.registerError.set(result.status);
        }
      });
  }
}
