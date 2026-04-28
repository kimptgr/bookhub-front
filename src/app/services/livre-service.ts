import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Livre} from '../models/livre';
import {catchError, map, Observable, throwError} from 'rxjs';
import {environment} from '../../environments/environment'
import {LivreView} from '../models/livreView';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LivreService {

  private readonly BASE_URL = environment.base_url;

  constructor(private http: HttpClient) {
  }

  postLivre(livre: Livre) {
    return this.http.post(this.BASE_URL + '/books', livre).pipe(
      map(response => {
        return response;
      }),
      catchError(error => {
        console.error('Erreur POST', error);
        return throwError(() => error);
      })
    );
  }

  getById(id: number | null) {
    return this.http.get<LivreView>(`${this.BASE_URL}/books/${id}`).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  public faireRecherche(pageIndex: number, pageSize: number, recherche: any): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/books/search`,
      {
        params: new HttpParams()
          .set('saisie', recherche.saisie)
          .set('genres', recherche.genres)
          .set('disponibilite', recherche.disponibilite)
          .set('page', pageIndex)
          .set('size', pageSize)
      }
    );
  }

  patchLivre(id: number, payload: any): Observable<void> {
    return this.http.patch<void>(`${this.BASE_URL}/books/${id}`, payload);
  }


  DeleteByID(id: number) {

    return this.http.delete(`${this.BASE_URL}/books/${id}`).pipe(
      catchError(error => {

        let message: string;

        switch (error.status) {
          case 403:
            message = 'Vous n\'avez pas les droits pour supprimer ce livre.';
            break;
          case 404:
            message = 'Ce livre n\'existe pas ou a déjà été supprimé.';
            break;
          case 409:
            message = 'Impossible de supprimer ce livre, il est lié à des réservations.';
            break;
          default:
            message = 'Une erreur est survenue lors de la suppression.';
        }

        return throwError(() => new Error(message));
      })
    )
  }


}
