import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private readonly BASE_URL = environment.base_url;

  constructor(private http:HttpClient) {
  }

  //TODO when back is ready
  jeReserve(idLivre: string, myId: number) {
    return true;
  }
}
