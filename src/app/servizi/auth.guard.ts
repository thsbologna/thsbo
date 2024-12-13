import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (typeof window !== 'undefined') {
    if (
      sessionStorage!.getItem('utente') != null ||
      localStorage!.getItem('utente') != null
    ) {
      return true;
    } else {
      router.navigateByUrl('/shop/accedi');
      return false;
    }
  }

  return false;
};
