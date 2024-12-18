import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UtenteService } from './utente.service';
import { ResponseCustom } from '../interfacce/response-custom';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const utenteService = inject(UtenteService);

  if (
    utenteService.getUtente() !== null &&
    utenteService.getUtente().carrello.id == sessionStorage.getItem('carrello')
  ) {
    return true;
  } else {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('utente');
    localStorage.removeItem('token');
    localStorage.removeItem('utente');

    router.navigateByUrl('/shop/accedi');
    return false;
  }
};
