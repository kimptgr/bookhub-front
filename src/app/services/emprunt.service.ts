
import {Injectable, signal} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class EmpruntService {
  private readonly BASE_URL = environment.base_url;

  constructor(private http:HttpClient) {
  }

  envoitEmprunt(idLivre: number, userId: number) {
    const reservation: EmpruntDTO = {livreId: idLivre, emprunteurId: userId}
    return this.http.post(this.BASE_URL+"/emprunts", reservation, {observe: "response"});
  }

}

export interface EmpruntDTO {
  livreId: number,
  emprunteurId: number
}
