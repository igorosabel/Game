import { NgModule }                      from '@angular/core';
import { Routes, RouterModule }          from '@angular/router';
import { AuthGuard }                     from './guard/auth.guard';
import { LoginComponent }                from './pages/game/login/login.component';
import { HallComponent }                 from './pages/game/hall/hall.component';
import { PlayComponent }                 from './pages/game/play/play.component';
import { AdminLoginComponent }           from './pages/admin/admin-login/admin-login.component';
import { AdminLogoutComponent }          from './pages/admin/admin-logout/admin-logout.component';
import { AdminMainComponent }            from './pages/admin/admin-main/admin-main.component';
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

const routes: Routes = [
	{ path: '',                                            component: LoginComponent },
	{ path: 'game/hall',                                   component: HallComponent,                 canActivate: [AuthGuard] },
	{ path: 'game/play',                                   component: PlayComponent,                 canActivate: [AuthGuard] },
	{ path: 'admin',                                       component: AdminLoginComponent },
	{ path: 'admin/logout',                                component: AdminLogoutComponent,          canActivate: [AuthGuard] },
	{ path: 'admin/main',                                  component: AdminMainComponent,            canActivate: [AuthGuard] },
	{ path: 'admin/worlds',                                component: WorldsComponent,               canActivate: [AuthGuard] },
	{ path: 'admin/world/:id_world/scenarios',             component: ScenariosComponent,            canActivate: [AuthGuard] },
	{ path: 'admin/world/:id_world/scenario/:id_scenario', component: EditScenarioComponent,         canActivate: [AuthGuard] },
	{ path: 'admin/resources',                             component: ResourcesComponent,            canActivate: [AuthGuard] },
	{ path: 'admin/resources/backgrounds',                 component: BackgroundsComponent,          canActivate: [AuthGuard] },
	{ path: 'admin/resources/backgrounds/categories',      component: BackgroundCategoriesComponent, canActivate: [AuthGuard] },
	{ path: 'admin/resources/characters',                  component: CharactersComponent,           canActivate: [AuthGuard] },
	{ path: 'admin/resources/scenario-objects',            component: ScenarioObjectsComponent,      canActivate: [AuthGuard] },
	{ path: 'admin/resources/items',                       component: ItemsComponent,                canActivate: [AuthGuard] },
	{ path: 'admin/resources/assets',                      component: AssetsComponent,               canActivate: [AuthGuard] },
	{ path: 'admin/users',                                 component: UsersComponent,                canActivate: [AuthGuard] },
	{ path: 'admin/user/:id_user/games',                   component: GamesComponent,                canActivate: [AuthGuard] }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
