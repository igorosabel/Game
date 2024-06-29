import { Route, Routes } from '@angular/router';
import LoginComponent from '@game/pages/login/login.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'admin',
    loadChildren: () =>
      import('@admin/admin-routes').then((m): Route[] => m.default),
  },
  {
    path: 'game',
    loadChildren: () =>
      import('@game/game-routes').then((m): Route[] => m.default),
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];
export default routes;
