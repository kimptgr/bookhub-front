import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../services/authService';
import {CommonModule} from '@angular/common';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {Message} from 'primeng/message';
import {Password} from 'primeng/password';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [
    ReactiveFormsModule
    , CommonModule, FloatLabel, InputText, Message, Password, Button, RouterLink
  ],
  templateUrl: './inscription.html',
  styleUrl: './inscription.css',
})
export class Inscription {

  form: FormGroup;
  erreur: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      prenom: [''],
      email: ['', [Validators.required, Validators.email]],
      // La regex correspond à celle de ton @Pattern côté back
      password: ['', [Validators.required, Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{12,}$/
      )]],
      telephone: ['', [Validators.pattern(/^(0|\+33[ .-]?0?)[1-9]([ .-]?\d{2}){4}$/)]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.authService.inscription(this.form.value).subscribe({
      next: () => this.router.navigate(['/connexion']),
      error: () => this.erreur = 'Une erreur est survenue'
    });
  }
}
