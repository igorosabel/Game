import { Injectable } from '@angular/core';
import { LoginResult } from 'src/app/interfaces/interfaces';
import { DataShareService } from 'src/app/services/data-share.service';

@Injectable()
export class UserService {
  logged: boolean = false;
  id: number = null;
  email: string = null;
  token: string = null;

  constructor(private dss: DataShareService) {}

  loadLogin(): void {
    const loginObj: LoginResult = this.dss.getGlobal('login');
    if (loginObj === null) {
      this.logout();
    } else {
      this.logged = true;
      this.id = loginObj.id;
      this.email = loginObj.email;
      this.token = loginObj.token;
    }
  }

  saveLogin(): void {
    const loginObj: LoginResult = {
      status: 'ok',
      id: this.id,
      email: this.email,
      token: this.token,
    };
    this.dss.setGlobal('login', loginObj);
  }

  logout(): void {
    this.logged = false;
    this.id = null;
    this.email = null;
    this.token = null;
    this.dss.removeGlobal('login');
  }
}
