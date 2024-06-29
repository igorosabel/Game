import { Injectable, inject } from '@angular/core';
import { LoginResult } from '@interfaces/interfaces';
import DataShareService from '@services/data-share.service';

@Injectable()
export default class UserService {
  private dss: DataShareService = inject(DataShareService);

  logged: boolean = false;
  id: number = null;
  email: string = null;
  token: string = null;

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
