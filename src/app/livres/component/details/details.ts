import {Component, computed, Signal} from '@angular/core';
import {LivreView} from '../../../models/livreView';
import {ActivatedRoute, Router} from '@angular/router';
import {LivreService} from '../livre-service';
import {catchError, Observable, throwError} from 'rxjs';
import {AsyncPipe, DatePipe} from '@angular/common';
import {Card} from 'primeng/card';
import {Tag} from 'primeng/tag';
import {ButtonDirective, ButtonLabel} from 'primeng/button';
import {ReservationService} from '../../../reservation/reservation-service';
import {MessageService} from 'primeng/api';
import {UtilisateurService} from '../../../services/utilisateurService';

@Component({
  selector: 'app-details',
  imports: [
    AsyncPipe,
    Card,
    DatePipe,
    Tag,
    ButtonDirective,
    ButtonLabel
  ],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {
  livre$: Observable<LivreView>;
  mesReservations: Signal<number[] | null>;
  dejaReserve;

  // users$: Observable<userDTO>;
  idLivre: number;
  // showReservationDialog: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private livreService: LivreService,
    private messageService: MessageService,
    private reservationService: ReservationService,
    private utilisateurService: UtilisateurService) {

    this.idLivre = parseInt(<string>this.route.snapshot.paramMap.get('id')) ?? "0";
    this.livre$ = this.livreService.getById(this.idLivre).pipe(
      catchError(error => {
        if (error.status) {
          this.router.navigate(['/catalogue']);
        }
        return throwError(() => error)
      })
    );
    this.reservationService.chargeMesReservations()
    this.mesReservations = this.reservationService.mesReservations;
    this.dejaReserve = computed(() => {
      return this.mesReservations()?.includes(this.idLivre) ?? false;
    });
  }

  onReservation() {
    const myId = this.utilisateurService.getId();
    if (myId == null) {
      this.messageService.add({
        severity: 'error',
        summary: 'Une erreur est survenue',
        detail: 'Si cette erreur persiste, merce de vous reconnecter.'
      })
      return;
    }
    this.reservationService.jeReserve(this.idLivre, myId).subscribe({
      next: (response) => {
        if (response.status == 201) {
          this.messageService.add({
            severity: 'success',
            summary: 'Livre réservé',
            detail: 'Livre réservé, vous recevrez un mail pour venir le chercher.'
          })
          this.router.navigate(['/catalogue']);
        }
      },
      error: err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: err.error.message
        });
      }
    })

    this.reservationService.refreshMesReservations();
  }

  onSeRetirer() {
    this.reservationService.refreshMesReservations();
  }
}
