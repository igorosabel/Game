import { Injectable, inject } from '@angular/core';
import { LoginResult } from '@interfaces/interfaces';
import DataShareService from '@services/data-share.service';

@Injectable()
export default class UserService {
  private readonly dss: DataShareService = inject(DataShareService);

  logged: boolean = false;
  id: number | null = null;
  email: string | null = null;
  token: string | null = null;

  loadLogin(): void {
    const loginObj: LoginResult | null = this.dss.getGlobal('login') as LoginResult | null;
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
      id: this.id as number,
      email: this.email as string,
      token: this.token as string,
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
