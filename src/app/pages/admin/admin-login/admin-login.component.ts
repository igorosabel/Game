import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { LoginData }         from '../../../interfaces/interfaces';
import { ApiService }        from '../../../services/api.service';
import { UserService }       from '../../../services/user.service';
import { CommonService }     from '../../../services/common.service';
import { AuthService }       from '../../../services/auth.service';


@Component({
	selector: 'game-admin-login',
	templateUrl: './admin-login.component.html',
	styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {
	loginData: LoginData = {
		name: null,
		pass: null
	};
	loginError: boolean = false;

	constructor(private as: ApiService,
				private user: UserService,
				private cs: CommonService,
				private router: Router,
				private auth: AuthService) { }

	ngOnInit(): void {}
	
	doLogin(ev) {
		ev.preventDefault();
		this.loginError = false;

		if (this.loginData.name==='' || this.loginData.pass===''){
			this.loginError = true;
			return false;
		}
		
		this.as.adminLogin(this.loginData).subscribe(result => {
			if (result.status==='ok'){
				this.user.logged = true;
				this.user.id     = result.id;
				this.user.name   = this.cs.urldecode(result.name);
				this.user.token  = this.cs.urldecode(result.token);
				this.user.saveLogin();

				this.router.navigate(['/admin/main']);
			}
			else{
				this.loginError = true;
			}
		});
	}
}