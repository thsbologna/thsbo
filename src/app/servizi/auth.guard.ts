import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UtenteService } from './utente.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const utenteService = inject(UtenteService);


    if (utenteService.getUtente() == null || utenteService.getUtente() == undefined) {
        return false;
    }

  return true;
};
