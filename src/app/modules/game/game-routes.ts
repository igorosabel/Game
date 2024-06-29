import { Route } from '@angular/router';
import isLoggedGuardFn from '@app/guard/auth.guard.fn';

const GAME_ROUTES: Route[] = [
  {
    path: 'hall',
    loadComponent: () => import('@game/pages/hall/hall.component'),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'play',
    loadComponent: () => import('@game/pages/play/play.component'),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'logout',
    loadComponent: () => import('@game/pages/logout/logout.component'),
  },
];
export default GAME_ROUTES;
