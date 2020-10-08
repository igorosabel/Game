import { Injectable }       from '@angular/core';
import { DataShareService } from './data-share.service';
import { LoginResult }      from '../interfaces/interfaces';

@Injectable()
export class UserService {
	logged: boolean = false;
	id: number      = null;
	name: string    = null;
	token: string   = null;

	constructor(private dss: DataShareService) {}

	loadLogin() {
		const loginObj = this.dss.getGlobal('login');
		if (loginObj === null){
			this.logout();
		}
		else{
			this.logged = true;
			this.id     = loginObj.id;
			this.name   = loginObj.name;
			this.token  = loginObj.token;
		}
	}

	saveLogin() {
		const loginObj: LoginResult = {
			status: 'ok',
			id: this.id,
			name: this.name,
			token: this.token
		} ;
		this.dss.setGlobal('login', loginObj);
	}

	logout() {
		this.logged = false;
		this.id = null;
		this.name = null;
		this.token = null;
		this.dss.removeGlobal('login');
	}
}
