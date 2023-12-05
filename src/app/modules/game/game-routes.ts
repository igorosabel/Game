import { Route } from '@angular/router';
import { isLoggedGuardFn } from 'src/app/guard/auth.guard.fn';

export const GAME_ROUTES: Route[] = [
  {
    path: 'hall',
    loadComponent: () =>
      import('src/app/modules/game/pages/hall/hall.component'),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'play',
    loadComponent: () =>
      import('src/app/modules/game/pages/play/play.component'),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'logout',
    loadComponent: () =>
      import('src/app/modules/game/pages/logout/logout.component'),
  },
];
