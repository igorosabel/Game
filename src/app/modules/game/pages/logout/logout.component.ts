import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import UserService from '@services/user.service';

@Component({
  selector: 'game-logout',
  template: '',
})
export default class LogoutComponent implements OnInit {
  private user: UserService = inject(UserService);
  private router: Router = inject(Router);

  ngOnInit(): void {
    this.user.logout();
    this.router.navigate(['/']);
  }
}
