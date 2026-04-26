import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import UserService from '@services/user.service';

@Component({
  selector: 'game-admin-logout',
  template: '',
})
export default class AdminLogoutComponent implements OnInit {
  private readonly user: UserService = inject(UserService);
  private readonly router: Router = inject(Router);

  ngOnInit(): void {
    this.user.logout();
    this.router.navigate(['/admin']);
  }
}
