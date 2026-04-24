import {Component} from '@angular/core';
import {LivreView} from '../../../models/livreView';
import {ActivatedRoute, Router} from '@angular/router';
import {LivreService} from '../livre-service';
import {catchError, Observable, throwError} from 'rxjs';
import {AsyncPipe, DatePipe} from '@angular/common';
import {Card} from 'primeng/card';
import {Tag} from 'primeng/tag';
import {Button, ButtonDirective, ButtonLabel} from 'primeng/button';
import {ReservationService} from '../../../reservation/reservation-service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-details',
  imports: [
    AsyncPipe,
    Card,
    DatePipe,
    Tag,
    ButtonDirective,
    ButtonLabel,
  ],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {
  livre$: Observable<LivreView>;
  idLivre: string;

  constructor(private route: ActivatedRoute, private livreService: LivreService, private reservationService: ReservationService, private messageService: MessageService, private router: Router) {
    this.idLivre = this.route.snapshot.paramMap.get('id') ?? "0";
    this.livre$ = this.livreService.getById(this.idLivre).pipe(
      catchError(error => {
        if (error.status) {
          this.router.navigate(['/catalogue']);
        }
        return throwError(() => error)
      })
    );
  }

  onReservation() {
    // TODO récupérer l'id de l'utilisateur
    const myId = 1
    if (this.reservationService.jeReserve(this.idLivre, myId)) {
      this.messageService.add({
        severity: 'success',
        summary: 'Livre réservé',
        detail: 'Livre réservé, vous avez 14 jours pour venir le chercher.'
      })
      this.router.navigate(['/catalogue']);
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Livre réservé',
        detail: 'Vous êtes désormais sur liste d\'attente.'
      })
    }
  }
}
