import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, of } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Injectable()
export class AuthService {
  constructor(private us: UserService) {}

  public isAuthenticated(): Observable<boolean> {
    this.us.loadLogin();
    if (!this.us.logged) {
      this.us.logout();
    }
    const helper = new JwtHelperService();
    return of(this.us.logged && !helper.isTokenExpired(this.us.token));
  }
}
