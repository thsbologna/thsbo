import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (
    authService.isLoggedIn()
  ) {

    authService.checkSessionExpiry();
    return true;
  } else {
    authService.logout();
    router.navigateByUrl('/shop/accedi');
    return false;
  }
};
