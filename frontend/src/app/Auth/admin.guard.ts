import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const adminGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getUserData();
  const isAdmin = user?.role === 'Admin' || user?.role === 'Super Admin';

  return isAdmin
    ? true
    : router.createUrlTree(['/auth/login-registeration-forget'], {
        queryParams: { returnUrl: state.url },
      });
};