import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {UtilisateurAdmin} from '../models/UtilisateurAdmin';
import {AdminService} from '../services/admin-service';
import {MessageService} from 'primeng/api';
import {Button} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {Select} from 'primeng/select';
import {FormsModule} from '@angular/forms';
import {ToggleSwitch} from 'primeng/toggleswitch';
import { Dialog } from 'primeng/dialog';
import {Role} from '../models/enum/roles-enum';

@Component({
  selector: 'app-dash-board-admin',
  imports: [
    Button,
    TableModule,
    Select,
    FormsModule,
    ToggleSwitch,
    Dialog
  ],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.css',
})
export class DashboardAdmin implements OnInit {


  utilisateurs: UtilisateurAdmin[] = [];

  // permet d'afficher des sélecteurs pour choisir les rôles
  modeEditionMasse: boolean = false;
  roles = Object.values(Role);

  protected utilisateurSelectionne: UtilisateurAdmin | null = null;
  protected isShow: boolean = false;

  constructor(
    private adminService: AdminService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.chargerUtilisateurs();
  }

  chargerUtilisateurs() {
    this.adminService.getUtilisateurs().subscribe({
      next: (data) => {
        this.utilisateurs = data;
        this.cdr.detectChanges();
      },
      error: () => this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de charger les utilisateurs'
      })
    });
  }




  // Modification cas par cas
  modifierCasParCas(utilisateur: UtilisateurAdmin) {
    this.adminService.modifierUtilisateur(utilisateur.id, utilisateur.role, utilisateur.desactive)
      .subscribe({
        next: () => this.messageService.add({
          severity: 'success',
          summary: 'Modifié',
          detail: `${utilisateur.prenom}  ${utilisateur.nom} mis à jour`
        }),
        error: () => this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Modification impossible'
        })
      });
  }

  // Sauvegarde en masse
  sauvegarderEnMasse() {
    const updates = this.utilisateurs.map(u => ({id: u.id, role: u.role}));
    this.adminService.modifierRolesEnMasse(updates).subscribe({
      next: () => {
        this.modeEditionMasse = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Sauvegardé',
          detail: 'Rôles mis à jour'
        });
      },
      error: () => this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Sauvegarde impossible'
      })
    });
  }
}
