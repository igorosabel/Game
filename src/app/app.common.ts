/*
 * Páginas
 */
import { LoginComponent }                from './pages/game/login/login.component';
import { AdminLoginComponent }           from './pages/admin/admin-login/admin-login.component';
import { AdminLogoutComponent }          from './pages/admin/admin-logout/admin-logout.component';
import { MainComponent }                 from './pages/admin/main/main.component';
import { AssetsComponent }               from './pages/admin/resources/assets/assets.component';
import { BackgroundCategoriesComponent } from './pages/admin/resources/background-categories/background-categories.component';
import { BackgroundsComponent }          from './pages/admin/resources/backgrounds/backgrounds.component';
import { CharactersComponent }           from './pages/admin/resources/characters/characters.component';
import { ItemsComponent }                from './pages/admin/resources/items/items.component';
import { ResourcesComponent }            from './pages/admin/resources/resources/resources.component';
import { ScenarioObjectsComponent }      from './pages/admin/resources/scenario-objects/scenario-objects.component';
import { GamesComponent }                from './pages/admin/users/games/games.component';
import { UsersComponent }                from './pages/admin/users/users/users.component';
import { EditScenarioComponent }         from './pages/admin/worlds/edit-scenario/edit-scenario.component';
import { ScenariosComponent }            from './pages/admin/worlds/scenarios/scenarios.component';
import { WorldsComponent }               from './pages/admin/worlds/worlds/worlds.component';

export const PAGES: any[] = [
  LoginComponent,
  AdminLoginComponent,
  AdminLogoutComponent,
  MainComponent,
  AssetsComponent,
  BackgroundCategoriesComponent,
  BackgroundsComponent,
  CharactersComponent,
  ItemsComponent,
  ResourcesComponent,
  ScenarioObjectsComponent,
  GamesComponent,
  UsersComponent,
  EditScenarioComponent,
  ScenariosComponent,
  WorldsComponent
];

/*
 * Componentes
 */
import { HeaderComponent }               from './components/header/header.component';
import { AssetPickerComponent }          from './components/asset-picker/asset-picker.component';
import { ItemPickerComponent }           from './components/item-picker/item-picker.component';
import { BackgroundPickerComponent }     from './components/background-picker/background-picker.component';
import { ScenarioObjectPickerComponent } from './components/scenario-object-picker/scenario-object-picker.component';
import { CharacterPickerComponent }      from './components/character-picker/character-picker.component';
 
export const COMPONENTS: any[] = [
	HeaderComponent,
	AssetPickerComponent,
	ItemPickerComponent,
	BackgroundPickerComponent,
	ScenarioObjectPickerComponent,
	CharacterPickerComponent
];

/*
 * Pipes
 */
import { UrldecodePipe }  from './pipes/urldecode.pipe';

export const PIPES: any[] = [
  UrldecodePipe
];

/*
 * Servicios
 */
import { CommonService }      from './services/common.service';
import { ApiService }         from './services/api.service';
import { DataShareService }   from './services/data-share.service';
import { UserService }        from './services/user.service';
import { AuthService }        from './services/auth.service';
import { ClassMapperService } from './services/class-mapper.service';

export const SERVICES: any[] = [
  CommonService,
  ApiService,
  DataShareService,
  UserService,
  AuthService,
  ClassMapperService
];