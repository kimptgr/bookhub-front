import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LivreService {
  private readonly BASE_URL = 'http://localhost:8080/bookhub-club/api';

  constructor(private http:HttpClient) {
  }

  public faireRecherche(pageIndex: number, pageSize: number, recherche: any): Observable<any>{
    return this.http.get<any>(`${this.BASE_URL}/books`,
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
}
