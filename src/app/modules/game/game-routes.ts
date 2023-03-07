import { Route } from '@angular/router';
import { AuthGuard } from 'src/app/guard/auth.guard';

export const GAME_ROUTES: Route[] = [
  {
    path: 'hall',
    loadComponent: () =>
      import('src/app/modules/game/pages/hall/hall.component'),
    canActivate: [AuthGuard],
  },
  {
    path: 'play',
    loadComponent: () =>
      import('src/app/modules/game/pages/play/play.component'),
    canActivate: [AuthGuard],
  },
  {
    path: 'logout',
    loadComponent: () =>
      import('src/app/modules/game/pages/logout/logout.component'),
  },
];
