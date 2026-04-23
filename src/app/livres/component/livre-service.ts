import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Livre} from '../../models/livre';
import {catchError, map, throwError} from 'rxjs';
import {environment} from '../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class LivreService {

  private readonly BASE_URL = environment.base_url;

  constructor(private http: HttpClient) {}

  postLivre(livre: Livre) {
    return this.http.post(this.BASE_URL+ '/books', livre).pipe(
      map(response => {
        return response;
      }),
      catchError(error => {
        console.error('Erreur POST', error);
        return throwError(() => error);
      })
    );
  }
}
