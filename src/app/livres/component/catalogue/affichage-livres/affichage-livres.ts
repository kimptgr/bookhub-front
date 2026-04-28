import {Component, Input, output, WritableSignal} from '@angular/core';
import {NgClass, TitleCasePipe, UpperCasePipe} from '@angular/common';
import {LivreView} from '../../../../models/livreView';
import {CodeEtat} from '../../../../models/enum/code-etat.enum';
import {CodeEtatPipe} from '../../../../pipe/code-etat.pipe';
import {Router} from '@angular/router';
import {Button} from 'primeng/button';
import {MessageService} from 'primeng/api';
import {ReservationService} from '../../../../reservation/reservation-service';
import {EmpruntService} from '../../../../services/emprunt.service';
import {UtilisateurService} from '../../../../services/utilisateurService';

@Component({
  selector: 'app-affichage-livres',
  imports: [
    UpperCasePipe,
    TitleCasePipe,
    NgClass,
    CodeEtatPipe,
    Button
  ],
  templateUrl: './affichage-livres.html',
  styleUrl: './affichage-livres.css',
})
export class AffichageLivres {
  constructor(private empruntService: EmpruntService,
              private messageService: MessageService,
              private reservationService: ReservationService,
              private utilisateurService: UtilisateurService,
              private router: Router) {
  }

  public readonly codeEtat = CodeEtat;

  @Input() livres!: WritableSignal<LivreView[]>;
  @Input() userIdSignal!:WritableSignal<number | null>;

  public onclick(idLivre: number): void {
    this.router.navigate(['livres', idLivre]);
  }

  protected reserver(idLivre: number) {
    const selected= this.userIdSignal()
    if (!selected) {
      this.envoyerMessageErreurSelectionUtilisateur();
      return;
    }
    this.reservationService.jeReserve(idLivre, selected).subscribe({
      next: (response) => {
        if (response.status == 201) {
          this.messageService.add({
            severity: 'success',
            summary: 'Livre réservé',
            detail: 'Livre réservé, vous recevrez un mail pour venir le chercher.'
          })
          this.refresh()
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

  protected emprunter(idLivre: number) {
    const selected= this.userIdSignal()
    if (!selected) {
      this.envoyerMessageErreurSelectionUtilisateur();
      return;
    }

    this.empruntService.envoitEmprunt(idLivre, selected).subscribe({
      next: (response) => {
        if (response.status == 201) {
          this.messageService.add({
            severity: 'success',
            summary: 'Emprunt réussi'
          })
          this.refresh();
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

  envoyerMessageErreurSelectionUtilisateur() {
    this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Merci de sélectionner l\'usager·ère'});
  }

  rendre(id: number) {
    //TODO à implémenter
    this.refresh()
  }

  demandeRefresh = output<void>();

  refresh() {
    this.demandeRefresh.emit();
  }

  roleUtilisateur() : string|null {
    return this.utilisateurService.getRole();
  }
}
