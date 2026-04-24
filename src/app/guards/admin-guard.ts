import {CanActivateFn} from '@angular/router';
import {inject} from '@angular/core';
import {UtilisateurService} from '../services/utilisateurService';

export const adminGuard: CanActivateFn = (route, state) => {

  const utilisateurService = inject(UtilisateurService);

  return (utilisateurService.getRole() == 'ADMINISTRATEUR')

};
