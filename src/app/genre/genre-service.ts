import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Genre} from '../models/genre';

@Injectable({
  providedIn: 'root',
})
export class GenreService {
  private readonly BASE_URL = 'http://localhost:8080/bookhub-club/api';

  constructor(private http:HttpClient) {
  }

  public getGenres(): Observable<Genre[]>{
    return this.http.get<Genre[]>(`${this.BASE_URL}/genres`)
  }
}
