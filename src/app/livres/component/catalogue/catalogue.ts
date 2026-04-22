import {Component, signal, WritableSignal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MultiSelect} from 'primeng/multiselect';
import {FloatLabel} from 'primeng/floatlabel';
import {EtatService} from '../../../etat/etat-service';
import {GenreService} from '../../../genre/genre-service';
import {Select} from 'primeng/select';
import {InputText} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {LivreService} from '../../service/livre.service';
import {Paginator, PaginatorState} from 'primeng/paginator';
import {Livre} from '../../../models/livre';
import {Page} from '../../../type/Page';

@Component({
  selector: 'app-catalogue',
  imports: [
    ReactiveFormsModule,
    MultiSelect,
    FloatLabel,
    Select,
    InputText,
    Button,
    Paginator
  ],
  templateUrl: './catalogue.html',
  styleUrl: './catalogue.css',
})
export class Catalogue {
  public formgroup: FormGroup;
  public genresOptions: WritableSignal<any[]> = signal([]);
  public etatsOptions: WritableSignal<any[]> = signal([]);

  public livres: WritableSignal<Livre[]> = signal([]);
  public page: WritableSignal<Page | null> = signal(null);

  public first: number = 0;
  public rows: number = 20;

  public constructor(private readonly etatService: EtatService,
                     private readonly genreService: GenreService,
                     private readonly livreService: LivreService) {

    this.formgroup = new FormGroup({
      saisie: new FormControl<string>(''),
      genres: new FormControl<string>(''),
      disponibilite: new FormControl<string>('')
    });

    this.genreService.getGenres().subscribe({
      // si la requête ne retourne pas d'erreur
      next: (genres) => {
        // On met à jour la liste des genres pour le multi-select
        this.genresOptions.set(
          // On remplace chaque genre par son libellé
          genres.map(genre => genre.libelle)
        );
      },
    });

    this.etatService.getEtats().subscribe({
      next: (etats) => {
        this.etatsOptions.set(
          etats.map(etat => etat.libelle)
        );
      },
    });
  }


  public onSubmit(): void {
    console.log(this.first);
    console.log(this.rows);
    console.log(this.formgroup.value);

    this.livreService.faireRecherche(this.first, this.rows, this.formgroup.value).subscribe({
      next: (response) => {
        this.livres.set(response.content);

        const page: Page = {
          numberOfElements: response.numberOfElements,
          pageable: {
            pageNumber: response.pageable.pageNumber,
            pageSize: response.pageable.pageSize
          }
        };
        this.page.set(page);
      }
    });
  }

  public onPageChange(event: PaginatorState): void {
        this.first = event.first ?? 0;
        this.rows = event.rows ?? 20;
    }
}
