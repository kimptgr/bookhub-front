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
import {UpdateEmpruntDTO} from '../../../../models/UpdateEmpruntDTO';

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

  demandeRefresh = output<void>();

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

    this.empruntService.envoiEmprunt(idLivre, selected).subscribe({
      next: (response) => {
        if (response.status === 201) {
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

  public rendreLivre(livre: LivreView): void {
    const userId = this.utilisateurService.getId();

    if (!userId) {
        this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Problème de récupération de compte utilisateur, veuillez vous reconnecter'});
        return;
    }

    const updateEmpruntDTO: UpdateEmpruntDTO = {
      idLivre: livre.id,
      idEmprunt: livre.idEmpruntActif,
      idEmprunteur: livre.idEmprunteur,
      dateRetour: new Date()
    };

    this.empruntService.rendreLivre(updateEmpruntDTO).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.messageService.add({severity: 'success', summary: 'Livre rendu', detail: 'Le retour du livre à été enregistré avec succès'});
          this.refresh();
        }
      },
      error: (err) => {
        this.messageService.add({severity: 'error', summary: 'Erreur', detail: "Problème lors de l'enregistrement du retour du livre, veuillez vous reconnecter et réessayer"});
      }
    });
  }

  refresh() {
    this.demandeRefresh.emit();
  }

  roleUtilisateur() : string|null {
    return this.utilisateurService.getRole();
  }
}
