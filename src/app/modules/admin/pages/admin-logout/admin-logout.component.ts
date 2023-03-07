import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  standalone: true,
  selector: 'game-admin-logout',
  template: '',
})
export default class AdminLogoutComponent implements OnInit {
  constructor(private user: UserService, private router: Router) {}

  ngOnInit(): void {
    this.user.logout();
    this.router.navigate(['/admin']);
  }
}
