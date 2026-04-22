import { Component } from '@angular/core';
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

@Component({
  selector: 'app-nouveau',
  imports: [
    ReactiveFormsModule,
    InputText,
    Message,
    AsyncPipe,
    Button,
    AsyncPipe,
    Select
  ],
  templateUrl: './nouveau.html',
  styleUrl: './nouveau.css',
})
export class Nouveau {
  livreForm: FormGroup;
  genres$: Observable<Genre[]>;
  etats$: Observable<Etat[]>;

  constructor(private formBuilder: FormBuilder, private genreService: GenreService, private etatService: EtatService) {
    this.genres$ = this.genreService.getGenres();
    this.etats$ = this.etatService.getEtats();
    this.livreForm = this.formBuilder.group({
      title: ['', Validators.required],
      isbn: ['', [Validators.required, Validators.min(10)]],
      auteurs: this.formBuilder.array([], Validators.required),
      genres: [[''], Validators.required]
    })
  this.addAuteur();
  }

  isInvalid(label: string) {
    if (label === 'title') {
        return this.livreForm.get(label)?.invalid
      }
    if (label === 'isbn') {
      let isbn = this.livreForm.get(label)?.value;

      if (!isbn) return false;

      isbn = isbn.replace('_', '').trim();
        return isbn.match("\d{10}|\d{13}|\d{9}X");
      }
    return this.livreForm.get(label)?.invalid && this.livreForm.get(label)?.touched
  }

  get auteurs() {
    return this.livreForm.get('auteurs') as FormArray;
  }

  addAuteur() {
  const auteurForm = this.formBuilder.group({
    nomAuteur: ['', Validators.required],
    prenomAuteur: [''],
  })
    this.auteurs.push(auteurForm);
  }

  removeAuteur(index: number) {
    this.auteurs.removeAt(index);
  }

  onSubmit() {
    console.log(this.livreForm.value);
  }

}
