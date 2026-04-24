import { Component } from '@angular/core';
// importe FormBuilder : pour créer un formulaire réactif, Validators : permet d'utiliser des validateurs existants,
// ReactiveFormsModule : pour que le formulaire soit réactifs dans le HTML
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
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


  // une instance du service, le service d'authentification et le service de navigation pour la redirection
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.authService.connexion(this.form.value).subscribe({
      next: () => this.router.navigate(['/livres/nouveau']),  // redirection après connexion TODO : modifier en fonction des rôles /catalogue
      error: () => this.erreur = 'Email ou mot de passe incorrect'
    });
  }
}
