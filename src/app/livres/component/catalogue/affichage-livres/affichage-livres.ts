import {Component, effect, input, InputSignal} from '@angular/core';
import {Livre} from '../../../../models/livre';
import {NgOptimizedImage, TitleCasePipe, UpperCasePipe} from '@angular/common';

@Component({
  selector: 'app-affichage-livres',
  imports: [
    NgOptimizedImage,
    UpperCasePipe,
    TitleCasePipe
  ],
  templateUrl: './affichage-livres.html',
  styleUrl: './affichage-livres.css',
})
export class AffichageLivres {
  livres: InputSignal<Livre[]> = input.required();

  // constructor() {
  //   effect(() => {
  //     console.log(this.livres());
  //   })
  // }
}
