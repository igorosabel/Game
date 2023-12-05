import { Route, Routes } from '@angular/router';
import { LoginComponent } from 'src/app/modules/game/pages/login/login.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'admin',
    loadChildren: () =>
      import('src/app/modules/admin/admin-routes').then(
        (m): Route[] => m.ADMIN_ROUTES
      ),
  },
  {
    path: 'game',
    loadChildren: () =>
      import('src/app/modules/game/game-routes').then(
        (m): Route[] => m.GAME_ROUTES
      ),
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];
