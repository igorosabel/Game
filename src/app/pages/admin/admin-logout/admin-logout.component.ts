import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { UserService }       from '../../../services/user.service';

@Component({
	selector: 'game-admin-logout',
	template: '',
	styleUrls: []
})
export class AdminLogoutComponent implements OnInit {
	constructor(private user: UserService, private router: Router) {}
	ngOnInit(): void {
		this.user.logout();
		this.router.navigate(['/admin']);
	}
}