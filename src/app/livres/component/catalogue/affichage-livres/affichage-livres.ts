import {Component, inject, input, InputSignal} from '@angular/core';
import {NgClass, TitleCasePipe, UpperCasePipe} from '@angular/common';
import {LivreView} from '../../../../models/livreView';
import {CodeEtat} from '../../../../models/enum/code-etat.enum';
import {CodeEtatPipe} from '../../../../pipe/code-etat.pipe';
import {Router} from '@angular/router';

@Component({
  selector: 'app-affichage-livres',
  imports: [
    UpperCasePipe,
    TitleCasePipe,
    NgClass,
    CodeEtatPipe
  ],
  templateUrl: './affichage-livres.html',
  styleUrl: './affichage-livres.css',
})
export class AffichageLivres {
  public readonly router: Router = inject(Router);
  public readonly codeEtat = CodeEtat;

  public livres: InputSignal<LivreView[]> = input.required();

  public onclick(idLivre: number): void {
    this.router.navigate(['livres', idLivre]);
  }
}
