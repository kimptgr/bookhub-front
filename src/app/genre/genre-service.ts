import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Genre} from '../models/genre';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GenreService {
  private readonly BASE_URL = environment.base_url;

  constructor(private http:HttpClient) {
  }

  public getGenres(): Observable<Genre[]>{
    return this.http.get<Genre[]>(`${this.BASE_URL}/genres`)
  }
}
