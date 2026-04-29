import {Injectable, signal} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Reservation} from '../models/reservation';
import {tap} from 'rxjs/operators';
import {map, Observable} from 'rxjs';
import {ReservationProfil} from '../models/ReservationProfil';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private readonly BASE_URL = environment.base_url;
  private _mesReservations = signal<number[] | null>(null);
  mesReservations = this._mesReservations.asReadonly();

  constructor(private http:HttpClient) {
  }

  jeReserve(idLivre: number, myId: number) {
    const reservation: ReservationDTO = {livreId: idLivre, reservateurId: myId}
    return this.http.post(this.BASE_URL+"/reservations", reservation, {observe: "response"});
  }

  chargeMesReservations() {
    if (this._mesReservations() == null) {
      this.refreshMesReservations()
    }
  }

  refreshMesReservations() {
    this.http.get<ReservationDTO[]>(this.BASE_URL+"/reservations/me").pipe(
      map(resa=> resa.map(r=> r.livreId)),
      tap(resa=> {
        this._mesReservations.set(resa)
      })
    ).subscribe();
  }

  getReservationsProfil(): Observable<ReservationProfil[]> {
    return this.http.get<ReservationProfil[]>(
      `${this.BASE_URL}/reservations/me/profil`
    );
  }

}

export interface ReservationDTO {
  livreId: number,
  reservateurId: number
}
