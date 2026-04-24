import {ActivatedRoute, CanActivateFn, Router, UrlSegment} from '@angular/router';
import { AuthService} from '../services/authService';
import {inject} from '@angular/core';



export const authenticatedGuard: CanActivateFn = (route, state) => {

 const authService = inject(AuthService);
 const router = inject(Router);

 if (authService.estConnecte()) {

   return true;
 }

 // si pas de token, on redirige vers la page de connexion et on envoie l'url de la page actuelle
  return router.createUrlTree(['/connexion'], {
    queryParams: { returnUrl: state.url }
  });

};
