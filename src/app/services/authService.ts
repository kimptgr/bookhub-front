import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { InscriptionDTO } from '../models/inscriptionDTO';
import { ConnexionDTO, TokenResponse } from '../models/connexionDTO';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';


// le root permet de rendre le service disponible partout dans l'application'
@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/bookhub-club/api/auth';

  constructor(private http: HttpClient) { }

  // On envoie les données saisies dans le back pour l'inscription'
  inscription(data: InscriptionDTO): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/inscription`, data);
  }


  /*
  Observable<TokenResponse> permet de gérer un flux asynchrone avec un objet JSON format : {token: string}
  .post<TokenResponse permet de convertir le JSON en un objet TokenResponse
  .pipe() permet de chainer un opérateur sur le flux pour intercepter / transformer des données
  .tap() permet de capter la donner et de faire une action en || (effet de bord pour stocker le token)

    TODO : fix me attention, le sessionStorage et le localStorage sont soumis au attaque XSS
    le sessionStorage se vide quand on ferme un onglet et ne se partage pas entre onglets
   */


  connexion(data: ConnexionDTO): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/connexion`, data).pipe(
      tap(response => {
        // On stocke le token dès que le back nous le renvoie
        sessionStorage.setItem('token', response.token);
      })
    );
  }

  deconnexion(): void {
    sessionStorage.removeItem('token');
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  estConnecte(): boolean {
    return this.getToken() !== null;
  }
}
