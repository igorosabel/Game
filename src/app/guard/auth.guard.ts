import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	constructor(public auth: AuthService, public router: Router) {}

	canActivate(): boolean {
		if (!this.auth.isAuthenticated()) {
			this.router.navigate(['/']);
			return false;
		}
		return true;
	}
}
