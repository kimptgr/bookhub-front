import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Etat} from '../models/etat';

@Injectable({
  providedIn: 'root',
})
export class EtatService {
  private readonly BASE_URL = 'http://localhost:8080/bookhub-club/api';

  constructor(private http:HttpClient) {
  }

  public getEtats(): Observable<Etat[]>{
    return this.http.get<Etat[]>(`${this.BASE_URL}/etats`)
  }
}
