import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable }              from '@angular/core';
import { Observable }              from 'rxjs';
import { environment }             from '../../environments/environment';

import {
	LoginData,
	LoginResult,
	WorldResult,
	WorldInterface,
	StatusResult,
	ScenarioResult,
	ScenarioInterface
} from '../interfaces/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	url = environment.url;

	constructor(private http : HttpClient){}

	login(data: LoginData): Observable<LoginResult> {
		return this.http.post<LoginResult>(this.url + 'login', data);
	}

	adminLogin(data: LoginData): Observable<LoginResult> {
		return this.http.post<LoginResult>(this.url + 'admin/login', data);
	}

	getWorlds(): Observable<WorldResult> {
		return this.http.post<WorldResult>(this.url + 'admin/world-list', {});
	}

	saveWorld(world: WorldInterface): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.url + 'admin/save-world', world);
	}

	deleteWorld(id: number): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.url + 'admin/delete-world', {id});
	}
	
	getScenarios(id: number): Observable<ScenarioResult> {
		return this.http.post<ScenarioResult>(this.url + 'admin/scenario-list', {id});
	}

	saveScenario(scenario: ScenarioInterface): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.url + 'admin/save-scenario', scenario);
	}

	deleteScenario(id: number): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.url + 'admin/delete-scenario', {id});
	}
}
