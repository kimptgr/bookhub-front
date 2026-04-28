import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {Password} from 'primeng/password';
import {Button} from 'primeng/button';
import {Message} from 'primeng/message';
import {Dialog} from 'primeng/dialog';
//permet d'avoir des onglets sur la page
import {TabsModule} from 'primeng/tabs';
import {Profil} from '../models/Profil';
import {ProfilService} from '../services/profil-service';
import {AuthService} from '../services/authService';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-profil-component',
  imports: [ReactiveFormsModule, FormsModule, CommonModule,
    FloatLabel, InputText, Password, Button, Message,
    Dialog, TabsModule],
  templateUrl: './profil-component.html',
  styleUrl: './profil-component.css',
})
export class ProfilComponent implements OnInit {

  // Données profil
  profil: Profil | null = null;
  modeEdition: boolean = false;

  // Formulaire modification profil
  profilForm!: FormGroup;

  // Gestion des dialogs
  showDialogAncienMdp: boolean = false;   // 1ère popup : ancien mdp
  showDialogNouveauMdp: boolean = false;  // 2ème popup : nouveau mdp
  showDialogSuppression: boolean = false; // popup confirmation suppression

  // Formulaires des dialogs
  ancienMdpForm!: FormGroup;
  nouveauMdpForm!: FormGroup;

  // Messages d'erreur
  erreurAncienMdp: string = '';
  erreurNouveauMdp: string = '';

  constructor(
    private fb: FormBuilder,
    private profilService: ProfilService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private cdr : ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Formulaire modification profil
    this.profilForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: [''],
      email: ['', [Validators.required, Validators.email]]
    });

    // Formulaire ancien mot de passe
    this.ancienMdpForm = this.fb.group({
      ancienMotDePasse: ['', Validators.required]
    });

    // Formulaire nouveau mot de passe
    this.nouveauMdpForm = this.fb.group({
      nouveauMotDePasse: ['', [Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{12,}$/)
      ]]
    });

    this.chargerProfil();
  }

  chargerProfil() {
    this.profilService.getProfil().subscribe({
      next: (data) => {
        this.profil = data;
        this.profilForm.patchValue(data);
        this.cdr.detectChanges();
      },
      error: () => this.messageService.add({
        severity: 'error', summary: 'Erreur', detail: 'Impossible de charger le profil'
      })
    });
  }

  sauvegarderProfil() {
    if (this.profilForm.invalid) return;
    this.profilService.updateProfil(this.profilForm.value).subscribe({
      next: () => {
        this.modeEdition = false;
        this.chargerProfil(); // recharge pour afficher les nouvelles données
        this.messageService.add({ severity: 'success', summary: 'Profil mis à jour' });
        this.cdr.detectChanges();
      },
      error: () => this.messageService.add({
        severity: 'error', summary: 'Erreur', detail: 'Modification impossible'
      })
    });
  }

  // Étape 1 : vérifier l'ancien mot de passe
  validerAncienMdp() {
    if (this.ancienMdpForm.invalid) return;
    this.profilService.verifierMotDePasse(this.ancienMdpForm.value).subscribe({
      next: () => {
        // Ancien mdp correct → on ouvre la 2ème popup
        this.showDialogAncienMdp = false;
        this.showDialogNouveauMdp = true;
        this.erreurAncienMdp = '';
        this.cdr.detectChanges();
      },
      error: () => {
        this.erreurAncienMdp = 'Mot de passe incorrect';
        this.cdr.detectChanges();
      }
    });
  }

  // Étape 2 : enregistrer le nouveau mot de passe
  validerNouveauMdp() {
    if (this.nouveauMdpForm.invalid) return;
    const payload = {
      ancienMotDePasse: this.ancienMdpForm.value.ancienMotDePasse,
      nouveauMotDePasse: this.nouveauMdpForm.value.nouveauMotDePasse
    };
    this.profilService.updateMotDePasse(payload).subscribe({
      next: () => {
        this.showDialogNouveauMdp = false;
        this.ancienMdpForm.reset();
        this.nouveauMdpForm.reset();
        this.messageService.add({ severity: 'success', summary: 'Mot de passe modifié' });
        this.cdr.detectChanges();
      },
      error: () => this.erreurNouveauMdp = 'Une erreur est survenue'
    });
  }

  // Suppression du compte
  confirmerSuppression() {
    this.profilService.supprimerCompte().subscribe({
      next: () => {
        this.authService.deconnexion(); // supprime le token
        this.router.navigate(['/connexion']);
      },
      error: () => this.messageService.add({
        severity: 'error', summary: 'Erreur', detail: 'Suppression impossible'
      })
    });
  }
}
