import {Component, signal, WritableSignal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MultiSelect} from 'primeng/multiselect';
import {FloatLabel} from 'primeng/floatlabel';
import {GenreService} from '../../../genre/genre-service';
import {Select} from 'primeng/select';
import {InputText} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {Paginator, PaginatorState} from 'primeng/paginator';
import {Page} from '../../../type/Page';
import {AffichageLivres} from './affichage-livres/affichage-livres';
import {LivreService} from '../livre-service';
import {LivreView} from '../../../models/livreView';
import {ProgressSpinner} from 'primeng/progressspinner';
import {Message} from 'primeng/message';
import {CodeEtat} from '../../../models/enum/code-etat.enum';
import {ChoixUtilisateur} from './choix-utilisateur/choix-utilisateur';

@Component({
  selector: 'app-catalogue',
  imports: [
    ReactiveFormsModule,
    MultiSelect,
    FloatLabel,
    Select,
    InputText,
    Button,
    Paginator,
    AffichageLivres,
    ProgressSpinner,
    Message,
    ChoixUtilisateur
  ],
  templateUrl: './catalogue.html',
  styleUrl: './catalogue.css',
})
export class Catalogue {
  public formgroup: FormGroup;
  public genresOptions: WritableSignal<any[]> = signal([]);
  public etatsOptions = Object.entries(CodeEtat).map(
    ([key, value]) => ({
      libelleEtat: value,
      valeurEtat: key
    })
  );

  public livres: WritableSignal<LivreView[]> = signal([]);
  public page: WritableSignal<Page > = signal({
          totalElements: 20,
          pageable: {
            pageNumber: 0,
            pageSize: 20
          }
        });

  public isLoading: boolean = true;

  public constructor(private readonly genreService: GenreService,
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

    // On lance la recherche dès l'arrivée sur l'écran
    this.onSubmit();
  }


  public onSubmit(): void {

    this.livreService.faireRecherche(this.page().pageable.pageNumber, this.page().pageable.pageSize, this.formgroup.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.livres.set(response.content);

        const page: Page = {
          totalElements: response.totalElements,
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
    console.log(event);
    const newPage: Page = this.page();
    newPage.pageable.pageNumber = event.page ?? 0;
    newPage.pageable.pageSize = event.rows ?? 20;

    this.page.set(newPage);

    this.onSubmit();
  }
}
