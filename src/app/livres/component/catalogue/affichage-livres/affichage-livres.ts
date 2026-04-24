import {Component, input, InputSignal} from '@angular/core';
import {Livre} from '../../../../models/livre';
import {TitleCasePipe, UpperCasePipe} from '@angular/common';

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
  livres: InputSignal<Livre[]> = input.required();
}
