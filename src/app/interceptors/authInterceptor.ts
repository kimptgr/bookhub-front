import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/authService';


/*
export cont permet de rendre le service disponible partout dans l'application
HttpInterceptorFn type explicitement le retour de la fonction
req requête HTTP sortante, elle est déclenché par le composant
next fonction qui transmet la requête à l'étape suivante

inject permet d'injecter un service dans une fonction sans constructeur


*/
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    /* On clone la requête en ajoutant le header Authorization avec le token
    On ne peut pas modifier directement la requête (immuable), c'est pour ça qu'on la copie pour la modifier.
    Bearer est présent dans le token, on l'ajoute pour indiquer que le token est un JWT, c'est la convention RFC 6750
     */
    const requeteAvecToken = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(requeteAvecToken);
  }

  // si pas encore de token, on retourne la route sans modification par exemple page de connexion
  return next(req);
};
