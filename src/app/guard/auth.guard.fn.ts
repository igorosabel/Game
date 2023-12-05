import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

export const isLoggedGuardFn: CanActivateFn = (): Observable<boolean> => {
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
