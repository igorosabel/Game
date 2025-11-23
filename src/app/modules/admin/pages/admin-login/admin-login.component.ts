import { Component, WritableSignal, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginData, LoginResult } from '@interfaces/interfaces';
import { urldecode } from '@osumi/tools';
import ApiService from '@services/api.service';
import UserService from '@services/user.service';
import HeaderComponent from '@shared/components/header/header.component';

@Component({
  selector: 'game-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
  imports: [FormsModule, HeaderComponent],
})
export default class AdminLoginComponent {
  private as: ApiService = inject(ApiService);
  private user: UserService = inject(UserService);
  private router: Router = inject(Router);

  loginData: LoginData = {
    email: null,
    pass: null,
  };
  loading: WritableSignal<boolean> = signal<boolean>(false);
  loginError: WritableSignal<boolean> = signal<boolean>(false);

  doLogin(ev: MouseEvent): void {
    ev.preventDefault();
    this.loginError.set(false);

    if (this.loginData.email === '' || this.loginData.pass === '') {
      this.loginError.set(true);
      return;
    }

    this.loading.set(true);
    this.as.adminLogin(this.loginData).subscribe((result: LoginResult): void => {
      if (result.status === 'ok') {
        this.user.logged = true;
        this.user.id = result.id;
        this.user.email = urldecode(result.email);
        this.user.token = urldecode(result.token);
        this.user.saveLogin();

        this.router.navigate(['/admin/main']);
      } else {
        this.loading.set(false);
        this.loginError.set(true);
      }
    });
  }
}
