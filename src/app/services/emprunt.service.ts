
import {Injectable, signal} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {UpdateEmpruntDTO} from '../models/UpdateEmpruntDTO';

@Injectable({
  providedIn: 'root',
})

export class EmpruntService {
  private readonly BASE_URL = environment.base_url;

  constructor(private http:HttpClient) {
  }

  envoiEmprunt(idLivre: number, userId: number) {
    const reservation: EmpruntDTO = {livreId: idLivre, emprunteurId: userId}
    return this.http.post(this.BASE_URL+"/emprunts", reservation, {observe: "response"});
  }

  public rendreLivre(updateEmpruntDTO: UpdateEmpruntDTO) {
    return this.http.patch(this.BASE_URL + "/emprunts/" + updateEmpruntDTO.idEmprunt, updateEmpruntDTO, {observe: "response"})
  }

}

export interface EmpruntDTO {
  livreId: number,
  emprunteurId: number
}
