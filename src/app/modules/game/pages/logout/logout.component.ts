import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import UserService from '@services/user.service';

@Component({
  selector: 'game-logout',
  template: '',
})
export default class LogoutComponent implements OnInit {
  private readonly user: UserService = inject(UserService);
  private readonly router: Router = inject(Router);

  ngOnInit(): void {
    this.user.logout();
    this.router.navigate(['/']);
  }
}
