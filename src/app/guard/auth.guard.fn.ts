import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import AuthService from '@services/auth.service';
import { Observable, tap } from 'rxjs';

const isLoggedGuardFn: CanActivateFn = (): Observable<boolean> => {
  const router = inject(Router);
  return inject(AuthService)
    .isAuthenticated()
    .pipe(
      tap(
        (isLoggedIn: boolean): Promise<boolean> =>
          !isLoggedIn && router.navigate(['/'])
      )
    );
};
export default isLoggedGuardFn;
