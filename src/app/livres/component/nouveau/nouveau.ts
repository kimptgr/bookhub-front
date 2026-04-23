import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Message} from 'primeng/message';
import {GenreService} from '../../../genre/genre-service';
import {Genre} from '../../../models/genre';
import {Observable} from 'rxjs';
import {Etat} from '../../../models/etat';
import {EtatService} from '../../../etat/etat-service';
import {Button} from 'primeng/button';
import {AsyncPipe} from '@angular/common';
import {Select} from 'primeng/select';
import {MultiSelect} from 'primeng/multiselect';
import {DatePicker} from 'primeng/datepicker';
import {FloatLabel} from 'primeng/floatlabel';
import {isbnValidator} from './isbn.directive';
import {LivreService} from '../livre-service';
import {Textarea} from 'primeng/textarea';
import {Toast} from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-nouveau',
  imports: [
    ReactiveFormsModule,
    InputText,
    Message,
    AsyncPipe,
    Button,
    AsyncPipe,
    MultiSelect,
    Select,
    DatePicker,
    FloatLabel,
    Textarea,
    Toast
  ],
  templateUrl: './nouveau.html',
  styleUrl: './nouveau.css',
})
export class Nouveau implements OnInit{
  livreForm!: FormGroup;
  auteurForm!: FormGroup;
  genres$!: Observable<Genre[]>;
  etats$!: Observable<Etat[]>;

  constructor(private fb: FormBuilder, private genreService: GenreService, private etatService: EtatService, private livreService: LivreService, private messageService: MessageService) {
  }

  ngOnInit() {
    this.genres$ = this.genreService.getGenres();
    this.etats$ = this.etatService.getEtats();
    this.auteurForm = this.fb.group({
      nomAuteur: ['', Validators.required],
      prenomAuteur: [''],
    })
    this.livreForm = this.fb.nonNullable.group({
      titre: ['', Validators.required],
      isbn: ['', [Validators.required, isbnValidator()]],
      auteurs: this.fb.array([this.createAuteurForm()], Validators.minLength(1)),
      genres: [[], Validators.required],
      idEtat: [1, [Validators.required]],
      synopsis: [''],
      urlImage: ['', Validators.pattern('https?://.+')],
      dateDeParution: [''],
    })
  }


  isInvalid(controlName: string): boolean {
    const control = this.livreForm.get(controlName);
    return !!(control &&
      control.invalid &&
      (control.touched || control.dirty));
  }


  get auteurs() {
    return this.livreForm.get('auteurs') as FormArray;
  }

  get isbn() {
    return this.livreForm.get('isbn') as FormArray;
  }

  createAuteurForm() {
    return this.fb.group({
      nomAuteur: ['', Validators.required],
      prenomAuteur: [''],
    })
  }

  addAuteur() {
  const auteurForm = this.fb.group({
    nomAuteur: ['', Validators.required],
    prenomAuteur: [''],
  })
    this.auteurs.push(auteurForm);
  }

  removeAuteur(index: number) {
    this.auteurs.removeAt(index);
  }

  onSubmit() {
    this.livreForm.markAllAsTouched();
    if (!this.livreForm.invalid) {
      this.livreService.postLivre(this.livreForm.value)
        .subscribe({
        next:() => {
          this.messageService.add({severity: 'success', summary: 'Livre ajouté', detail: 'Livre ajouté avec succès'})
          this.resetForm();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Une erreur est survenue lors de l\'ajout du livre \n' + error.error
          })
          console.error(error);
        }
    }
      )
    }
  }

  resetForm() {
    this.auteurs.clear();
    this.addAuteur()
    this.livreForm.reset();
  }
}
