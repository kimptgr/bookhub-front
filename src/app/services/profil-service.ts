import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {map, Observable} from 'rxjs';
import {UpdateMotDePasse} from '../models/UpdateMotDePasse';
import {VerifMotDePasse} from '../models/VerifMotDePasse';
import {UpdateProfil} from '../models/UpdateProfil';
import {Profil} from '../models/Profil';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProfilService {

  private readonly BASE_URL = environment.base_url + '/profil/me';

  constructor(private http: HttpClient) {}

  getProfil(): Observable<Profil> {
    return this.http.get<Profil>(this.BASE_URL);
  }

  updateProfil(data: UpdateProfil): Observable<void> {
    return this.http.patch<{ token: string }>(`${this.BASE_URL}`, data).pipe(
      tap(response => {
        // On met à jour le token en sessionStorage avec le nouveau
        sessionStorage.setItem('token', response.token);
      }),
      map(() => void 0)  // on retourne void comme avant
    );
  }

  verifierMotDePasse(data: VerifMotDePasse): Observable<void> {
    return this.http.post<void>(`${this.BASE_URL}/verifier-mot-de-passe`, data);
  }

  updateMotDePasse(data: UpdateMotDePasse): Observable<void> {
    return this.http.patch<{ token: string }>(`${this.BASE_URL}/mot-de-passe`, data).pipe(
      tap(response => {
        // On met à jour le token en sessionStorage avec le nouveau
        sessionStorage.setItem('token', response.token);
      }),
      map(() => void 0)
    );
  }

  supprimerCompte(): Observable<void> {
    return this.http.delete<void>(this.BASE_URL);
  }
}
