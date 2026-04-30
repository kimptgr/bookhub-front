import {Component, computed, Signal} from '@angular/core';
import {LivreView} from '../../../models/livreView';
import {catchError, Observable, throwError} from 'rxjs';
import {AsyncPipe, DatePipe} from '@angular/common';
import {Card} from 'primeng/card';
import {Tag} from 'primeng/tag';
import {ButtonDirective} from 'primeng/button';
import {ReservationDTO, ReservationService} from '../../../reservation/reservation-service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {UtilisateurService} from '../../../services/utilisateurService';
import {CodeEtat} from '../../../models/enum/code-etat.enum';
import {CodeEtatPipe} from '../../../pipe/code-etat.pipe';
import {Message} from 'primeng/message';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {LivreService} from '../../../services/livre-service';
import {ConfirmDialog} from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@Component({
  selector: 'app-details',
  imports: [
    AsyncPipe,
    Card,
    DatePipe,
    Tag,
    ButtonDirective,
    CodeEtatPipe,
    Message,
    RouterLink,
    ConfirmDialog,
    ConfirmPopupModule,
    RouterLink
  ],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {
  livre$: Observable<LivreView>;
  mesReservations: Signal<ReservationDTO[] | null>;
  dejaReserve;

  public readonly codeEtat = CodeEtat;

  idLivre: number;
  private reservationCourante: Signal<ReservationDTO | null>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
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
    this.reservationCourante = computed(() => {
      return this.mesReservations()?.find(reservation =>
        reservation.livreId === this.idLivre
      ) ?? null;
    });

    this.dejaReserve = computed(() => {
      return this.reservationCourante() !== null;
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
          this.reservationService.refreshMesReservations();
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
  }

  confirmerSeRetirerDeLaListeDAttente(event: Event) {
    const reservation = this.reservationCourante();

    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: 'Annuler la réservation ?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Non',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Oui',
        severity: 'danger'
      },
      accept: () => {
        if (!reservation || reservation.id == null) {
          return;
        }

        this.reservationService
          .jannuleMaReservation(reservation.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Réservation annulée'
            })
            this.reservationService.refreshMesReservations();
            this.router.navigate(['/catalogue']);
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Impossible d’annuler la réservation'
            });
          }
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Réservation conservée'
        });
      }
    });
  }

  roleUtilisateur(): string | null {
    return this.utilisateurService.getRole();
  }

  public onDelete(event: Event): void {
    if (this.roleUtilisateur() !== 'UTILISATEUR') {

      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Voulez-vous supprimer ce livre ?<br>Les réservations associées seront annulées.',
        header: 'Suppression d\'un livre',
        icon: 'pi pi-trash',
        rejectLabel: 'Annuler',
        rejectButtonProps: {
          label: 'Annuler',
          severity: 'secondary',
          outlined: true
        },
        acceptButtonProps: {
          label: 'Supprimer',
          severity: 'danger'
        },

        accept: () => {
          this.livreService.DeleteByID(this.idLivre).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Livre supprimé',
                detail: 'Le livre a été supprimé avec succès'
              });
              this.router.navigate(['/catalogue']);
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: error.message
              });
            }
          });
        }
      });
    }
  }
}
