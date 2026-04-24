import { CanActivateFn, Router } from '@angular/router';
import {inject} from '@angular/core';
import {UtilisateurService} from '../services/utilisateurService';

export const librarianGuard: CanActivateFn = (route, state) => {

  const utilisateurService = inject(UtilisateurService);
  const router = inject(Router);

  if (utilisateurService.getRole() == 'BIBLIOTHECAIRE' || utilisateurService.getRole() == 'ADMINISTRATEUR') {
    return true;
  }
  return router.createUrlTree(['/catalogue']);
};

