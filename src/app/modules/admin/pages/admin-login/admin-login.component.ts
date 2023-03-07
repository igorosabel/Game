import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginData, LoginResult } from 'src/app/interfaces/interfaces';
import { HeaderComponent } from 'src/app/modules/shared/components/header/header.component';
import { Utils } from 'src/app/modules/shared/utils.class';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  standalone: true,
  selector: 'game-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
  imports: [CommonModule, FormsModule, HeaderComponent],
})
export default class AdminLoginComponent {
  loginData: LoginData = {
    email: null,
    pass: null,
  };
  loading: boolean = false;
  loginError: boolean = false;

  constructor(
    private as: ApiService,
    private user: UserService,
    private router: Router
  ) {}

  doLogin(ev: MouseEvent): boolean {
    ev.preventDefault();
    this.loginError = false;

    if (this.loginData.email === '' || this.loginData.pass === '') {
      this.loginError = true;
      return false;
    }

    this.loading = true;
    this.as
      .adminLogin(this.loginData)
      .subscribe((result: LoginResult): void => {
        if (result.status === 'ok') {
          this.user.logged = true;
          this.user.id = result.id;
          this.user.email = Utils.urldecode(result.email);
          this.user.token = Utils.urldecode(result.token);
          this.user.saveLogin();

          this.router.navigate(['/admin/main']);
        } else {
          this.loading = false;
          this.loginError = true;
        }
      });
  }
}
