import { Component } from '@angular/core';
// importe FormBuilder : pour créer un formulaire réactif, Validators : permet d'utiliser des validateurs existants,
// ReactiveFormsModule : pour que le formulaire soit réactifs dans le HTML
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { AuthService } from '../../services/authService';
import { CommonModule } from '@angular/common';
import {InputText} from 'primeng/inputtext';
import {FloatLabel} from 'primeng/floatlabel';
import {Password} from 'primeng/password';
import {Button} from 'primeng/button';
import {Message} from 'primeng/message';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, InputText, FloatLabel, Password, Button, Message, RouterLink],
  templateUrl: './connexion.html',
  styleUrl: './connexion.css',
})
export class Connexion {
  form: FormGroup;
  erreur: string = '';
  private returnUrl: string = '/catalogue';


  // une instance du service, le service d'authentification et le service de navigation pour la redirection
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // avec le guard, je récupère l'url que le client essai d'atteindre s'il n'y en a pas, je redirige vers catalogue
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? '/catalogue';

  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.authService.connexion(this.form.value).subscribe({
      next: () => this.router.navigateByUrl(this.returnUrl),
      error: () => this.erreur = 'Email ou mot de passe incorrect'
    });
  }
}
