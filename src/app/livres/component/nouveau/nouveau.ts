import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Message} from 'primeng/message';
import{ AbstractControl } from'@angular/forms';
import {GenreService} from '../../../genre/genre-service';
import {Genre} from '../../../models/genre';
import {map, Observable} from 'rxjs';
import {Etat} from '../../../models/etat';
import {EtatService} from '../../../etat/etat-service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-nouveau',
  imports: [
    ReactiveFormsModule,
    InputText,
    Message,
    AsyncPipe
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
    })

  }

  onSubmit() {
    console.log(this.livreForm.value);
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

}
