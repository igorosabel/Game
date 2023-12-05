import { Route } from '@angular/router';
import { isLoggedGuardFn } from 'src/app/guard/auth.guard.fn';

export const ADMIN_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('src/app/modules/admin/pages/admin-login/admin-login.component'),
  },
  {
    path: 'logout',
    loadComponent: () =>
      import('src/app/modules/admin/pages/admin-logout/admin-logout.component'),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'main',
    loadComponent: () =>
      import('src/app/modules/admin/pages/admin-main/admin-main.component'),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'worlds',
    loadComponent: () =>
      import('src/app/modules/admin/pages/worlds/worlds/worlds.component'),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'world/:id_world/scenarios',
    loadComponent: () =>
      import(
        'src/app/modules/admin/pages/worlds/scenarios/scenarios.component'
      ),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'world/:id_world/scenario/:id_scenario',
    loadComponent: () =>
      import(
        'src/app/modules/admin/pages/worlds/edit-scenario/edit-scenario.component'
      ),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'resources',
    loadComponent: () =>
      import(
        'src/app/modules/admin/pages/resources/resources/resources.component'
      ),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'resources/backgrounds',
    loadComponent: () =>
      import(
        'src/app/modules/admin/pages/resources/backgrounds/backgrounds.component'
      ),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'resources/backgrounds/categories',
    loadComponent: () =>
      import(
        'src/app/modules/admin/pages/resources/background-categories/background-categories.component'
      ),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'resources/characters',
    loadComponent: () =>
      import(
        'src/app/modules/admin/pages/resources/characters/characters.component'
      ),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'resources/scenario-objects',
    loadComponent: () =>
      import(
        'src/app/modules/admin/pages/resources/scenario-objects/scenario-objects.component'
      ),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'resources/items',
    loadComponent: () =>
      import('src/app/modules/admin/pages/resources/items/items.component'),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'resources/assets',
    loadComponent: () =>
      import('src/app/modules/admin/pages/resources/assets/assets.component'),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'users',
    loadComponent: () =>
      import('src/app/modules/admin/pages/users/users/users.component'),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'user/:id_user/games',
    loadComponent: () =>
      import('src/app/modules/admin/pages/users/games/games.component'),
    canActivate: [isLoggedGuardFn],
  },
];
