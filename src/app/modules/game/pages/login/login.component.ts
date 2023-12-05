import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  LoginData,
  LoginResult,
  RegisterData,
} from 'src/app/interfaces/interfaces';
import { HeaderComponent } from 'src/app/modules/shared/components/header/header.component';
import { Utils } from 'src/app/modules/shared/utils.class';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  standalone: true,
  selector: 'game-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, FormsModule, HeaderComponent],
})
export class LoginComponent {
  selectedTab: string = 'login';
  loginData: LoginData = {
    email: '',
    pass: '',
  };
  registerData: RegisterData = {
    email: '',
    conf: '',
    pass: '',
  };
  loading: boolean = false;
  loginError: boolean = false;
  registerError: string = null;

  constructor(
    private as: ApiService,
    private user: UserService,
    private router: Router
  ) {}

  selectTab(option: string): void {
    if (this.loading) {
      return;
    }
    this.selectedTab = option;
  }

  checkLogin(ev: Event): void {
    ev && ev.preventDefault();
    this.loginError = false;

    if (this.loginData.email == '') {
      alert('¡No puedes dejar el email en blanco!');
      return;
    }

    if (this.loginData.pass == '') {
      alert('¡No puedes dejar la contraseña en blanco!');
      return;
    }

    this.loading = true;
    this.as.login(this.loginData).subscribe((result: LoginResult): void => {
      if (result.status === 'ok') {
        this.user.logged = true;
        this.user.id = result.id;
        this.user.email = Utils.urldecode(result.email);
        this.user.token = Utils.urldecode(result.token);
        this.user.saveLogin();

        this.router.navigate(['/game/hall']);
      } else {
        this.loading = false;
        this.loginError = true;
      }
    });
  }

  checkRegister(ev: Event): void {
    ev && ev.preventDefault();
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

    this.loading = true;
    this.as
      .register(this.registerData)
      .subscribe((result: LoginResult): void => {
        if (result.status === 'ok') {
          this.user.logged = true;
          this.user.id = result.id;
          this.user.email = Utils.urldecode(result.email);
          this.user.token = Utils.urldecode(result.token);
          this.user.saveLogin();

          this.router.navigate(['/game/hall']);
        } else {
          this.loading = false;
          this.registerError = result.status;
        }
      });
  }
}
