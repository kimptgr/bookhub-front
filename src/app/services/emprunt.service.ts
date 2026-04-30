
import {Injectable, signal} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EmpruntHistorique} from '../models/EmpruntHistorique';
import {EmpruntEnCours} from '../models/EmpruntEnCours';

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


  getEmpruntsEnCours(): Observable<EmpruntEnCours[]> {
    return this.http.get<EmpruntEnCours[]>(`${this.BASE_URL}/emprunts/me`);
  }

  getHistorique(): Observable<EmpruntHistorique[]> {
    return this.http.get<EmpruntHistorique[]>(`${this.BASE_URL}/emprunts/me/historique`);
  }


  public rendreLivre(updateEmpruntDTO: UpdateEmpruntDTO) {
    return this.http.patch(this.BASE_URL + "/emprunts/" + updateEmpruntDTO.idEmprunt, updateEmpruntDTO, {observe: "response"})
  }

}

export interface EmpruntDTO {
  livreId: number,
  emprunteurId: number
}
