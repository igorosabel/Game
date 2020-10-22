import { Component, OnInit }       from '@angular/core';
import { Router }                  from '@angular/router';
import { LoginData, RegisterData } from '../../../interfaces/interfaces';
import { ApiService }              from '../../../services/api.service';
import { UserService }             from '../../../services/user.service';
import { CommonService }           from '../../../services/common.service';
import { AuthService }             from '../../../services/auth.service';

@Component({
	selector: 'game-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	selectedTab: string = 'login';
	loginData: LoginData = {
		email: '',
		pass: ''
	};
	registerData: RegisterData = {
		email: '',
		conf: '',
		pass: ''
	};
	loading: boolean = false;
	loginError: boolean = false;
	registerError: string = null;

	constructor(private as: ApiService,
				private user: UserService,
				private cs: CommonService,
				private router: Router,
				private auth: AuthService) {}
	ngOnInit(): void {}

	selectTab(option: string) {
		if (this.loading) {
			return;
		}
		this.selectedTab = option;
	}

	checkLogin(ev) {
		ev && ev.preventDefault();
		this.loginError = false;

		if (this.loginData.email=='') {
			alert('¡No puedes dejar el email en blanco!');
			return;
		}

		if (this.loginData.pass=='') {
			alert('¡No puedes dejar la contraseña en blanco!');
			return;
		}

		this.loading = true;
		this.as.login(this.loginData).subscribe(result => {
			if (result.status==='ok'){
				this.user.logged = true;
				this.user.id     = result.id;
				this.user.email  = this.cs.urldecode(result.email);
				this.user.token  = this.cs.urldecode(result.token);
				this.user.saveLogin();

				this.router.navigate(['/game/main']);
			}
			else{
				this.loading = false;
				this.loginError = true;
			}
		});
	}
	
	checkRegister(ev) {
		ev && ev.preventDefault();
		this.registerError = null;
		if (this.registerData.email=='') {
			alert('¡No puedes dejar el email en blanco!');
			return;
		}

		if (this.registerData.conf=='') {
			alert('¡No puedes dejar la confirmación del email en blanco!');
			return;
		}

		if (this.registerData.email!==this.registerData.conf) {
			alert('¡Los emails introducidos no coinciden!');
			return;
		}

		if (this.registerData.pass=='') {
			alert('¡No puedes dejar la contraseña en blanco!');
			return;
		}

		this.loading = true;
		this.as.register(this.registerData).subscribe(result => {
			if (result.status==='ok'){
				this.user.logged = true;
				this.user.id     = result.id;
				this.user.email  = this.cs.urldecode(result.email);
				this.user.token  = this.cs.urldecode(result.token);
				this.user.saveLogin();

				this.router.navigate(['/game/main']);
			}
			else{
				this.loading = false;
				this.registerError = result.status;
			}
		});
	}
}