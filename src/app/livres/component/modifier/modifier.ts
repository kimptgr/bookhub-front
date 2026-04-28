import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {GenreService} from '../../../genre/genre-service';
import {EtatService} from '../../../etat/etat-service';
import {MessageService} from 'primeng/api';
import {Observable} from 'rxjs';
import {Genre} from '../../../models/genre';
import {Etat} from '../../../models/etat';
import {AsyncPipe, DatePipe} from '@angular/common';
import {InputText} from 'primeng/inputtext';
import {Message} from 'primeng/message';
import {Button, ButtonDirective} from 'primeng/button';
import {MultiSelect} from 'primeng/multiselect';
import {Select} from 'primeng/select';
import {DatePicker} from 'primeng/datepicker';
import {FloatLabel} from 'primeng/floatlabel';
import {Textarea} from 'primeng/textarea';
import {Image} from 'primeng/image';
import {Dialog} from 'primeng/dialog';
import {ProgressSpinner} from 'primeng/progressspinner';
import {isbnValidator} from '../nouveau/isbn.directive';
import {OpenlibrairyService} from '../../../clients/openlibrairy/openlibrairy.service';
import {LivreView} from '../../../models/livreView';
import {LivreService} from '../../../services/livre-service';

@Component({
  selector: 'app-modifier',
  imports: [
    ReactiveFormsModule,
    InputText,
    Message,
    AsyncPipe,
    Button,
    MultiSelect,
    Select,
    DatePicker,
    FloatLabel,
    Textarea,
    Image,
    Dialog,
    FormsModule,
    ProgressSpinner,
    RouterLink
  ],
  templateUrl: './modifier.html',
  styleUrl: './modifier.css',
})
export class Modifier implements OnInit {

  livreForm!: FormGroup;
  genres$!: Observable<Genre[]>;
  etats$!: Observable<Etat[]>;
  isShow: boolean = false;
  isLoading: boolean = false;
  labelGenre: string = '';
  idLivre!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private livreService: LivreService,
    private genreService: GenreService,
    private etatService: EtatService,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private openlibrairyService: OpenlibrairyService
  ) {
  }

  ngOnInit() {
    this.idLivre = parseInt(this.route.snapshot.paramMap.get('id') ?? '0');

    this.genres$ = this.genreService.getGenres();
    this.etats$ = this.etatService.getEtats();

    this.livreForm = this.fb.nonNullable.group({
      titre: ['', Validators.required],
      isbn: ['', [Validators.required, isbnValidator()]],
      auteurs: this.fb.array([this.createAuteurForm()]),
      genres: [[], Validators.required],
      idEtat: [1, Validators.required],
      synopsis: [''],
      urlImage: ['', Validators.pattern('https?://.+')],
      dateDeParution: [''],
    });

    this.livreService.getById(this.idLivre).subscribe({
      next: (livre:LivreView) => {
        this.auteurs.clear();
        livre.auteurs.forEach(auteur => {
          this.auteurs.push(this.fb.group({
            nom: [auteur.nom, Validators.required],
            prenom: [auteur.prenom]
          }));
        });

        this.livreForm.patchValue({
          titre: livre.titre,
          isbn: livre.isbn,
          genres: livre.genres.map(g => g.id),
          idEtat: livre.etat.id,
          synopsis: livre.synopsis,
          urlImage: livre.urlImage,
          dateDeParution: livre.dateDeParution ? new Date(livre.dateDeParution) : null
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Livre introuvable'
        });
        this.router.navigate(['/catalogue']);
      }
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.livreForm.get(controlName);
    return !!(control?.invalid && (control.touched || control.dirty));
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
      prenom: ['']
    });
  }

  addAuteur() {
    this.auteurs.push(this.createAuteurForm());
  }

  removeAuteur(index: number) {
    this.auteurs.removeAt(index);
  }

  onSubmit() {
    this.formatIsbn();
    this.livreForm.markAllAsTouched();
    if (this.livreForm.invalid) return;

    const raw = this.livreForm.getRawValue();
    const payload = {
      ...raw,
      dateDeParution: this.datePipe.transform(raw.dateDeParution, 'dd/MM/yyyy')
    };

    this.livreService.patchLivre(this.idLivre, payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Livre modifié',
          detail: 'Modifications enregistrées avec succès'
        });
        this.router.navigate(['/livres', this.idLivre]);
      },
      error: (error:any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Une erreur est survenue : ' + error.error
        });
      }
    });
  }

  resetForm() {
    this.auteurs.clear();
    this.addAuteur();
    this.livreForm.reset();
  }

  saveGenre() {
    this.isShow = false;
    if (this.labelGenre.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Le genre ne peut pas être vide.'
      });
      return;
    }
    this.genreService.postGenre(this.labelGenre).subscribe({
      next: () => {
        this.genres$ = this.genreService.getGenres();
        this.messageService.add({severity: 'success', summary: 'Genre ajouté'});
      }
    });
  }

  protected prechargerInformations() {
    this.formatIsbn();

    if (this.isbn.value.length === 0 || this.isbn.invalid) {
      this.messageService.add({
        severity: 'info',
        summary: 'Erreur',
        detail: 'Veuillez renseigner un ISBN valide'
      });
      return;
    }

    this.isLoading = true;
    this.openlibrairyService.getLivrePartiel(this.livreForm.get('isbn')?.value).subscribe(
      livre => {
        this.livreForm.patchValue({
          titre: livre.titre,
          auteurs: livre.auteur,
          urlImage: livre.urlImage,
          dateDeParution: new Date(livre.annee, 0),
        });
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: error
        });
      }
    );
  }

  private formatIsbn(): void {
    const control = this.livreForm.get('isbn');
    if (control) {
      control.patchValue(control.value.replaceAll(/[\s-]/g, ''));
    }
  }
}
