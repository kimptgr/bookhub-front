import {Component, signal, WritableSignal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MultiSelect} from 'primeng/multiselect';
import {FloatLabel} from 'primeng/floatlabel';
import {GenreService} from '../../../genre/genre-service';
import {InputText} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {Paginator, PaginatorState} from 'primeng/paginator';
import {Page} from '../../../type/Page';
import {AffichageLivres} from './affichage-livres/affichage-livres';
import {LivreService} from '../../../services/livre-service';
import {LivreView} from '../../../models/livreView';
import {ProgressSpinner} from 'primeng/progressspinner';
import {Message} from 'primeng/message';
import {CodeEtat} from '../../../models/enum/code-etat.enum';
import {ChoixUtilisateur} from './choix-utilisateur/choix-utilisateur';
import {UtilisateurService} from '../../../services/utilisateurService';

@Component({
  selector: 'app-catalogue',
  imports: [
    ReactiveFormsModule,
    MultiSelect,
    FloatLabel,
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
  public etatsOptions: any[];

  public livres: WritableSignal<LivreView[]> = signal([]);
  public page: WritableSignal<Page > = signal({
          totalElements: 12,
          pageable: {
            pageNumber: 0,
            pageSize: 12
          }
        });

  public isLoading: boolean = true;

  public userIdSelected:WritableSignal<number | null> = signal(null);

  public constructor(private readonly genreService: GenreService,
                     private readonly livreService: LivreService, private readonly utilisateurService: UtilisateurService) {

    this.formgroup = new FormGroup({
      saisie: new FormControl<string>(''),
      genres: new FormControl<string>(''),
      disponibilites: new FormControl<string>('')
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

    this.etatsOptions = Object.entries(CodeEtat).map(
      ([key, value]) => ({
        libelleEtat: value,
        valeurEtat: key
      })
    );

    // On retire l'état "INUTILISABLE" pour les utilisateurs
    if (this.utilisateurService.getRole() === 'UTILISATEUR') {
      this.etatsOptions = this.etatsOptions
        .filter(entry => entry.libelleEtat !== CodeEtat.INUTILISABLE);
    }

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
    const newPage: Page = this.page();
    newPage.pageable.pageNumber = event.page ?? 0;
    newPage.pageable.pageSize = event.rows ?? 12;

    this.page.set(newPage);

    this.onSubmit();
  }

  roleUtilisateur() : string|null {
    return this.utilisateurService.getRole();
  }
}


