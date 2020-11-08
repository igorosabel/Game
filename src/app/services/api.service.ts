import { HttpClient }  from '@angular/common/http';
import { Injectable }  from '@angular/core';
import { Observable }  from 'rxjs';
import { environment } from '../../environments/environment';

import {
	LoginData,
	RegisterData,
	LoginResult,
	GameResult,
	NewGameInterface,
	PlayResult,
	PlayConnectionInterface,
	WorldResult,
	WorldInterface,
	StatusResult,
	StatusIdResult,
	StatusMessageResult,
	ScenarioResult,
	ScenarioInterface,
	ScenarioDataResult,
	ScenarioDataInterface,
	ConnectionInterface,
	ConnectionResult,
	WorldStartInterface,
	TagResult,
	AssetResult,
	AssetInterface,
	BackgroundCategoryResult,
	BackgroundCategoryInterface,
	BackgroundResult,
	BackgroundInterface,
	ItemResult,
	ItemInterface,
	CharacterResult,
	CharacterInterface,
	ScenarioObjectResult,
	ScenarioObjectInterface
} from '../interfaces/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	url = environment.url;

	constructor(private http : HttpClient){}

	login(data: LoginData): Observable<LoginResult> {
		return this.http.post<LoginResult>(this.url + 'api/login', data);
	}

	register(data: RegisterData): Observable<LoginResult> {
		return this.http.post<LoginResult>(this.url + 'api/register', data);
	}

	getGames(): Observable<GameResult> {
		return this.http.post<GameResult>(this.url + 'api/get-games', {});
	}

	newGame(data: NewGameInterface): Observable<StatusIdResult> {
		return this.http.post<StatusIdResult>(this.url + 'api/new-game', data);
	}

	getPlayData(id: number): Observable<PlayResult> {
		return this.http.post<PlayResult>(this.url + 'api/get-play-data', {id});
	}

	getUnlockedWorlds(id: number): Observable<WorldResult> {
		return this.http.post<WorldResult>(this.url + 'api/get-unlocked-worlds', {id});
	}

	getScenarioConnections(id: number): Observable<ConnectionResult> {
		return this.http.post<ConnectionResult>(this.url + 'api/get-scenario-connections', {id});
	}

	travel(idGame: number, idWorld: number, wordOne: string, wordTwo: string, wordThree: string): Observable<StatusIdResult> {
		return this.http.post<StatusIdResult>(this.url + 'api/travel', {idGame, idWorld, wordOne, wordTwo, wordThree});
	}

	changeScenario(connection: PlayConnectionInterface): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.url + 'api/change-scenario', connection);
	}

	hitEnemy(idGame: number, idScenarioData: number): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.url + 'api/hit-enemy', {idGame, idScenarioData});
	}

	updatePosition(idGame: number, x: number, y: number, orientation: string): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.url + 'api/update-position', {idGame, x, y, orientation});
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

	getScenario(id: number): Observable<ScenarioDataResult> {
		return this.http.post<ScenarioDataResult>(this.url + 'admin/get-scenario', {id});
	}

	saveScenarioData(scenarioData: ScenarioDataInterface): Observable<StatusIdResult> {
		return this.http.post<StatusIdResult>(this.url + 'admin/save-scenario-data', scenarioData);
	}

	saveConnection(connection: ConnectionInterface): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.url + 'admin/save-connection', connection);
	}

	deleteConnection(connection: ConnectionInterface): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.url + 'admin/delete-connection', connection);
	}

	selectWorldStart(data: WorldStartInterface): Observable<StatusMessageResult> {
		return this.http.post<StatusMessageResult>(this.url + 'admin/select-world-start', data);
	}

	generateMap(id: number): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.url + 'admin/generate-map', {id});
	}

	getTags(): Observable<TagResult> {
		return this.http.post<TagResult>(this.url + 'admin/tag-list', {});
	}

	getAssets(): Observable<AssetResult> {
		return this.http.post<AssetResult>(this.url + 'admin/asset-list', {});
	}

	saveAsset(asset: AssetInterface): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.url + 'admin/save-asset', asset);
	}

	deleteAsset(id: number): Observable<StatusMessageResult> {
		return this.http.post<StatusMessageResult>(this.url + 'admin/delete-asset', {id});
	}

	getBackgroundCategories(): Observable<BackgroundCategoryResult> {
		return this.http.post<BackgroundCategoryResult>(this.url + 'admin/background-category-list', {});
	}

	saveBackgroundCategory(backgroundCategory: BackgroundCategoryInterface): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.url + 'admin/save-background-category', backgroundCategory);
	}

	deleteBackgroundCategory(id: number): Observable<StatusMessageResult> {
		return this.http.post<StatusMessageResult>(this.url + 'admin/delete-background-category', {id});
	}

	getBackgrounds(): Observable<BackgroundResult> {
		return this.http.post<BackgroundResult>(this.url + 'admin/background-list', {});
	}

	saveBackground(background: BackgroundInterface): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.url + 'admin/save-background', background);
	}

	deleteBackground(id: number): Observable<StatusMessageResult> {
		return this.http.post<StatusMessageResult>(this.url + 'admin/delete-background', {id});
	}

	getItems(): Observable<ItemResult> {
		return this.http.post<ItemResult>(this.url + 'admin/item-list', {});
	}

	saveItem(item: ItemInterface): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.url + 'admin/save-item', item);
	}

	deleteItem(id: number): Observable<StatusMessageResult> {
		return this.http.post<StatusMessageResult>(this.url + 'admin/delete-item', {id});
	}

	getCharacters(): Observable<CharacterResult> {
		return this.http.post<CharacterResult>(this.url + 'admin/character-list', {});
	}

	saveCharacter(character: CharacterInterface): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.url + 'admin/save-character', character);
	}

	deleteCharacter(id: number): Observable<StatusMessageResult> {
		return this.http.post<StatusMessageResult>(this.url + 'admin/delete-character', {id});
	}

	getScenarioObjects(): Observable<ScenarioObjectResult> {
		return this.http.post<ScenarioObjectResult>(this.url + 'admin/scenario-object-list', {});
	}

	saveScenarioObject(scenarioObject: ScenarioObjectInterface): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.url + 'admin/save-scenario-object', scenarioObject);
	}

	deleteScenarioObject(id: number): Observable<StatusMessageResult> {
		return this.http.post<StatusMessageResult>(this.url + 'admin/delete-scenario-object', {id});
	}
}
