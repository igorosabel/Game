import { Route } from '@angular/router';
import isLoggedGuardFn from '@app/guard/auth.guard.fn';

const ADMIN_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('@admin/pages/admin-login/admin-login.component'),
  },
  {
    path: 'logout',
    loadComponent: () =>
      import('@admin/pages/admin-logout/admin-logout.component'),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'main',
    loadComponent: () => import('@admin/pages/admin-main/admin-main.component'),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'worlds',
    loadComponent: () => import('@admin/pages/worlds/worlds/worlds.component'),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'world/:worldId/scenarios',
    loadComponent: () =>
      import('@admin/pages/worlds/scenarios/scenarios.component'),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'world/:worldId/scenario/:scenarioId',
    loadComponent: () =>
      import('@admin/pages/worlds/edit-scenario/edit-scenario.component'),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'resources',
    loadComponent: () =>
      import('@admin/pages/resources/resources/resources.component'),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'resources/backgrounds',
    loadComponent: () =>
      import('@admin/pages/resources/backgrounds/backgrounds.component'),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'resources/backgrounds/categories',
    loadComponent: () =>
      import(
        '@admin/pages/resources/background-categories/background-categories.component'
      ),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'resources/characters',
    loadComponent: () =>
      import('@admin/pages/resources/characters/characters.component'),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'resources/scenario-objects',
    loadComponent: () =>
      import(
        '@admin/pages/resources/scenario-objects/scenario-objects.component'
      ),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'resources/items',
    loadComponent: () => import('@admin/pages/resources/items/items.component'),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'resources/assets',
    loadComponent: () =>
      import('@admin/pages/resources/assets/assets.component'),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'users',
    loadComponent: () => import('@admin/pages/users/users/users.component'),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'user/:id_user/games',
    loadComponent: () => import('@admin/pages/users/games/games.component'),
    canActivate: [isLoggedGuardFn],
  },
];
export default ADMIN_ROUTES;
