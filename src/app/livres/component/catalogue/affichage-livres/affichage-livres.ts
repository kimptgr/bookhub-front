import {Component, input, InputSignal} from '@angular/core';
import {TitleCasePipe, UpperCasePipe} from '@angular/common';
import {LivreView} from '../../../../models/livreView';

@Component({
  selector: 'app-affichage-livres',
  imports: [
    UpperCasePipe,
    TitleCasePipe
  ],
  templateUrl: './affichage-livres.html',
  styleUrl: './affichage-livres.css',
})
export class AffichageLivres {
  livres: InputSignal<LivreView[]> = input.required();
}
