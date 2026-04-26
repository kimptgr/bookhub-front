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
import {AsyncPipe, DatePipe} from '@angular/common';
import {Select} from 'primeng/select';
import {MultiSelect} from 'primeng/multiselect';
import {DatePicker} from 'primeng/datepicker';
import {FloatLabel} from 'primeng/floatlabel';
import {isbnValidator} from './isbn.directive';
import {LivreService} from '../livre-service';
import {Textarea} from 'primeng/textarea';
import {MessageService} from 'primeng/api';
import {OpenlibrairyService} from '../../../clients/openlibrairy/openlibrairy.service';
import {Image} from 'primeng/image';
import {ProgressSpinner} from 'primeng/progressspinner';

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
    Image,
    ProgressSpinner
  ],
  templateUrl: './nouveau.html',
  styleUrl: './nouveau.css',
})
export class Nouveau implements OnInit{
  livreForm!: FormGroup;
  auteurForm!: FormGroup;
  genres$!: Observable<Genre[]>;
  etats$!: Observable<Etat[]>;
  isLoading: boolean = false;

  constructor(private datePipe: DatePipe, private fb: FormBuilder, private genreService: GenreService, private etatService: EtatService, private livreService: LivreService, private messageService: MessageService, private openlibrairyService: OpenlibrairyService) {
  }

  ngOnInit() {
    this.genres$ = this.genreService.getGenres();
    this.etats$ = this.etatService.getEtats();
    this.auteurForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: [''],
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

  get urlImage() {
    return this.livreForm.get('urlImage') as FormArray;
  }

  createAuteurForm() {
    return this.fb.group({
      nom: ['', Validators.required],
      prenom: [''],
    })
  }

  addAuteur() {
  const auteurForm = this.fb.group({
    nom: ['', Validators.required],
    prenom: [''],
  })
    this.auteurs.push(auteurForm);
  }

  removeAuteur(index: number) {
    this.auteurs.removeAt(index);
  }

  onSubmit() {
    this.formatIsbn();

    this.livreForm.markAllAsTouched();
    if (!this.livreForm.invalid) {
      const raw = this.livreForm.getRawValue();
      const payload = {
        ...raw,
        dateDeParution:
          this.datePipe.transform(
            raw.dateDeParution,
            'dd/MM/yyyy'
          )
      }
      this.livreService.postLivre(payload)
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

  protected prechargerInformations() {
    this.formatIsbn();

    if (this.isbn.value.length === 0 || this.isbn.invalid) {
      this.messageService.add({severity: 'info', summary: 'Erreur', detail: 'Veuillez renseigner un ISBN valide'})
      return;
    }

    this.isLoading = true;
    this.openlibrairyService.getLivrePartiel(this.livreForm.get("isbn")?.value).subscribe(
      livre => {

        this.livreForm.patchValue({
          titre: livre.titre,
          auteurs: livre.auteur,
          urlImage: livre.urlImage,
          dateDeParution: new Date(livre.annee,0),
        });

        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
        this.messageService.add({severity: 'error', summary: 'Erreur', detail: error});
      }
    )
  }

  /**
   * Fonction pour supprimer les espaces et les tirets
   */
  private formatIsbn(): void {
    const control = this.livreForm.get('isbn');

    if (control) {
      control.patchValue(control.value.replaceAll(/[\s-]/g, ''));
    }
  }
}
