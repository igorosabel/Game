import { Injectable, inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import UserService from '@services/user.service';
import { Observable, of } from 'rxjs';

@Injectable()
export default class AuthService {
  private us: UserService = inject(UserService);

  public isAuthenticated(): Observable<boolean> {
    this.us.loadLogin();
    if (!this.us.logged) {
      this.us.logout();
    }
    const helper = new JwtHelperService();
    return of(this.us.logged && !helper.isTokenExpired(this.us.token));
  }
}
